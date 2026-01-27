/**
 * Custom error class for API errors with status code and parsed error message
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: unknown,
    public isSessionExpired: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Parse error response from API
 * Extracts error message from JSON response (detail or message field)
 */
async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const errorText = await response.text();
    // Try to parse as JSON
    const errorJson = JSON.parse(errorText);

    // Handle array of validation errors (FastAPI/Pydantic format)
    if (Array.isArray(errorJson)) {
      // Extract first error message
      const firstError = errorJson[0];
      if (firstError?.msg) {
        // Clean up "Value error, " prefix if present
        return firstError.msg.replace(/^Value error,\s*/i, '');
      }
      return JSON.stringify(errorJson);
    }

    // Handle { detail: [...] } format (FastAPI validation errors)
    if (Array.isArray(errorJson.detail)) {
      const firstError = errorJson.detail[0];
      if (firstError?.msg) {
        return firstError.msg.replace(/^Value error,\s*/i, '');
      }
      return JSON.stringify(errorJson.detail);
    }

    // Extract detail or message field (common API error formats)
    return errorJson.detail || errorJson.message || errorText;
  } catch {
    // If parsing fails, use status text
    return response.statusText || "An error occurred";
  }
}

function getApiBaseUrl(): string {
  const serverUrl = process.env.API_BASE_URL
  if (serverUrl) return serverUrl.replace(/\/+$/, '') // Remove trailing slashes
  const clientUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (clientUrl) return clientUrl.replace(/\/+$/, '') // Remove trailing slashes
  throw new Error("API base URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.")
}

/**
 * Prefer header-based expiry detection:
 * - WWW-Authenticate: Bearer error="expired_token"
 * - or custom: X-Token-Expired: true
 * @see https://www.rfc-editor.org/rfc/rfc6750#section-3
 */
function isExpiredByHeader(res: Response): boolean {
  const wwwAuth = res.headers.get('WWW-Authenticate') || ''
  const lower = wwwAuth.toLowerCase()

  // FastAPI example: Bearer error="invalid_token", error_description="The access token expired"
  const isInvalidToken = lower.includes('error="invalid_token"')
  const isExpiredDesc = lower.includes('expired')

  // Optional custom header support if you ever add it
  const customExpired = res.headers.get('X-Token-Expired') === 'true'

  return (isInvalidToken && isExpiredDesc) || customExpired
}

/**
 * Single refresh trigger (same server action for client + server).
 * Client: POST /api/auth/refresh
 * Server: call action directly
 * @see https://nextjs.org/docs/app/building-your-application/authentication
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
async function triggerRefresh(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      const r = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      return r.ok
    } else {
      const { refreshTokenAction } = await import('@/core/api/auth/refresh/actions')
      const result = await refreshTokenAction()
      return result.success
    }
  } catch (e) {
    console.error('Token refresh failed:', e)
    return false
  }
}

/**
 * API client with improved error handling
 * Parses error responses and throws user-friendly error messages
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const isClient = typeof window !== 'undefined'
  const apiBaseUrl = getApiBaseUrl()

  /**
   * Get server-side auth headers from HTTP-only cookie
   * Called inside makeRequest() to ensure fresh token after refresh
   * @see https://nextjs.org/docs/app/api-reference/functions/cookies
   */
  async function getServerAuth(): Promise<Record<string, string>> {
    if (isClient) return {}
    
    const { cookies } = await import('next/headers')
    const token = (await cookies()).get('auth_access_token')?.value
    const h: Record<string, string> = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  async function makeRequest(): Promise<Response> {
    // Recompute server auth headers to get fresh token after refresh
    const serverAuth = await getServerAuth()
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...serverAuth,
      ...(options?.headers ?? {}),
    }

    // Client-side: route through proxy (proxy attaches Authorization server-side)
    // Server-side: call backend directly with Authorization header
    const targetUrl = isClient
      ? `/api/proxy?path=${encodeURIComponent(url)}`
      : `${apiBaseUrl}${url}`

    const fetchOptions: RequestInit = {
      credentials: 'include',
      headers,
      ...options,
    }

    try {
      return await fetch(targetUrl, fetchOptions)
    } catch (fetchError) {
      // Handle network errors (connection refused, DNS errors, etc.)
      console.error('[API] Network error:', {
        url: targetUrl,
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        isClient,
        apiBaseUrl,
      })

      throw new ApiError(
        0,
        fetchError instanceof Error
          ? `Network error: ${fetchError.message}`
          : 'Network error: Failed to connect to server',
        fetchError
      )
    }
  }

  let res = await makeRequest()

  // On 401, attempt to refresh the token
  if (res.status === 401) {
    const refreshed = await triggerRefresh()
    if (refreshed) {
      // Retry with new token
      res = await makeRequest()
    } else {
      // Refresh failed - session is truly expired
      const msg = await parseErrorResponse(res.clone())
      throw new ApiError(401, msg || 'Session expired. Please sign in again.', undefined, true)
    }
  }

  if (!res.ok) {
    const errorMessage = await parseErrorResponse(res);
    throw new ApiError(res.status, errorMessage);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
