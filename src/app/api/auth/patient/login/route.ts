import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    try {
        const { identifier, password } = await req.json() // Can be email or phone

        if (!identifier || !password) {
            return NextResponse.json({ error: 'Identity and Password are required' }, { status: 400 })
        }

        // Find patient by email or phone
        const patient = await prisma.patient.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        })

        if (!patient || !patient.password) {
            return NextResponse.json({ error: 'Invalid credentials or account not set up with a password' }, { status: 401 })
        }

        // Verify password
        const isMatch = await comparePassword(password, patient.password)
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Sign token
        const token = signToken({
            id: patient.id,
            email: patient.email,
            phone: patient.phone || undefined,
            name: patient.name,
            role: 'PATIENT'
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('patient_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return NextResponse.json({
            success: true,
            user: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        })
    } catch (error) {
        console.error('Patient Login Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
