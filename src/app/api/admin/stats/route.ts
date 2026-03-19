import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays } from 'date-fns'

export async function GET(req: NextRequest) {
    try {
        const now = new Date()
        const todayStart = startOfDay(now)
        const todayEnd = endOfDay(now)
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        // 1. Today's Appointments count
        const todayAppsCount = await prisma.appointment.count({
            where: {
                date: {
                    gte: todayStart,
                    lte: todayEnd
                },
                status: { notIn: ['CANCELLED', 'NO_SHOW'] }
            }
        })

        // 2. New Patients this month
        const newPatientsCount = await prisma.patient.count({
            where: {
                createdAt: {
                    gte: monthStart,
                    lte: monthEnd
                }
            }
        })

        // 3. Today's Revenue (Actually paid today)
        // Note: This assumes we have a field or model for payments. 
        // For now, let's sum total of invoices marked PAID or PART_PAID updated today.
        const todayInvoices = await prisma.invoice.findMany({
            where: {
                updatedAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        })
        const todayRevenue = todayInvoices.reduce((sum, inv) => {
            // Ideally we sum 'amountPaid' if we had that, otherwise use 'total' if status is PAID
            return sum + (Number(inv.amountPaid) || 0)
        }, 0)

        // 4. Recent Appointments (Upcoming next 5)
        const recentAppointments = await prisma.appointment.findMany({
            where: {
                date: { gte: todayStart },
                status: { in: ['PENDING', 'CONFIRMED'] }
            },
            include: {
                patient: true,
                service: true
            },
            orderBy: { date: 'asc' },
            take: 5
        })

        // 5. Recent Activity (Latest 5 records across different types)
        // This is complex, let's pull latest Invoices and latest Appointments for now
        const latestInvoices = await prisma.invoice.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 3,
            include: { patient: true }
        })

        const latestBookings = await prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 2,
            include: { patient: true, service: true }
        })

        const activities = [
            ...latestInvoices.map(inv => ({
                id: inv.id,
                type: 'PAYMENT',
                title: inv.status === 'PAID' ? 'Payment Received' : 'Invoice Generated',
                desc: `${inv.patient.name}: ₦${Number(inv.total).toLocaleString()}`,
                time: inv.updatedAt,
                status: inv.status
            })),
            ...latestBookings.map(app => ({
                id: app.id,
                type: 'BOOKING',
                title: 'New Appointment',
                desc: `${app.patient.name} booked ${app.service?.name || 'Treatment'}`,
                time: app.createdAt,
                status: app.status
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

        return NextResponse.json({
            stats: {
                todayAppointments: todayAppsCount,
                newPatients: newPatientsCount,
                todayRevenue,
                satisfaction: '4.9' // Placeholder for now
            },
            recentAppointments: recentAppointments.map(app => ({
                id: app.id,
                patient: app.patient.name,
                service: app.service?.name || 'General',
                time: app.date,
                status: app.status
            })),
            activities
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
