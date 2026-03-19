'use client'
import { motion } from 'framer-motion'
import {
    Users, Calendar, CreditCard, TrendingUp,
    Clock, ArrowUpRight, CheckCircle2, AlertCircle, ChevronRight, Activity, Zap, Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                const json = await res.json()
                setData(json)
            } catch (e) {
                console.error('Failed to fetch stats:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 font-sans p-12">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-lavender/10 border-t-lavender rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-lavender animate-pulse" />
            </div>
            <p className="text-navy/40 font-bold uppercase tracking-[0.3em] text-[10px]">Authorizing Clinical System</p>
        </div>
    )

    if (!data) return (
        <div className="bg-white p-12 text-center max-w-lg mx-auto mt-20 font-sans rounded-[48px] border border-navy/5 shadow-xl">
            <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">Sync Failed</h2>
            <p className="text-navy/40 mb-8 font-medium">Unable to load clinical metrics. Please verify your credentials.</p>
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-navy text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Retry Secure Sync</button>
        </div>
    )

    const statsConfig = [
        { label: "Today's Clinical Volume", value: data.stats.todayAppointments, icon: Calendar, color: 'text-lavender', trend: '+20%' },
        { label: 'Total Patient Registry', value: data.stats.newPatients, icon: Users, color: 'text-lavender', trend: '+10%' },
        { label: "Gross Receipts", value: `₦${data.stats.todayRevenue.toLocaleString()}`, icon: CreditCard, color: 'text-lavender', trend: '+15%' },
        { label: 'Clinical Satisfaction', value: data.stats.satisfaction, icon: Zap, color: 'text-lavender', trend: '99%' },
    ]

    return (
        <div className="p-10 space-y-12 selection:bg-lavender/20 font-sans">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-navy/5 pb-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-medium text-navy font-display">Clinical <span className="text-lavender italic font-display">Intelligence</span></h1>
                    <p className="text-navy/40 mt-3 font-bold uppercase tracking-widest text-[10px]">Central Command • {format(new Date(), 'EEEE, MMMM do')}</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-3.5 bg-white border border-navy/5 rounded-2xl text-navy font-bold text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm">
                        System Diagnostics
                    </button>
                    <Link href="/admin/schedule" className="px-8 py-3.5 bg-lavender text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-navy transition-all shadow-lg shadow-lavender/20">
                        Active Schedule
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statsConfig.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[40px] p-8 border border-navy/5 group relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-lavender/5 rounded-bl-[60px] translate-x-8 -translate-y-8 group-hover:bg-lavender group-hover:scale-150 transition-all duration-700" />
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                <stat.icon className={`w-6 h-6 ${stat.color} transition-colors duration-500`} />
                            </div>
                            <span className="text-[10px] font-bold text-navy bg-navy/5 px-3 py-1.5 rounded-full flex items-center gap-1 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                                {stat.trend} <ArrowUpRight className="w-3 h-3 text-lavender" />
                            </span>
                        </div>
                        <h3 className="text-navy/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10 group-hover:text-navy/40 transition-colors uppercase">{stat.label}</h3>
                        <p className="text-3xl font-medium text-navy relative z-10 font-display group-hover:scale-105 transition-transform origin-left duration-500">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Upcoming Schedule */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[56px] border border-navy/5 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="px-12 py-10 border-b border-navy/5 flex justify-between items-center bg-surface/50">
                            <div>
                                <h2 className="font-medium text-2xl font-display text-navy uppercase tracking-widest">Priority Queue</h2>
                                <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em] mt-2">Active Clinical Visits For Verification</p>
                            </div>
                            <Link href="/admin/schedule" className="px-6 py-2.5 rounded-full bg-navy/5 text-[9px] font-bold text-navy uppercase tracking-widest hover:bg-navy hover:text-white transition-all">Full Registry View</Link>
                        </div>
                        <div className="p-0 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface">
                                        <th className="px-12 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Patient Profile</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Clinical Service</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Operational Time</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy/5">
                                    {data.recentAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-24">
                                                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-navy/5">
                                                    <Calendar className="w-8 h-8 text-navy/5" />
                                                </div>
                                                <p className="text-navy/30 text-[10px] font-bold uppercase tracking-[0.3em]">No visits scheduled for current cycle</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.recentAppointments.map((app: any, idx: number) => (
                                            <motion.tr
                                                key={app.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-surface transition-all cursor-pointer"
                                            >
                                                <td className="px-12 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-11 h-11 rounded-2xl bg-lavender/10 flex items-center justify-center font-bold text-lavender text-xs group-hover:bg-lavender group-hover:text-white transition-all duration-500">
                                                            {app.patient[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-navy text-sm group-hover:text-lavender transition-all">{app.patient}</p>
                                                            <p className="text-[9px] text-navy/30 font-bold uppercase tracking-widest mt-0.5">Verified Profile</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 font-medium text-navy/70 text-[13px] font-display italic group-hover:translate-x-1 transition-transform">{app.service}</td>
                                                <td className="px-6 py-8">
                                                    <div className="flex items-center gap-3 text-navy/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                        <Clock className="w-4 h-4 text-lavender/40 group-hover:text-lavender transition-colors" />
                                                        {format(new Date(app.time), 'hh:mm a')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 text-center">
                                                    <Link href={`/admin/patients/${app.patientId}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy rounded-2xl text-white text-[9px] font-bold uppercase tracking-widest hover:bg-lavender transition-all shadow-lg hover:shadow-lavender/20">
                                                        Registry <ChevronRight className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Registry Activity */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[56px] border border-navy/5 shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-10 py-10 border-b border-navy/5 flex justify-between items-center bg-surface/50">
                            <h2 className="font-medium text-xl font-display text-navy uppercase tracking-widest">Operational Log</h2>
                            <Activity className="w-4 h-4 text-lavender animate-pulse" />
                        </div>
                        <div className="p-10 space-y-12 flex-1 overflow-y-auto custom-scrollbar">
                            {data.activities.map((activity: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${activity.type === 'PAYMENT'
                                        ? 'bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-500/20'
                                        : 'bg-lavender/5 text-lavender group-hover:bg-lavender group-hover:text-white group-hover:shadow-lg group-hover:shadow-lavender/20'
                                        }`}>
                                        {activity.type === 'PAYMENT' ? (
                                            <CreditCard className="w-6 h-6 transition-all" />
                                        ) : (
                                            <Calendar className="w-6 h-6 transition-all" />
                                        )}
                                    </div>
                                    <div className="flex-1 border-b border-navy/5 pb-8 last:border-0 group-last:border-0">
                                        <h4 className="text-[13px] font-bold text-navy group-hover:text-lavender transition-colors">{activity.title}</h4>
                                        <p className="text-[11px] text-navy/40 mt-1.5 leading-relaxed font-medium group-hover:text-navy/60 transition-colors">{activity.desc}</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-[8px] font-bold text-navy/20 bg-surface px-2 py-1 rounded-full uppercase tracking-[0.2em] group-hover:text-lavender transition-colors">
                                                {format(new Date(activity.time), 'h:mm a')}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-navy/10" />
                                            <span className="text-[8px] font-bold text-navy/20 uppercase tracking-[0.2em]">Clinical-Verified</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-10 pt-0">
                            <button className="w-full py-5 rounded-[24px] bg-surface border border-navy/5 text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] hover:bg-navy hover:text-white transition-all shadow-sm hover:shadow-xl duration-500">
                                Authorize Full Activity Ledger
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
