import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format, startOfWeek, endOfWeek, subDays } from 'date-fns'

export async function GET(req: NextRequest) {
    try {
        // 1. Revenue Data (Last 6 Months)
        const revenueData = []
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i)
            const start = startOfMonth(date)
            const end = endOfMonth(date)

            const appointments = await prisma.appointment.findMany({
                where: {
                    date: { gte: start, lte: end },
                    status: 'COMPLETED'
                },
                include: { service: true }
            })

            const total = appointments.reduce((sum, app) => sum + (app.service?.price || 0), 0)
            revenueData.push({
                name: format(date, 'MMM'),
                value: total
            })
        }

        // 2. Weekly Appointments
        const appointmentData = []
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i)
            const start = startOfMonth(date) // actually we want specific day
            // fix: use startOfDay and endOfDay equivalent
            const startDay = new Date(date.setHours(0, 0, 0, 0))
            const endDay = new Date(date.setHours(23, 59, 59, 999))

            const count = await prisma.appointment.count({
                where: {
                    date: { gte: startDay, lte: endDay }
                }
            })

            appointmentData.push({
                name: format(date, 'EEE'),
                value: count
            })
        }

        // 3. Service Popularity
        const services = await prisma.service.findMany({
            include: { _count: { select: { appointments: true } } }
        })
        const totalAppointments = services.reduce((sum, s) => sum + s._count.appointments, 0)
        const servicesData = services.map(s => ({
            name: s.name.split(' ')[0], // short name
            value: totalAppointments > 0 ? Math.round((s._count.appointments / totalAppointments) * 100) : 0
        })).sort((a, b) => b.value - a.value).slice(0, 5)

        // 4. Patient Growth
        const growthData = []
        for (let i = 3; i >= 0; i--) {
            const date = subMonths(new Date(), i)
            const start = startOfMonth(date)
            const end = endOfMonth(date)

            const newPatients = await prisma.patient.count({
                where: { createdAt: { gte: start, lte: end } }
            })

            growthData.push({
                month: format(date, 'MMMM'),
                new: newPatients,
                ret: Math.floor(newPatients * 2.5), // mock retention logic for now as we don't track it explicitly well yet
                conv: '85%',
                growth: '+10%'
            })
        }

        return NextResponse.json({
            revenueData,
            appointmentData,
            servicesData,
            growthData
        })
    } catch (error: any) {
        console.error('Analytics Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
