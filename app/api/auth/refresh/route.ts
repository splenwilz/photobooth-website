import { NextResponse } from "next/server"
import { refreshTokenAction } from "@/core/api/auth/refresh/actions"

export async function POST() {
    const result = await refreshTokenAction()
    if (!result.success) {
        return NextResponse.json(
            { success: false, error: result.error ?? "Refresh failed" },
            { status: 401 }
        )
    }
    return NextResponse.json({ success: true })
}