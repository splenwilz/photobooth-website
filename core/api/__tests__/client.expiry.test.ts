import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Test token expiry detection logic
 * This tests the isExpiredByHeader function indirectly through apiClient
 */

interface MockWindow {
  location: {
    href: string
  }
}

const mockWindow: MockWindow = {
  location: { href: '' },
}

describe('Token expiry detection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
  })

  it('should detect expired token from FastAPI WWW-Authenticate header', async () => {
    const { apiClient } = await import('../client')

    const mockFetch = vi.fn()
    global.fetch = mockFetch
    global.window = mockWindow as unknown as Window & typeof globalThis

    // 401 with FastAPI-style expired token header
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
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'success' }),
      })

    const result = await apiClient('/api/v1/test')

    // Should have called refresh
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      '/api/auth/refresh',
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ data: 'success' })
  })

  it('should detect expired token from custom X-Token-Expired header', async () => {
    const { apiClient } = await import('../client')

    const mockFetch = vi.fn()
    global.fetch = mockFetch
    global.window = mockWindow as unknown as Window & typeof globalThis

    // 401 with custom expired token header
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({
          'X-Token-Expired': 'true',
        }),
        text: async () => JSON.stringify({ detail: 'Token expired' }),
        clone: function () {
          return this
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'success' }),
      })

    const result = await apiClient('/api/v1/test')

    // Should have called refresh
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result).toEqual({ data: 'success' })
  })

  it('should NOT detect expiry for invalid_token without expired description', async () => {
    const { apiClient } = await import('../client')

    const mockFetch = vi.fn()
    global.fetch = mockFetch
    global.window = mockWindow as unknown as Window & typeof globalThis

    // 401 with invalid_token but NOT expired
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers({
        'WWW-Authenticate': 'Bearer realm="api", error="invalid_token"',
      }),
      text: async () => JSON.stringify({ detail: 'Invalid token format' }),
      statusText: 'Unauthorized',
      clone: function () {
        return this
      },
    })

    await expect(apiClient('/api/v1/test')).rejects.toThrow()

    // Should NOT have called refresh
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).not.toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('should handle case-insensitive header matching', async () => {
    const { apiClient } = await import('../client')

    const mockFetch = vi.fn()
    global.fetch = mockFetch
    global.window = mockWindow as unknown as Window & typeof globalThis

    // 401 with uppercase header values
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({
          'WWW-Authenticate':
            'Bearer realm="api", ERROR="INVALID_TOKEN", ERROR_DESCRIPTION="THE ACCESS TOKEN EXPIRED"',
        }),
        text: async () => JSON.stringify({ detail: 'Token has expired' }),
        clone: function () {
          return this
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'success' }),
      })

    const result = await apiClient('/api/v1/test')

    // Should detect expiry (case-insensitive)
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result).toEqual({ data: 'success' })
  })
})

