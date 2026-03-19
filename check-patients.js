const { PrismaClient } = require('./src/generated/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const patients = await prisma.patient.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                password: true,
                createdAt: true
            }
        })
        console.log('--- RECENT PATIENTS ---')
        patients.forEach(p => {
            console.log(`ID: ${p.id} | Email: ${p.email} | Phone: ${p.phone} | Password Set: ${!!p.password}`)
        })
    } catch (e) {
        console.error('Prisma Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
