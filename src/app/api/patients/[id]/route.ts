import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/patients/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
            appointments: {
                include: { service: true, visitRecord: true, invoice: true },
                orderBy: { date: 'desc' },
            },
            dentalChart: { include: { teeth: { include: { conditions: { orderBy: { createdAt: 'desc' } } } } } },
            treatmentPlans: { include: { procedures: { orderBy: { order: 'asc' } } } },
            invoices: { orderBy: { createdAt: 'desc' } },
            attachments: { orderBy: { createdAt: 'desc' } },
            followUps: { orderBy: { reminderDate: 'asc' }, where: { sent: false } },
        },
    })
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    return NextResponse.json(patient)
}

// PATCH /api/patients/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const patient = await prisma.patient.update({
        where: { id },
        data: {
            name: body.name,
            phone: body.phone,
            email: body.email || null,
            dob: body.dob ? new Date(body.dob) : null,
            gender: body.gender || null,
            allergies: body.allergies || null,
            medicalNotes: body.medicalNotes || null,
            address: body.address || null,
            bloodGroup: body.bloodGroup || null,
            emergencyContact: body.emergencyContact || null,
        },
    })
    return NextResponse.json(patient)
}
