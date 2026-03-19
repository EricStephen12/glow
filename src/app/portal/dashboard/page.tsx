'use client'
import { motion } from 'framer-motion'
import {
    Calendar, Clock, History, CreditCard,
    ArrowRight, FileText, CheckCircle2, AlertCircle, Plus, Download, Phone, Sparkles, Shield, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate, formatCurrency } from '@/lib/utils'
import { generateInvoicePDF } from '@/lib/pdf'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PortalDashboardPage() {
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/patient/dashboard')
                if (!res.ok) throw new Error('Failed to fetch dashboard data')
                const json = await res.json()
                setData(json)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!loading && data && containerRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.dash-reveal', {
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power4.out'
                })
            }, containerRef)
            return () => ctx.revert()
        }
    }, [loading, data])

    const handleDownload = async (visit: any) => {
        if (!visit.invoice) {
            alert('Receipt not available for this record yet.')
            return
        }
        await generateInvoicePDF({ ...visit.invoice, patient: data.patient })
    }

    const handleCancel = async () => {
        if (!data.nextAppointment) return
        if (!confirm('Are you sure you want to cancel this appointment?')) return
        setCancelling(true)
        try {
            const res = await fetch(`/api/appointments/${data.nextAppointment.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to cancel')
            alert('Appointment cancelled successfully.')
            window.location.reload()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setCancelling(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-10 font-sans">
            <div className="relative">
                <div className="w-24 h-24 border-[6px] border-lavender/10 border-t-lavender rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-lavender animate-pulse" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-navy/40 font-bold uppercase tracking-[0.5em] text-[10px]">Synchronizing Clinical Records</p>
                <p className="text-lavender text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">Secure End-to-End Encryption Active</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="bg-white p-12 text-center max-w-lg mx-auto mt-20 font-sans rounded-[56px] border border-navy/5 shadow-3xl">
            <div className="w-20 h-20 bg-red-400/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-navy mb-4 font-display uppercase tracking-tight">Access Interrupted</h2>
            <p className="text-navy/40 mb-10 font-medium leading-relaxed">{error}</p>
            <button onClick={() => window.location.reload()} className="w-full py-5 bg-navy text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-xl shadow-navy/20">Retry Secure Access</button>
        </div>
    )

    const { patient, nextAppointment, recentVisits, balance } = data

    return (
        <div ref={containerRef} className="space-y-12 pb-24 selection:bg-lavender/20 font-sans">
            {/* 1. Welcoming Context */}
            <header className="dash-reveal space-y-2">
                <p className="text-[10px] text-lavender font-bold uppercase tracking-[0.4em]">Patient Dashboard</p>
                <h1 className="text-4xl md:text-5xl font-medium text-navy font-display leading-[1.1] tracking-tight">
                    Good Morning, <span className="text-lavender italic">{patient.name.split(' ')[0]}</span>
                </h1>
                <p className="text-navy/40 text-sm font-medium">Manage your treatments, appointments, and medical records securely.</p>
            </header>

            {/* 2. Key Modules Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Stats & Next Appointment (Left 8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Next Appointment Card - Clean & Focused */}
                    <div className="dash-reveal bg-white rounded-[40px] border border-navy/5 shadow-sm p-10 relative overflow-hidden group hover:shadow-xl transition-all duration-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-lavender" />
                                    </div>
                                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.3em]">Upcoming Visit</p>
                                </div>
                                
                                {nextAppointment ? (
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-display font-medium text-navy italic">{nextAppointment.service.name}</h2>
                                        <div className="flex gap-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                                            <span className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-navy/5">
                                                <Clock className="w-3.5 h-3.5 text-lavender" /> {formatDate(nextAppointment.date)} @ {new Date(nextAppointment.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-display font-medium text-navy/40">No visits scheduled</h2>
                                        <p className="text-[10px] text-lavender font-bold uppercase tracking-widest">Maintain your routine for optimal health</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {nextAppointment ? (
                                    <>
                                        <button onClick={() => router.push(`/book?reschedule=${nextAppointment.id}`)} className="px-8 py-4 bg-navy text-white text-[9px] font-bold rounded-2xl uppercase tracking-[0.2em] shadow-lg hover:bg-lavender transition-all">Reschedule</button>
                                        <button onClick={handleCancel} disabled={cancelling} className="px-6 py-4 border border-navy/5 text-[9px] font-bold text-navy/30 rounded-2xl uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 transition-all">{cancelling ? '...' : 'Cancel'}</button>
                                    </>
                                ) : (
                                    <Link href="/book" className="px-10 py-5 bg-navy text-white text-[10px] font-bold rounded-2xl uppercase tracking-[0.3em] shadow-xl hover:bg-lavender transition-all hover:scale-105 active:scale-95">Book New Visit</Link>
                                )}
                            </div>
                        </div>
                        {/* Subtle background element */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-lavender/5 rounded-full blur-[80px]" />
                    </div>

                    {/* Stats Row */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="dash-reveal bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm hover:shadow-lg transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-lavender/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-lavender" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-navy/30 font-bold uppercase tracking-[0.3em] mb-1">Account Balance</p>
                                    <h3 className={`text-2xl font-bold font-display ${balance > 0 ? 'text-red-500' : 'text-navy'}`}>{formatCurrency(balance)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="dash-reveal bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm hover:shadow-lg transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center">
                                    <History className="w-6 h-6 text-navy/20" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-navy/30 font-bold uppercase tracking-[0.3em] mb-1">Clinic Records</p>
                                    <h3 className="text-2xl font-bold font-display text-navy">{recentVisits.length} Treatments</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent History Table Style */}
                    <section className="dash-reveal bg-white rounded-[40px] border border-navy/5 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-10 py-8 border-b border-navy/5 flex justify-between items-center bg-surface/30">
                            <h2 className="text-sm font-bold text-navy uppercase tracking-widest">Medical History</h2>
                            <Link href="/book" className="text-[10px] font-bold text-lavender uppercase tracking-widest hover:underline">+ Request Visit</Link>
                        </div>
                        <div className="p-2">
                            {recentVisits.length === 0 ? (
                                <div className="py-20 text-center text-navy/20 text-[10px] font-bold uppercase tracking-[0.4em]">No medical records found</div>
                            ) : (
                                <div className="divide-y divide-navy/5">
                                    {recentVisits.map((visit: any) => (
                                        <div key={visit.id} className="p-8 hover:bg-surface/50 transition-colors group">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-lg font-bold text-navy font-display italic tracking-tight">{visit.service}</h4>
                                                        <span className="px-3 py-1 bg-lavender/10 text-lavender text-[8px] font-bold rounded-full uppercase tracking-widest border border-lavender/5">Verified</span>
                                                    </div>
                                                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em]">{formatDate(visit.date)}</p>
                                                    <p className="text-[13px] text-navy/50 max-w-xl leading-relaxed">{visit.notes || 'Routine clinical procedure completed.'}</p>
                                                </div>
                                                {visit.invoice && (
                                                    <button onClick={() => handleDownload(visit)} className="w-10 h-10 rounded-xl bg-surface border border-navy/5 flex items-center justify-center text-navy/20 hover:text-lavender hover:bg-white transition-all shadow-sm">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Panel (4 Columns) - Clinic Info & Tips */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="dash-reveal bg-navy rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                         <p className="text-[9px] text-lavender font-bold uppercase tracking-[0.4em] mb-6">Expert Care</p>
                         <h3 className="text-2xl font-display italic mb-8">Clinical Excellence <br/> Without Borders</h3>
                         <div className="space-y-6">
                             <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                 <Phone className="w-4 h-4 text-lavender"/> 24/7 Priority Support
                             </div>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                 <Shield className="w-4 h-4 text-lavender"/> Data Encrypted 
                             </div>
                         </div>
                         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lavender/10 rounded-full blur-[60px]"/>
                    </div>

                    <div className="dash-reveal bg-white rounded-[40px] p-10 border border-navy/5">
                        <h4 className="text-[10px] font-bold text-navy uppercase tracking-[0.4em] mb-8">Health Guidance</h4>
                        <div className="space-y-8">
                            {[
                                { title: 'Post-Care Routine', desc: 'Brush 2x daily with fluoride.' },
                                { title: 'Annual Checkup', desc: 'Next recommended: Oct 2025' }
                            ].map((tip) => (
                                <div key={tip.title} className="space-y-2">
                                    <p className="text-[11px] font-bold text-navy">{tip.title}</p>
                                    <p className="text-xs text-navy/40 leading-relaxed font-medium">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

