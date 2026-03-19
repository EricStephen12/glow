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

        const decoded: any = verifyToken(token)
        if (!decoded || decoded.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const patientId = decoded.id

        // Fetch patient data
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                appointments: {
                    where: { date: { gte: new Date() } },
                    orderBy: { date: 'asc' },
                    take: 1,
                    include: { service: true }
                },
                visitRecords: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        appointment: {
                            include: {
                                service: true,
                                invoice: {
                                    include: { items: true }
                                }
                            }
                        }
                    }
                },
                invoices: {
                    where: { status: { not: 'PAID' } },
                }
            }
        })

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
        }

        // Calculate balance
        const balance = patient.invoices.reduce((sum, inv) => sum + (Number(inv.total) - Number(inv.amountPaid)), 0)

        return NextResponse.json({
            patient: {
                name: patient.name,
                phone: patient.phone,
                email: patient.email,
            },
            nextAppointment: patient.appointments[0] || null,
            recentVisits: patient.visitRecords.map(vr => ({
                id: vr.id,
                date: vr.createdAt,
                service: vr.appointment?.service?.name || 'Treatment',
                notes: vr.notes || vr.treatmentDone || '',
                invoice: vr.appointment?.invoice || null
            })),
            balance
        })
    } catch (error) {
        console.error('Patient Dashboard Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
