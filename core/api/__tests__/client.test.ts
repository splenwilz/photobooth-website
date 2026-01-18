import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient, ApiError } from '../client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock window for client-side tests
interface MockWindow {
  location: {
    href: string
  }
}

const mockWindow: MockWindow = {
  location: { href: '' },
}

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment
    delete process.env.API_BASE_URL
    delete process.env.NEXT_PUBLIC_API_BASE_URL
    // Set default for tests
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Environment detection', () => {
    it('should use API_BASE_URL on server', async () => {
      process.env.API_BASE_URL = 'http://server-api:8000'
      delete process.env.NEXT_PUBLIC_API_BASE_URL

      // Mock server environment (no window)
      const originalWindow = global.window
      // @ts-expect-error - removing window for server test
      delete global.window

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://server-api:8000/api/v1/test',
        expect.objectContaining({
          credentials: 'include',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )

      // Restore window
      global.window = originalWindow
    })

    it('should use NEXT_PUBLIC_API_BASE_URL on client', async () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = 'http://client-api:8000'
      delete process.env.API_BASE_URL

      // Mock client environment
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test')

      // Should route through proxy on client
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/proxy?path=%2Fapi%2Fv1%2Ftest',
        expect.objectContaining({
          credentials: 'include',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should throw error if no API URL configured', async () => {
      delete process.env.API_BASE_URL
      delete process.env.NEXT_PUBLIC_API_BASE_URL

      const originalWindow = global.window
      // @ts-expect-error - removing window for server test
      delete global.window

      await expect(apiClient('/api/v1/test')).rejects.toThrow(
        'API base URL is not configured'
      )

      global.window = originalWindow
    })
  })

  describe('Token attachment', () => {
    it('should attach Authorization header on server when token exists', async () => {
      const originalWindow = global.window
      // @ts-expect-error - removing window for server test
      delete global.window

      // Mock cookies
      const mockCookies = {
        get: vi.fn((name: string) => {
          if (name === 'auth_access_token') {
            return { value: 'test-access-token' }
          }
          return undefined
        }),
      }

      vi.doMock('next/headers', () => ({
        cookies: vi.fn(() => Promise.resolve(mockCookies)),
      }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test')

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1].headers as HeadersInit

      expect(headers).toHaveProperty('Authorization', 'Bearer test-access-token')

      global.window = originalWindow
    })

    it('should not attach Authorization header on client (proxy handles it)', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test')

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1].headers as HeadersInit

      // Client routes through proxy, proxy attaches token server-side
      expect(headers).not.toHaveProperty('Authorization')
    })
  })

  describe('Token expiry detection', () => {
    it('should detect expired token from WWW-Authenticate header', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      // First call: 401 with expired token header
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: new Headers({
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="The access token expired"',
          }),
          text: async () => JSON.stringify({ detail: 'Token has expired' }),
          clone: function () {
            return this
          },
        })
        // Refresh call
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        })
        // Retry after refresh
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'success' }),
        })

      const result = await apiClient('/api/v1/users')

      expect(mockFetch).toHaveBeenCalledTimes(3)
      // First call
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        '/api/proxy?path=%2Fapi%2Fv1%2Fusers',
        expect.objectContaining({
          credentials: 'include',
        })
      )
      // Refresh call
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        '/api/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      )
      // Retry call
      expect(mockFetch).toHaveBeenNthCalledWith(
        3,
        '/api/proxy?path=%2Fapi%2Fv1%2Fusers',
        expect.objectContaining({
          credentials: 'include',
        })
      )

      expect(result).toEqual({ data: 'success' })
    })

    it('should throw ApiError if refresh fails', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      // First call: 401 with expired token
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: new Headers({
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="The access token expired"',
          }),
          text: async () => JSON.stringify({ detail: 'Token has expired' }),
          clone: function () {
            return this
          },
        })
        // Refresh fails
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })

      // Should throw ApiError with isSessionExpired flag - calling code handles navigation
      try {
        await apiClient('/api/v1/users')
        expect.fail('Should have thrown ApiError')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(401)
        expect((error as ApiError).message).toBe('Session expired. Please sign in again.')
        expect((error as ApiError).isSessionExpired).toBe(true)
      }
    })

    it('should not refresh on non-expiry 401 errors', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({
          'WWW-Authenticate': 'Bearer realm="api", error="invalid_token"',
        }),
        text: async () => JSON.stringify({ detail: 'Invalid credentials' }),
        statusText: 'Unauthorized',
        clone: function () {
          return this
        },
      })

      try {
        await apiClient('/api/v1/users')
        expect.fail('Should have thrown ApiError')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(401)
        // Non-expiry 401 errors should not have isSessionExpired flag
        expect((error as ApiError).isSessionExpired).toBe(false)
      }

      // Should not call refresh
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error handling', () => {
    it('should parse JSON error responses', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ detail: 'Bad request' }),
        statusText: 'Bad Request',
      })

      await expect(apiClient('/api/v1/test')).rejects.toThrow('Bad request')
    })

    it('should handle non-JSON error responses', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
        statusText: 'Internal Server Error',
      })

      await expect(apiClient('/api/v1/test')).rejects.toThrow('Internal Server Error')
    })

    it('should use statusText if parsing fails', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => {
          throw new Error('Parse error')
        },
        statusText: 'Internal Server Error',
      })

      await expect(apiClient('/api/v1/test')).rejects.toThrow('Internal Server Error')
    })
  })

  describe('Request configuration', () => {
    it('should include credentials in requests', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test')

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('credentials', 'include')
    })

    it('should merge custom headers', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      await apiClient('/api/v1/test', {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      })

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1].headers as HeadersInit
      expect(headers).toHaveProperty('X-Custom-Header', 'custom-value')
    })

    it('should pass request body', async () => {
      global.window = mockWindow as unknown as Window & typeof globalThis

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      const body = JSON.stringify({ test: 'data' })
      await apiClient('/api/v1/test', {
        method: 'POST',
        body,
      })

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('body', body)
    })
  })
})

