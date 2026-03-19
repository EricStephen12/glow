import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
interface JSPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

export async function generateInvoicePDF(invoice: any) {
    const doc = new jsPDF() as JSPDFWithAutoTable
    const { patient, items, invoiceNumber, createdAt, total, status } = invoice

    // Brand Colors
    const navy = '#6B1D2A'
    const gold = '#C9A84C'

    // Header
    doc.setFillColor(navy)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text('GLOW DENTAL CLINIC', 20, 25)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Premium Dental Care & Aesthetics', 20, 32)

    // Invoice Info
    doc.setTextColor(navy)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('RECEIPT / INVOICE', 140, 55)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor('#666666')
    doc.text(`Invoice #: ${invoiceNumber}`, 140, 62)
    doc.text(`Date: ${new Date(createdAt).toLocaleDateString()}`, 140, 67)
    doc.text(`Status: ${status}`, 140, 72)

    // Patient Info
    doc.setTextColor(navy)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, 55)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor('#333333')
    doc.text(patient.name, 20, 62)
    doc.text(patient.phone, 20, 67)
    if (patient.address) doc.text(patient.address, 20, 72)

    // Items Table
    const tableData = items.map((item: any) => [
        item.description,
        item.quantity.toString(),
        `N${Number(item.unitPrice).toLocaleString()}`,
        `N${Number(item.total).toLocaleString()}`
    ])

    doc.autoTable({
        startY: 85,
        head: [['Procedure / Service', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        headStyles: { fillColor: navy, textColor: '#FFFFFF', fontStyle: 'bold' },
        alternateRowStyles: { fillColor: '#F8F9FA' },
        margin: { left: 20, right: 20 }
    })

    // Footer / Total
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(navy)
    doc.text(`TOTAL AMOUNT: N${Number(total).toLocaleString()}`, 115, finalY + 10)

    // Note
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor('#999999')
    doc.text('Thank you for choosing Glow Dental Clinic. Your smile is our priority.', 20, 280)

    // Save
    doc.save(`${invoiceNumber}.pdf`)
}
