import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/auth"

/**
 * POST /api/auth/logout
 * Clears authentication cookies and logs out the user
 */
export async function POST() {
    await clearAuthCookies()
    return NextResponse.json({ success: true })
}
