import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/patients/[id]/dental-chart
// Updates or creates conditions for a specific tooth
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = await params
    const body = await req.json()
    const { toothNumber, condition, note, surface } = body

    if (!toothNumber || !condition) {
        return NextResponse.json({ error: 'Missing toothNumber or condition' }, { status: 400 })
    }

    try {
        // 1. Ensure DentalChart exists for patient
        let chart = await prisma.dentalChart.findUnique({
            where: { patientId }
        })

        if (!chart) {
            chart = await prisma.dentalChart.create({
                data: { patientId }
            })
        }

        // 2. Ensure Tooth record exists for this chart and number
        let tooth = await prisma.tooth.findUnique({
            where: {
                chartId_toothNumber: {
                    chartId: chart.id,
                    toothNumber: parseInt(toothNumber)
                }
            }
        })

        if (!tooth) {
            tooth = await prisma.tooth.create({
                data: {
                    chartId: chart.id,
                    toothNumber: parseInt(toothNumber)
                }
            })
        }

        // 3. Create Condition Log entry
        const log = await prisma.toothConditionLog.create({
            data: {
                toothId: tooth.id,
                condition,
                note,
                surface
            }
        })

        return NextResponse.json(log)
    } catch (error) {
        console.error('Dental Chart Update Error:', error)
        return NextResponse.json({ error: 'Failed to update dental chart' }, { status: 500 })
    }
}
