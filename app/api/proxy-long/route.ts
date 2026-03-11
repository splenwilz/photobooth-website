import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Long-running proxy route for operations that may take up to 2 minutes.
 * Used for booth log downloads where the backend waits for the booth to
 * collect, ZIP, and upload logs to S3.
 *
 * POST only — all current long-running operations are POST requests.
 * Timeout: 130 seconds (10s buffer over the backend's 120s max).
 */
const ALLOWED_PATH_PREFIXES = ['/api/v1/booths/']
const ALLOWED_PATH_SUFFIXES = ['/download-logs']

export async function POST(req: NextRequest) {
    const path = req.nextUrl.searchParams.get('path')
    if (!path) {
        return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    const isAllowed = ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
        && ALLOWED_PATH_SUFFIXES.some((suffix) => path.endsWith(suffix))
    if (!isAllowed) {
        return NextResponse.json({ error: 'Path not allowed on this endpoint' }, { status: 403 })
    }

    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiBaseUrl) {
        return NextResponse.json(
            { error: 'API base URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.' },
            { status: 500 }
        )
    }

    const token = (await cookies()).get('auth_access_token')?.value
    const rawBody = await req.text()
    const body = rawBody || undefined

    try {
        const res = await fetch(`${apiBaseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body,
            signal: AbortSignal.timeout(130000), // 130 second timeout
        })

        if (res.status === 204) {
            return new NextResponse(null, { status: 204 })
        }

        const text = await res.text()
        return new NextResponse(text, {
            status: res.status,
            headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
        })
    } catch (error) {
        console.error('[PROXY-LONG] Request failed:', {
            path,
            error: error instanceof Error ? error.message : String(error),
        })

        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Request timeout - this operation can take up to 2 minutes' },
                { status: 504 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to forward request to backend' },
            { status: 502 }
        )
    }
}
