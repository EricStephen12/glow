'use client'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
    TrendingUp, Users, Calendar, CreditCard,
    Download, Filter, ChevronDown
} from 'lucide-react'

import { useState, useEffect } from 'react'

const COLORS = ['#6B1D2A', '#D4A574', '#C9A84C', '#3D2028', '#94a3b8']

export default function AdminReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch('/api/admin/analytics')
                const json = await res.json()
                setData(json)
            } catch (e) {
                console.error('Failed to fetch analytics', e)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    if (loading) return (
        <div className="p-12 text-center text-gray-400">
            <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin mx-auto mb-4" />
            Analyzing clinic performance...
        </div>
    )

    if (!data) return <div className="p-12 text-center text-red-500">Failed to load analytics data.</div>

    const { revenueData, appointmentData, servicesData, growthData } = data
    return (
        <div className="p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark font-display">Analytics & Reports</h1>
                    <p className="text-gray-500">Insights into clinic performance, growth and patient trends.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold flex items-center gap-2 hover:bg-navy-dark shadow-sm transition-all">
                        Last 30 Days <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Growth', value: '+24%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Retention', value: '82%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'No-show Rate', value: '4.2%', icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Total Patients', value: '1,248', icon: CreditCard, color: 'text-gold-dark', bg: 'bg-gold-light/20' },
                ].map((stat, i) => (
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

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg font-display text-dark">Revenue Summary</h2>
                        <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-gray-400">
                            <Filter className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6B1D2A" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6B1D2A" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(value) => `₦${value / 1000000}M`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6B1D2A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointments Chart */}
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg font-display text-dark">Weekly Appointments</h2>
                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-navy"></div> This Week</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={APPOINTMENTS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#6B1D2A" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Most Booked Services */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <h2 className="font-bold text-lg font-display text-dark mb-6">Popular Services</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={SERVICES_DATA}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {SERVICES_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            {SERVICES_DATA.map((s, i) => (
                                <div key={s.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        {s.name}
                                    </div>
                                    <span className="font-bold text-dark">{s.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Growth Stats Table */}
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg font-display text-dark">Patient Growth Tracking</h2>
                            <button className="text-xs font-bold text-navy hover:bg-navy/5 px-3 py-1.5 rounded-lg transition-colors">Download Full Report</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>New Patients</th>
                                    <th>Returning</th>
                                    <th>Conversion</th>
                                    <th>Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {growthData.map((row: any, i: number) => (
                                    <tr key={i}>
                                        <td className="font-bold text-dark text-sm">{row.month}</td>
                                        <td className="text-gray-500">{row.new}</td>
                                        <td className="text-gray-500">{row.ret}</td>
                                        <td>{row.conv}</td>
                                        <td><span className="text-green-600 font-bold">{row.growth}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
