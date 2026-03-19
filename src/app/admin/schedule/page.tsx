'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Clock, Plus, Filter, MoreHorizontal
} from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM to 6 PM

export default function AdminSchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 6 }, (_, i) => addDays(startDate, i))

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/appointments?start=${startDate.toISOString()}&end=${addDays(startDate, 6).toISOString()}`)
                const data = await res.json()
                setAppointments(data)
            } catch (e) {
                console.error('Failed to fetch appointments:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchAppointments()
    }, [currentDate])

    return (
        <div className="p-8 h-screen flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-dark font-display">Schedule</h1>
                    <p className="text-gray-500">Manage all clinical appointments and availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    <button className="btn-primary">
                        <Plus className="w-4 h-4" /> Book New
                    </button>
                </div>
            </header>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-dark font-display">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center gap-1 ml-4">
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, -7))}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1.5 text-xs font-bold text-navy hover:bg-navy/5 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, 7))}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-navy text-white">Week</button>
                    <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-gray-400 hover:bg-gray-50">Day</button>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="flex-1 overflow-hidden flex flex-col card p-0">
                {/* Header Row */}
                <div className="flex border-b border-gray-100">
                    <div className="w-20 flex-shrink-0 border-r border-gray-100 py-4" />
                    {weekDays.map((day) => (
                        <div key={day.toString()} className="flex-1 py-4 text-center border-r border-gray-100 last:border-r-0">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{format(day, 'EEE')}</p>
                            <p className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-navy' : 'text-dark'}`}>{format(day, 'd')}</p>
                        </div>
                    ))}
                </div>

                {/* Scrollable Grid Body */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <div className="flex min-h-[800px]">
                        {/* Time Column */}
                        <div className="w-20 flex-shrink-0 border-r border-gray-100">
                            {HOURS.map((hour) => (
                                <div key={hour} className="h-20 border-b border-gray-50 text-[10px] text-gray-400 font-bold p-2 text-right">
                                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                </div>
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDays.map((day) => (
                            <div key={day.toString()} className="flex-1 border-r border-gray-100 last:border-r-0 relative">
                                {HOURS.map((hour) => (
                                    <div key={hour} className="h-20 border-b border-gray-50 bg-gray-50/5 hover:bg-navy/5 transition-colors group cursor-pointer relative">
                                        <button className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="w-4 h-4 text-navy/40" />
                                        </button>
                                    </div>
                                ))}

                                {/* Appointments logic */}
                                {appointments.filter(app => isSameDay(new Date(app.date), day)).map(app => {
                                    const appDate = new Date(app.date)
                                    const hour = appDate.getHours()
                                    const minutes = appDate.getMinutes()
                                    const duration = 1 // Basic duration if not specified

                                    return (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute left-1 right-1 z-10 p-2 rounded-xl bg-gradient-to-br from-navy to-navy-light text-white shadow-lg border border-white/10 overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-all"
                                            style={{
                                                top: `${(hour - 8 + minutes / 60) * 80 + 4}px`,
                                                height: `${duration * 80 - 8}px`
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-[11px] leading-tight truncate">{app.patient.name}</p>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-mint-light mt-0.5 truncate">{app.service?.name || 'General'}</p>
                                            <div className="flex items-center gap-1 text-[9px] mt-1 text-white/60">
                                                <Clock className="w-2.5 h-2.5" />
                                                {format(appDate, 'h:mm a')}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
