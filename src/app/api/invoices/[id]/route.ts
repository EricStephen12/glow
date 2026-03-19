import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/invoices/[id]
// Update invoice status or payment details
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    try {
        const body = await req.json()
        const { status, paymentMethod, amountPaid, notes } = body

        const currentInvoice = await prisma.invoice.findUnique({
            where: { id }
        })

        if (!currentInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        const updateData: any = {
            status: status || currentInvoice.status,
            paymentMethod: paymentMethod || currentInvoice.paymentMethod,
            notes: notes || currentInvoice.notes
        }

        if (amountPaid !== undefined) {
            const newAmountPaid = Number(currentInvoice.amountPaid) + Number(amountPaid)
            updateData.amountPaid = newAmountPaid

            // Auto-update status based on payment
            if (newAmountPaid >= Number(currentInvoice.total)) {
                updateData.status = 'PAID'
                updateData.paidAt = new Date()
            } else if (newAmountPaid > 0) {
                updateData.status = 'PART_PAID'
            }
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(updatedInvoice)
    } catch (error) {
        console.error('Update Invoice Error:', error)
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }
}

// DELETE /api/invoices/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        await prisma.invoice.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
    }
}
