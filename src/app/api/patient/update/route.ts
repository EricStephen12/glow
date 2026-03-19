import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function PATCH(req: NextRequest) {
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

        const body = await req.json()
        const { email, phone } = body

        // Validate phone if changed
        if (phone && phone !== decoded.phone) {
            const existing = await prisma.patient.findUnique({ where: { phone } })
            if (existing) {
                return NextResponse.json({ error: 'Phone number already in use' }, { status: 400 })
            }
        }

        const updated = await prisma.patient.update({
            where: { id: decoded.id },
            data: {
                email: email || undefined,
                phone: phone || undefined
            }
        })

        return NextResponse.json({
            success: true,
            user: {
                id: updated.id,
                name: updated.name,
                phone: updated.phone,
                email: updated.email
            }
        })
    } catch (error: any) {
        console.error('Update Profile Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
