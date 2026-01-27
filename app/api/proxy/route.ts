import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function forward(req: NextRequest, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
    const path = req.nextUrl.searchParams.get('path')
    if (!path) {
        return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    // Get API base URL (prefer API_BASE_URL, fallback to NEXT_PUBLIC_API_BASE_URL)
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiBaseUrl) {
        return NextResponse.json(
            { error: 'API base URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.' },
            { status: 500 }
        )
    }

    const token = (await cookies()).get('auth_access_token')?.value
    const rawBody = method === 'GET' ? undefined : await req.text()
    const body = rawBody || undefined

    try {
        // Forward request to backend with 30 second timeout
        // @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
        const res = await fetch(`${apiBaseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body,
            signal: AbortSignal.timeout(30000), // 30 second timeout
        })

        // 204 No Content cannot have a body
        if (res.status === 204) {
            return new NextResponse(null, { status: 204 })
        }

        const text = await res.text()
        return new NextResponse(text, {
            status: res.status,
            headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
        })
    } catch (error) {
        // Handle network errors, timeouts, and other fetch failures
        console.error('[PROXY] Request failed:', {
            path,
            method,
            error: error instanceof Error ? error.message : String(error),
        })

        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Request timeout' },
                { status: 504 } // Gateway Timeout
            )
        }

        // Network errors, DNS failures, connection refused, etc.
        return NextResponse.json(
            { error: 'Failed to forward request to backend' },
            { status: 502 } // Bad Gateway
        )
    }
}

export async function GET(req: NextRequest) { return forward(req, 'GET') }
export async function POST(req: NextRequest) { return forward(req, 'POST') }
export async function PUT(req: NextRequest) { return forward(req, 'PUT') }
export async function PATCH(req: NextRequest) { return forward(req, 'PATCH') }
export async function DELETE(req: NextRequest) { return forward(req, 'DELETE') }


