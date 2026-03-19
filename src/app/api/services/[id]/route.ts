import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/services/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const { name, description, duration, price, category, isActive } = body

    try {
        const service = await prisma.service.update({
            where: { id },
            data: {
                name,
                description,
                duration,
                price,
                category,
                isActive
            },
        })
        return NextResponse.json(service)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
    }
}

// DELETE /api/services/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        await prisma.service.delete({
            where: { id },
        })
        return NextResponse.json({ message: 'Service deleted' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }
}
