import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

async function forward(req: NextRequest, method: 'PUT' | 'DELETE') {
    const path = req.nextUrl.searchParams.get('path')
    if (!path) {
        return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiBaseUrl) {
        return NextResponse.json(
            { error: 'API base URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.' },
            { status: 500 }
        )
    }

    const token = (await cookies()).get('auth_access_token')?.value

    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    let body: Blob | undefined
    if (method !== 'DELETE') {
        // Forward the original Content-Type (includes multipart boundary)
        const contentType = req.headers.get('Content-Type')
        if (contentType) {
            headers['Content-Type'] = contentType
        }
        body = await req.blob()
    }

    try {
        const res = await fetch(`${apiBaseUrl}${path}`, {
            method,
            headers,
            body,
            signal: AbortSignal.timeout(60000), // 60s timeout for uploads
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
        console.error('[PROXY-UPLOAD] Request failed:', {
            path,
            method,
            error: error instanceof Error ? error.message : String(error),
        })

        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Upload timeout' },
                { status: 504 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to forward upload request to backend' },
            { status: 502 }
        )
    }
}

export async function PUT(req: NextRequest) { return forward(req, 'PUT') }
export async function DELETE(req: NextRequest) { return forward(req, 'DELETE') }
