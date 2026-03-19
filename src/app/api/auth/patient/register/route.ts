import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, Email, and Password are required' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Check if patient already exists
        const existingPatient = await prisma.patient.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        })

        let patient;

        if (existingPatient) {
            // If patient exists and HAS a password, it's a real conflict
            if (existingPatient.password) {
                return NextResponse.json(
                    { message: 'An account with this email or phone already exists. Please login instead.' },
                    { status: 409 }
                )
            }

            // If patient exists but HAS NO password, "upgrade" the account
            patient = await prisma.patient.update({
                where: { id: existingPatient.id },
                data: {
                    name, // Update name if provided
                    password: hashedPassword,
                }
            })
        } else {
            // Create new patient with hashed password
            patient = await prisma.patient.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                },
            })
        }

        // Sign token for immediate login
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
            message: 'Account created and logged in successfully.',
            user: {
                id: patient.id,
                name: patient.name,
                email: patient.email
            }
        })
    } catch (error) {
        console.error('Patient Registration Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
