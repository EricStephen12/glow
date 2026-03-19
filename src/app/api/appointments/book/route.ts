import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { serviceId, serviceName, date, time, name, phone, email, notes } = body

        if (!name || !phone || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Parse the appointment datetime
        const [year, month, day] = date.split('-').map(Number)
        const [timeStr, period] = time.split(' ')
        const [hours, minutes] = timeStr.split(':').map(Number)
        const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours
        const appointmentDate = new Date(year, month - 1, day, adjustedHours, minutes)

        // Check for existing patient or create new one — Prioritize Email
        let patient = await prisma.patient.findUnique({ where: { email } })

        // Secondary check by phone if email doesn't match but phone is provided
        if (!patient && phone) {
            patient = await prisma.patient.findUnique({ where: { phone } })
        }

        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    name,
                    email,
                    phone: phone || null
                },
            })
        }

        // Resolve the service — try DB first, fallback to name
        let resolvedServiceId = serviceId
        if (serviceId && !serviceId.startsWith('static-')) {
            const svc = await prisma.service.findUnique({ where: { id: serviceId } })
            if (!svc) resolvedServiceId = null
        }

        // If no real DB service, use the first available or skip
        if (!resolvedServiceId) {
            const firstService = await prisma.service.findFirst({ where: { isActive: true } })
            resolvedServiceId = firstService?.id
        }

        if (!resolvedServiceId) {
            return NextResponse.json({ error: 'No active service found. Please add services in the admin panel.' }, { status: 400 })
        }

        // Check for double-booking
        const conflict = await prisma.appointment.findFirst({
            where: {
                serviceId: resolvedServiceId,
                date: appointmentDate,
                status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
            },
        })

        if (conflict) {
            return NextResponse.json({ error: 'This slot is already booked. Please choose another time.' }, { status: 409 })
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                serviceId: resolvedServiceId,
                date: appointmentDate,
                notes: notes || null,
                status: 'PENDING',
            },
        })

        return NextResponse.json({ id: appointment.id, patientId: patient.id }, { status: 201 })
    } catch (error: any) {
        console.error('Booking error:', error)
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
    }
}
