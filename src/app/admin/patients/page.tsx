'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
    Users, Search, UserPlus, Filter,
    MoreVertical, Phone, Mail, Calendar,
    ChevronRight, ArrowUpDown
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function AdminPatientsPage() {
    const [patients, setPatients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchPatients()
    }, [])

    async function fetchPatients() {
        try {
            const res = await fetch(`/api/patients?q=${search}`)
            const data = await res.json()
            setPatients(data.patients || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
    )

    return (
        <div className="p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-navy font-display">Patient Records</h1>
                    <p className="text-navy/50 text-sm font-medium">Manage and clinical view of patient history and profiles.</p>
                </div>
                <button className="flex items-center gap-3 bg-navy text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-lavender transition-all duration-300">
                    <UserPlus className="w-4 h-4" />
                    Add New Patient
                </button>
            </header>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20 group-focus-within:text-lavender transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full bg-white border border-navy/5 rounded-2xl py-3 pl-12 pr-4 text-navy placeholder:text-navy/20 focus:outline-none focus:ring-2 focus:ring-lavender/20 transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="px-6 py-3 rounded-2xl border border-navy/5 text-[10px] font-bold text-navy/60 bg-white flex items-center gap-2 hover:bg-surface transition-colors uppercase tracking-widest">
                    <Filter className="w-4 h-4 text-lavender" />
                    Filters
                </button>
                <button className="px-6 py-3 rounded-2xl border border-navy/5 text-[10px] font-bold text-navy/60 bg-white flex items-center gap-2 hover:bg-surface transition-colors uppercase tracking-widest">
                    <ArrowUpDown className="w-4 h-4 text-lavender" />
                    Sort
                </button>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-[32px] border border-navy/5 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-navy/20 font-bold uppercase tracking-widest text-[10px]">Loading Clinical Records...</div>
                ) : filteredPatients.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-navy/10" />
                        </div>
                        <p className="text-navy font-bold text-sm">No patients found</p>
                        <p className="text-navy/30 text-[10px] mt-1 font-bold uppercase tracking-widest">Try adjusting your search or add a new patient.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-navy/5 bg-surface/50">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Patient Name</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Contact Info</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Gender / DOB</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Last Visit</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Appts</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy/5">
                                {filteredPatients.map((patient, i) => (
                                    <motion.tr
                                        key={patient.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-surface/30 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <Link href={`/admin/patients/${patient.id}`} className="group/item">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-lavender/10 text-lavender font-bold flex items-center justify-center group-hover/item:bg-lavender group-hover/item:text-white transition-all shadow-sm">
                                                        {patient.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-navy text-sm group-hover/item:text-lavender transition-colors">{patient.name}</p>
                                                        <p className="text-[10px] text-navy/20 uppercase tracking-widest font-bold">ID: {patient.id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[11px] text-navy/60 font-medium">
                                                    <Phone className="w-3 h-3 text-lavender" />
                                                    {patient.phone}
                                                </div>
                                                {patient.email && (
                                                    <div className="flex items-center gap-2 text-[11px] text-navy/30">
                                                        <Mail className="w-3 h-3" />
                                                        {patient.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[11px] text-navy font-bold uppercase tracking-wider">{patient.gender || '—'}</div>
                                            <div className="text-[10px] text-navy/30 flex items-center gap-1 font-medium">
                                                <Calendar className="w-3 h-3" />
                                                {patient.dob ? formatDate(patient.dob) : '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[10px] text-navy/20 font-bold uppercase tracking-widest">No visits yet</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-navy shadow-inner">
                                                {patient._count?.appointments || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/patients/${patient.id}`}
                                                    className="p-2 hover:bg-lavender/10 rounded-xl text-navy/20 hover:text-lavender transition-all"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                                <button className="p-2 hover:bg-surface rounded-xl text-navy/20 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
