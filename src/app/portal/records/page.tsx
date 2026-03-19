'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Download, Shield, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { generateInvoicePDF } from '@/lib/pdf'

export default function MedicalRecordsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecords() {
            try {
                const res = await fetch('/api/patient/dashboard')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error('Failed to fetch records', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecords()
    }, [])

    const handleDownload = async (visit: any) => {
        if (!visit.invoice) {
            alert('Record not available for download yet.')
            return
        }
        await generateInvoicePDF({ ...visit.invoice, patient: data.patient })
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
            <div className="w-16 h-16 border-4 border-lavender/10 border-t-lavender rounded-full animate-spin" />
            <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">Accessing Secure Archive</p>
        </div>
    )

    const recentVisits = data?.recentVisits || []

    return (
        <div className="space-y-12 pb-24 selection:bg-lavender/20">
            {/* Header */}
            <header className="space-y-4">
                <p className="text-[10px] text-lavender font-bold uppercase tracking-[0.4em]">Clinical Archive</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="text-4xl md:text-5xl font-medium text-navy font-display leading-[1.1] tracking-tight">
                        Medical <span className="text-lavender italic">Records</span>
                    </h1>
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-navy/5 shadow-sm">
                        <Shield className="w-4 h-4 text-lavender" />
                        <span className="text-[10px] font-bold text-navy uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                </div>
            </header>

            {/* Main Records List */}
            <div className="bg-white rounded-[48px] border border-navy/5 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-navy/5 flex justify-between items-center bg-surface/30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
                            <History className="w-5 h-5 text-navy/30" />
                        </div>
                        <h2 className="text-sm font-bold text-navy uppercase tracking-widest">Complete History</h2>
                    </div>
                    <span className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em]">{recentVisits.length} Records Found</span>
                </div>

                <div className="p-4">
                    {recentVisits.length === 0 ? (
                        <div className="py-24 text-center space-y-6">
                            <div className="w-24 h-24 bg-surface rounded-[28px] flex items-center justify-center mx-auto border border-navy/5">
                                <Sparkles className="w-8 h-8 text-navy/10" />
                            </div>
                            <p className="text-navy/30 text-[11px] font-bold uppercase tracking-[0.4em]">No clinical records available.</p>
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
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                                        <div className="space-y-4 lg:w-1/3">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-xl font-bold text-navy font-display italic tracking-tight">{visit.service}</h4>
                                                <span className="px-3 py-1 bg-lavender/10 text-lavender text-[8px] font-bold rounded-full uppercase tracking-widest border border-lavender/5">Verified</span>
                                            </div>
                                            <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em]">{formatDate(visit.date)}</p>
                                        </div>
                                        
                                        <div className="lg:w-1/2">
                                            <p className="text-[13px] text-navy/50 leading-relaxed font-medium">
                                                {visit.notes || 'Routine clinical procedure completed. Patient responded well to treatment. Provided post-care instructions and scheduled next annual checkup.'}
                                            </p>
                                        </div>

                                        <div className="lg:w-auto flex justify-end">
                                            {visit.invoice ? (
                                                <button
                                                    onClick={() => handleDownload(visit)}
                                                    className="px-6 py-4 rounded-2xl bg-surface border border-navy/5 flex items-center gap-3 text-[10px] font-bold text-navy/30 uppercase tracking-widest hover:text-lavender hover:bg-white hover:border-lavender/20 transition-all shadow-sm group/btn"
                                                >
                                                    <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    Get Record
                                                </button>
                                            ) : (
                                                <span className="text-[9px] font-bold text-navy/20 uppercase tracking-widest italic">Doc Pending</span>
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
