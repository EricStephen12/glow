import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('admin_token')?.value

    // 1. If trying to access admin login while already logged in
    if (pathname === '/admin/login' && token) {
        try {
            await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )
            return NextResponse.redirect(new URL('/admin', request.url))
        } catch (e) {
            // Invalid token, allow access to login
        }
    }

    // 2. Protect all other /admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )
            return NextResponse.next()
        } catch (e) {
            // Token invalid or expired
            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.delete('admin_token')
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
