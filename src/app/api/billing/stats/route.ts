import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const invoices = await prisma.invoice.findMany({
            select: {
                total: true,
                amountPaid: true,
                status: true
            }
        })

        const totalRevenue = invoices
            .filter(inv => inv.status === 'PAID' || inv.status === 'PART_PAID')
            .reduce((acc, inv) => acc + Number(inv.amountPaid || 0), 0)

        const pendingPayments = invoices
            .filter(inv => inv.status !== 'PAID')
            .reduce((acc, inv) => acc + (Number(inv.total) - Number(inv.amountPaid || 0)), 0)

        const totalInvoices = invoices.length

        return NextResponse.json({
            totalRevenue,
            pendingPayments,
            totalInvoices
        })
    } catch (error) {
        console.error('Billing Stats Error:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
