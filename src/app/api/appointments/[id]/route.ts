import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { date, time } = body

        if (!date || !time) {
            return NextResponse.json({ error: 'New date and time are required' }, { status: 400 })
        }

        // Parse the appointment datetime (copied logic from booking)
        const [year, month, day] = date.split('-').map(Number)
        const [timeStr, period] = time.split(' ')
        const [hours, minutes] = timeStr.split(':').map(Number)
        const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours
        const appointmentDate = new Date(year, month - 1, day, adjustedHours, minutes)

        // Check for double-booking (excluding self)
        const app = await prisma.appointment.findUnique({ where: { id } })
        if (!app) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

        const conflict = await prisma.appointment.findFirst({
            where: {
                id: { not: id },
                serviceId: app.serviceId,
                date: appointmentDate,
                status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
            },
        })

        if (conflict) {
            return NextResponse.json({ error: 'This slot is already booked. Please choose another time.' }, { status: 409 })
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: {
                date: appointmentDate,
                status: 'PENDING', // Reset to pending after reschedule if needed, or keep same
            }
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        console.error('Reschedule error:', error)
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        })
        return NextResponse.json({ message: 'Appointment cancelled', id: appointment.id })
    } catch (error: any) {
        console.error('Cancel error:', error)
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
    }
}
