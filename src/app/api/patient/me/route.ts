import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('patient_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = verifyToken(token) as any
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const patient = await prisma.patient.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                createdAt: true
            }
        })

        if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

        return NextResponse.json(patient)
    } catch (error: any) {
        console.error('Fetch Profile Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
