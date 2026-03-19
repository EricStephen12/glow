import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const date = searchParams.get('date')
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        const where: any = {}

        if (date) {
            const day = new Date(date)
            where.date = {
                gte: startOfDay(day),
                lte: endOfDay(day)
            }
        } else if (start && end) {
            where.date = {
                gte: new Date(start),
                lte: new Date(end)
            }
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: true,
                service: true,
                visitRecord: true,
                invoice: true
            },
            orderBy: { date: 'asc' }
        })

        return NextResponse.json(appointments)
    } catch (error) {
        console.error('Error fetching appointments:', error)
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
    }
}
