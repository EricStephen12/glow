import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const admin = await prisma.adminUser.findUnique({
            where: { email }
        })

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isMatch = await comparePassword(password, admin.password)
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Sign token
        const token = signToken({
            id: admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.name
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        })

        return NextResponse.json({
            success: true,
            user: {
                name: admin.name,
                role: admin.role,
                email: admin.email
            }
        })
    } catch (error) {
        console.error('Login Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
