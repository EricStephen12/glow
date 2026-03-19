import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 })

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const booked = await prisma.appointment.findMany({
        where: {
            date: { gte: start, lte: end },
            status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
        select: { date: true },
    })

    const bookedTimes = booked.map((a) =>
        a.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    )

    const ALL_SLOTS = [
        '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM', '2:30 PM', '3:00 PM',
        '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
    ]

    const available = ALL_SLOTS.filter((slot) => !bookedTimes.includes(slot))

    return NextResponse.json({ available, booked: bookedTimes })
}
