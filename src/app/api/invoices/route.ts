import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from '@/lib/utils'

// GET /api/invoices
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const patientId = searchParams.get('patientId')

    try {
        const where: any = {}
        if (patientId) where.patientId = patientId
        if (status) where.status = status
        if (search) {
            where.OR = [
                { invoiceNumber: { contains: search, mode: 'insensitive' } },
                { patient: { name: { contains: search, mode: 'insensitive' } } }
            ]
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                patient: { select: { name: true, phone: true } },
                items: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ invoices })
    } catch (error) {
        console.error('Fetch Invoices Error:', error)
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }
}

// POST /api/invoices — create invoice
export async function POST(req: NextRequest) {
    const body = await req.json()
    const { patientId, appointmentId, items, discount = 0, tax = 0, paymentMethod, notes, dueDate } = body

    if (!patientId || !items?.length) {
        return NextResponse.json({ error: 'patientId and items required' }, { status: 400 })
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0)
    const total = subtotal - discount + tax

    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber: generateInvoiceNumber(),
            patientId,
            appointmentId: appointmentId || null,
            subtotal,
            discount,
            tax,
            total,
            paymentMethod: paymentMethod || null,
            notes: notes || null,
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'UNPAID',
            items: {
                create: items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.unitPrice * item.quantity,
                })),
            },
        },
        include: { items: true },
    })

    return NextResponse.json(invoice, { status: 201 })
}
