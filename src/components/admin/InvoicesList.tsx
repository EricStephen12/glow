'use client'
import { motion } from 'framer-motion'
import {
    Receipt, Plus, Download, CreditCard,
    CheckCircle2, Clock, AlertCircle, ChevronRight
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { generateInvoicePDF } from '@/lib/pdf'

export default function InvoicesList({ invoices = [], patient }: { invoices?: any[], patient?: any }) {
    const handleDownload = async (invoice: any) => {
        // Enforce patient object for PDF metadata
        if (!patient && !invoice.patient) {
            alert('Patient data missing for PDF generation')
            return
        }

        await generateInvoicePDF({
            ...invoice,
            patient: invoice.patient || patient
        })
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark font-display">Invoices & Payments</h2>
                <button className="btn-primary text-xs py-2.5">
                    <Plus className="w-3.5 h-3.5" /> Generate Invoice
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-6 bg-navy text-white">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Total Outstanding</p>
                    <p className="text-3xl font-bold">₦145,000</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-[#D4A574]">
                        <AlertCircle className="w-3 h-3" /> Overdue: ₦12,000
                    </div>
                </div>
                <div className="card p-6">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-bold text-dark">₦2,540,000</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500">
                        <CheckCircle2 className="w-3 h-3" /> All good
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Inv #</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-400">No invoices found for this patient</td>
                            </tr>
                        ) : (
                            invoices.map((inv, i) => (
                                <tr key={inv.id}>
                                    <td><span className="font-mono font-bold text-navy text-[10px]">{inv.invoiceNumber || `INV-${inv.id.slice(0, 4)}`}</span></td>
                                    <td className="text-xs text-gray-500">{formatDate(inv.createdAt)}</td>
                                    <td className="font-bold text-dark text-sm">{formatCurrency(inv.total)}</td>
                                    <td>
                                        <span className={`badge text-[9px] ${getStatusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleDownload(inv)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
