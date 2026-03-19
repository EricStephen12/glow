import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/patients — list patients with search
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const take = Number(searchParams.get('limit') || 50)
    const skip = Number(searchParams.get('skip') || 0)

    const patients = await prisma.patient.findMany({
        where: q ? {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q } },
                { email: { contains: q, mode: 'insensitive' } },
            ],
        } : undefined,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
            _count: { select: { appointments: true } },
        },
    })

    return NextResponse.json({ patients })
}

// POST /api/patients — create patient
export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, phone, email, dob, gender, allergies, medicalNotes, address, bloodGroup, emergencyContact } = body

    if (!name || !phone) return NextResponse.json({ error: 'Name and phone required' }, { status: 400 })

    const existing = await prisma.patient.findUnique({ where: { phone } })
    if (existing) return NextResponse.json({ error: 'Patient with this phone already exists' }, { status: 409 })

    const patient = await prisma.patient.create({
        data: {
            name, phone,
            email: email || null,
            dob: dob ? new Date(dob) : null,
            gender: gender || null,
            allergies: allergies || null,
            medicalNotes: medicalNotes || null,
            address: address || null,
            bloodGroup: bloodGroup || null,
            emergencyContact: emergencyContact || null,
        },
    })

    return NextResponse.json(patient, { status: 201 })
}
