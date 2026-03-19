'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
    Receipt, Search, Plus, Filter,
    Download, MoreVertical, CreditCard,
    CheckCircle2, Clock, AlertCircle, TrendingUp
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export default function AdminBillingPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [stats, setStats] = useState({ totalRevenue: 0, pendingPayments: 0, totalInvoices: 0 })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        fetchStats()
        const timer = setTimeout(() => {
            fetchInvoices()
        }, 300)
        return () => clearTimeout(timer)
    }, [search, statusFilter])

    async function fetchStats() {
        try {
            const res = await fetch('/api/billing/stats')
            const data = await res.json()
            setStats(data)
        } catch (e) {
            console.error(e)
        }
    }

    async function fetchInvoices() {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (statusFilter !== 'ALL') params.append('status', statusFilter)

            const res = await fetch(`/api/invoices?${params.toString()}`)
            const data = await res.json()
            setInvoices(data.invoices || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const STATS = [
        { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Payments', value: formatCurrency(stats.pendingPayments), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Invoices Sent', value: stats.totalInvoices.toString(), icon: Receipt, color: 'text-navy', bg: 'bg-navy/5' },
    ]

    return (
        <div className="p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark font-display">Invoices & Billing</h1>
                    <p className="text-gray-500">Track payments, generate receipts and manage clinic finances.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="btn-primary">
                        <Plus className="w-4 h-4" /> Create Invoice
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                                <p className="text-2xl font-bold text-dark">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search invoice # or patient name..."
                        className="form-input pl-10 h-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="form-input h-11 min-w-[140px] text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PART_PAID">Partially Paid</option>
                    <option value="UNPAID">Unpaid</option>
                </select>
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading invoices...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">No invoices found</td>
                                </tr>
                            ) : (
                                invoices.map((inv, i) => (
                                    <motion.tr
                                        key={inv.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <td>
                                            <span className="font-mono text-xs font-bold text-navy">{inv.invoiceNumber}</span>
                                        </td>
                                        <td>
                                            <p className="font-bold text-dark text-sm">{inv.patient?.name}</p>
                                            <p className="text-[10px] text-gray-400">{inv.patient?.phone}</p>
                                        </td>
                                        <td className="text-sm text-gray-500">{formatDate(inv.createdAt)}</td>
                                        <td>
                                            <p className="font-bold text-dark">{formatCurrency(inv.total)}</p>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusColor(inv.status)}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <CreditCard className="w-3 h-3" />
                                                {inv.paymentMethod || '—'}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-navy/5 rounded-lg text-gray-400 hover:text-navy transition-all" title="Download PDF">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

