import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/visit-records
// Creates or updates a visit record for an appointment
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {
            appointmentId,
            patientId,
            chiefComplaint,
            diagnosis,
            treatmentDone,
            medicationGiven,
            notes,
            nextVisitDate
        } = body

        if (!appointmentId || !patientId) {
            return NextResponse.json({ error: 'Missing appointmentId or patientId' }, { status: 400 })
        }

        const visitRecord = await prisma.visitRecord.upsert({
            where: { appointmentId },
            update: {
                chiefComplaint,
                diagnosis,
                treatmentDone,
                medicationGiven,
                notes,
                nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
            },
            create: {
                appointmentId,
                patientId,
                chiefComplaint,
                diagnosis,
                treatmentDone,
                medicationGiven,
                notes,
                nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
            }
        })

        // Also update appointment status to COMPLETED
        const appointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
            include: { service: true }
        })

        // Auto-generate invoice if it doesn't exist
        const existingInvoice = await prisma.invoice.findFirst({
            where: { appointmentId }
        })

        if (!existingInvoice && appointment.service) {
            const { generateInvoiceNumber } = await import('@/lib/utils')
            await prisma.invoice.create({
                data: {
                    invoiceNumber: generateInvoiceNumber(),
                    patientId,
                    appointmentId,
                    subtotal: appointment.service.price,
                    total: appointment.service.price,
                    status: 'UNPAID',
                    items: {
                        create: [{
                            description: appointment.service.name,
                            quantity: 1,
                            unitPrice: appointment.service.price,
                            total: appointment.service.price,
                        }]
                    }
                }
            })
        }

        return NextResponse.json(visitRecord)
    } catch (error) {
        console.error('Visit Record Error:', error)
        return NextResponse.json({ error: 'Failed to save visit record' }, { status: 500 })
    }
}

// GET /api/visit-records/[id] - though usually fetched via patient/appointment includes
