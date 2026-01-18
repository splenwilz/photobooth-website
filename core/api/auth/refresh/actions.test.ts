import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockRefreshToken = vi.fn()
const mockUpdateTokenCookies = vi.fn()
const mockClearAuthCookies = vi.fn()
const mockCookieStore = {
  get: vi.fn(),
}

vi.mock('./services', () => ({
  refreshToken: mockRefreshToken,
}))

vi.mock('@/lib/auth', () => ({
  updateTokenCookies: mockUpdateTokenCookies,
  clearAuthCookies: mockClearAuthCookies,
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

describe('refreshTokenAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully refresh tokens when refresh token exists', async () => {
    const { refreshTokenAction } = await import('./actions')

    mockCookieStore.get.mockReturnValue({
      value: 'valid-refresh-token',
    })

    mockRefreshToken.mockResolvedValue({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    })

    const result = await refreshTokenAction()

    expect(result).toEqual({ success: true })
    expect(mockRefreshToken).toHaveBeenCalledWith({
      refresh_token: 'valid-refresh-token',
    })
    expect(mockUpdateTokenCookies).toHaveBeenCalledWith({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    })
    expect(mockClearAuthCookies).not.toHaveBeenCalled()
  })

  it('should return error when refresh token is missing', async () => {
    const { refreshTokenAction } = await import('./actions')

    mockCookieStore.get.mockReturnValue(undefined)

    const result = await refreshTokenAction()

    expect(result).toEqual({
      success: false,
      error: 'No refresh token available',
    })
    expect(mockClearAuthCookies).toHaveBeenCalled()
    expect(mockRefreshToken).not.toHaveBeenCalled()
  })

  it('should handle refresh service errors', async () => {
    const { refreshTokenAction } = await import('./actions')

    mockCookieStore.get.mockReturnValue({
      value: 'valid-refresh-token',
    })

    mockRefreshToken.mockRejectedValue(new Error('Network error'))

    const result = await refreshTokenAction()

    expect(result).toEqual({
      success: false,
      error: 'Network error',
    })
    expect(mockClearAuthCookies).toHaveBeenCalled()
  })

  it('should handle non-Error exceptions', async () => {
    const { refreshTokenAction } = await import('./actions')

    mockCookieStore.get.mockReturnValue({
      value: 'valid-refresh-token',
    })

    mockRefreshToken.mockRejectedValue('String error')

    const result = await refreshTokenAction()

    expect(result).toEqual({
      success: false,
      error: 'Failed to refresh token',
    })
    expect(mockClearAuthCookies).toHaveBeenCalled()
  })
})

