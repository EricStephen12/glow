import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/services
export async function GET() {
    const services = await prisma.service.findMany({
        orderBy: { category: 'asc' },
    })
    return NextResponse.json({ services })
}

// POST /api/services
export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, description, duration, price, category } = body

    if (!name || !price || !duration) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = await prisma.service.create({
        data: { name, description, duration, price, category: category || 'General' },
    })

    return NextResponse.json(service, { status: 201 })
}
