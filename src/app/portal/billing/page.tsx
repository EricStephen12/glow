'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Download, ExternalLink, Receipt, Shield, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { generateInvoicePDF } from '@/lib/pdf'
import Link from 'next/link'

export default function BillingPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBilling() {
            try {
                // Fetching from the same dashboard endpoint for now, 
                // but in a real app this would be a dedicated billing endpoint
                const res = await fetch('/api/patient/dashboard')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error('Failed to fetch billing data', err)
            } finally {
                setLoading(false)
            }
        }
        fetchBilling()
    }, [])

    const handleDownload = async (visit: any) => {
        if (!visit.invoice) {
            alert('Invoice not available for download yet.')
            return
        }
        await generateInvoicePDF({ ...visit.invoice, patient: data.patient })
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
            <div className="w-16 h-16 border-4 border-lavender/10 border-t-lavender rounded-full animate-spin" />
            <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">Accessing Secure Financials</p>
        </div>
    )

    // Calculate a mock balance based on recent visits for demonstration
    // In a real app, this would come from the backend billing system
    const calculateBalance = () => {
        if (!data?.recentVisits) return 0
        return data.recentVisits.reduce((acc: number, visit: any) => acc + (visit.invoice?.amount || 0), 0) * 0.25 // 25% outstanding for demo
    }

    const currentBalance = calculateBalance()
    const recentVisits = data?.recentVisits || []

    return (
        <div className="space-y-12 pb-24 selection:bg-lavender/20">
            {/* Header */}
            <header className="space-y-4">
                <p className="text-[10px] text-lavender font-bold uppercase tracking-[0.4em]">Financial Overview</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="text-4xl md:text-5xl font-medium text-navy font-display leading-[1.1] tracking-tight">
                        Billing & <span className="text-lavender italic">Quotes</span>
                    </h1>
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-navy/5 shadow-sm">
                        <Shield className="w-4 h-4 text-lavender" />
                        <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Secure Transactions</span>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-[32px] bg-navy text-white relative overflow-hidden group shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lavender/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-lavender/30 transition-colors" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] text-white/50 font-bold tracking-[0.3em] uppercase mb-2">Current Balance</p>
                                <h3 className="text-4xl md:text-5xl font-medium font-display tracking-tight">
                                    ₦{currentBalance.toLocaleString()}
                                </h3>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <CreditCard className="w-6 h-6 text-lavender" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 bg-white text-navy px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-lavender transition-colors text-center">
                                Make Payment
                            </button>
                            <button className="flex-1 bg-white/10 text-white px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors text-center backdrop-blur-sm">
                                View Statements
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Insurance Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-[32px] bg-white border border-navy/5 shadow-sm space-y-6 flex flex-col"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-navy/40 font-bold tracking-[0.3em] uppercase mb-2">Insurance Details</p>
                            <h3 className="text-2xl font-medium font-display tracking-tight text-navy">
                                Self-Pay Patient
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-lavender/10 flex items-center justify-center text-lavender border border-lavender/20">
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end">
                        <div className="w-full pt-6 border-t border-navy/5">
                            <Link href="/portal/profile" className="flex items-center justify-between text-navy hover:text-lavender transition-colors group px-4 py-3 bg-surface rounded-xl border border-navy/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Update Insurance Info</span>
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-[48px] border border-navy/5 shadow-sm overflow-hidden mt-8">
                <div className="px-10 py-8 border-b border-navy/5 flex justify-between items-center bg-surface/30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-navy/30" />
                        </div>
                        <h2 className="text-sm font-bold text-navy uppercase tracking-widest">Recent Invoices</h2>
                    </div>
                </div>

                <div className="p-4">
                    {recentVisits.length === 0 ? (
                        <div className="py-24 text-center space-y-6">
                            <div className="w-24 h-24 bg-surface rounded-[28px] flex items-center justify-center mx-auto border border-navy/5">
                                <Sparkles className="w-8 h-8 text-navy/10" />
                            </div>
                            <p className="text-navy/30 text-[11px] font-bold uppercase tracking-[0.4em]">No financial records available.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-navy/5">
                            {recentVisits.map((visit: any, index: number) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={visit.id}
                                    className="p-8 hover:bg-surface/50 transition-colors group rounded-3xl"
                                >
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                        <div className="space-y-4 lg:w-1/3">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-bold text-navy font-display tracking-tight">{visit.service}</h4>
                                                <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[8px] font-bold rounded-full uppercase tracking-widest border border-green-500/20">Paid</span>
                                            </div>
                                            <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em]">{formatDate(visit.date)}</p>
                                        </div>
                                        
                                        <div className="lg:w-1/3 flex lg:justify-center">
                                            <p className="text-xl font-medium font-display tracking-tight text-navy">
                                                ₦{visit.invoice?.amount?.toLocaleString() || '150,000'}
                                            </p>
                                        </div>

                                        <div className="lg:w-1/3 flex lg:justify-end">
                                            {visit.invoice ? (
                                                <button
                                                    onClick={() => handleDownload(visit)}
                                                    className="px-6 py-4 rounded-2xl bg-surface border border-navy/5 flex items-center gap-3 text-[10px] font-bold text-navy/50 uppercase tracking-widest hover:text-navy hover:bg-white hover:border-navy/20 transition-all shadow-sm group/btn"
                                                >
                                                    <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    Download PDF
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="px-6 py-4 rounded-2xl bg-surface/50 border border-navy/5 flex items-center gap-3 text-[10px] font-bold text-navy/20 uppercase tracking-widest cursor-not-allowed"
                                                >
                                                    Processing...
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
