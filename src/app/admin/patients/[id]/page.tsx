'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    ChevronRight, Calendar, Clock, Phone, Mail,
    MapPin, AlertCircle, Plus, FileText,
    ArrowLeft, Stethoscope, History, CreditCard
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation' // Keep useParams if still needed for other purposes, but patient is now a prop
import DentalChart from '@/components/admin/DentalChart'
import TreatmentPlan from '@/components/admin/TreatmentPlan'
import InvoicesList from '@/components/admin/InvoicesList'
import VisitRecordModal from '@/components/admin/VisitRecordModal'
import { formatDate, getStatusColor } from '@/lib/utils' // Removed formatCurrency as it's not used and not in the new import list

export default function PatientProfilePage({ patient: initialPatient }: { patient: any }) {
    const router = useRouter()
    const { id } = useParams() // Keep useParams if other parts of the component still rely on it, e.g., for API calls that refresh data
    const [patient, setPatient] = useState(initialPatient)
    const [activeTab, setActiveTab] = useState('overview')
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
    // Removed loading state as patient is now passed as a prop

    // If patient data needs to be refreshed after an action, you might still need a fetch function
    // For now, assuming initialPatient is sufficient and router.refresh() handles updates
    // If you need to refetch patient data based on ID changes or other events,
    // you would reintroduce a fetchPatient function and a useEffect for it.
    // For this specific instruction, the fetchPatient and its useEffect are removed
    // as the patient is passed as a prop.

    // If patient data needs to be refreshed after an action, you might still need a fetch function
    // For now, assuming initialPatient is sufficient and router.refresh() handles updates
    // If you need to refetch patient data based on ID changes or other events,
    // you would reintroduce a fetchPatient function and a useEffect for it.
    // For this specific instruction, the fetchPatient and its useEffect are removed
    // as the patient is passed as a prop.

    // If the patient prop can change, or if you need to refetch patient data
    // based on the ID from useParams, you might re-introduce a useEffect like this:
    /*
    useEffect(() => {
        if (id && !initialPatient) { // Only fetch if no initial patient is provided
            async function fetchPatientData() {
                try {
                    const res = await fetch(`/api/patients/${id}`)
                    const data = await res.json()
                    setPatient(data)
                } catch (e) {
                    console.error(e)
                }
            }
            fetchPatientData()
        } else if (initialPatient) {
            setPatient(initialPatient)
        }
    }, [id, initialPatient])
    */

    // If patient is null (e.g., if initialPatient was null and no fetch happened)
    if (!patient) return <div className="p-12 text-center text-red-500">Patient not found</div>

    const TABS = [
        { id: 'overview', label: 'Overview', icon: Stethoscope },
        { id: 'dental-chart', label: 'Dental Chart', icon: History },
        { id: 'treatment-plan', label: 'Treatment Plan', icon: FileText },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ]

    return (
        <div className="p-8">
            {/* Breadcrumbs / Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/patients" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-dark font-display">{patient.name}</h1>
                        <span className="badge bg-navy/5 text-navy border border-navy/10 uppercase tracking-widest text-[10px]">Active</span>
                    </div>
                    <p className="text-gray-500 text-sm">Patient ID: {patient.id.slice(-8)} • Member since {formatDate(patient.createdAt)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Info */}
                    <div className="card p-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy to-mint-dark flex items-center justify-center text-white text-3xl font-bold mb-6 mx-auto shadow-lg">
                            {patient.name[0]}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Phone</p>
                                    <p className="text-sm font-semibold text-dark">{patient.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Email</p>
                                    <p className="text-sm font-semibold text-dark">{patient.email || 'None'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Date of Birth</p>
                                    <p className="text-sm font-semibold text-dark">{patient.dob ? formatDate(patient.dob) : 'None'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Address</p>
                                    <p className="text-sm font-medium text-gray-600 line-clamp-2">{patient.address || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Alerts */}
                    <div className="card p-6 border-l-4 border-l-red-500 bg-red-50/20">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <h3 className="font-bold text-red-800 text-xs uppercase tracking-widest">Medical Alerts</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[9px] text-red-600/60 font-bold uppercase tracking-wider mb-1">Allergies</p>
                                <p className="text-sm font-bold text-red-700">{patient.allergies || 'No known allergies'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-red-600/60 font-bold uppercase tracking-wider mb-1">Medical Notes</p>
                                <p className="text-xs text-red-600/80 leading-relaxed italic">{patient.medicalNotes || 'No notes'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Tabs Nav */}
                    <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-navy text-white shadow-md'
                                    : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="min-h-[500px]"
                    >
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Upcoming Appointments */}
                                <div className="card p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-dark font-display text-lg">Upcoming</h3>
                                        <button className="text-navy p-1.5 hover:bg-navy/5 rounded-lg transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {patient.appointments.filter((a: any) => new Date(a.date) > new Date()).map((app: any) => (
                                            <div key={app.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-gray-200 transition-all">
                                                <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center border border-gray-100 flex-shrink-0">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{format(new Date(app.date), 'MMM')}</span>
                                                    <span className="text-lg font-bold text-navy leading-none">{format(new Date(app.date), 'd')}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-dark text-sm">{app.service?.name}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-gray-400 text-xs">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(app.date), 'h:mm a')}</span>
                                                    </div>
                                                </div>
                                                <span className={`badge h-fit self-center ${getStatusColor(app.status)}`}>{app.status}</span>
                                            </div>
                                        ))}
                                        {patient.appointments.filter((a: any) => new Date(a.date) > new Date()).length === 0 && (
                                            <p className="text-center py-8 text-gray-400 text-sm">No upcoming appointments</p>
                                        )}
                                    </div>
                                </div>

                                {/* Patient Stats */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="card p-4 text-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Visits</p>
                                            <p className="text-2xl font-bold text-dark">{patient.appointments.length}</p>
                                        </div>
                                        <div className="card p-4 text-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Balance Due</p>
                                            <p className="text-2xl font-bold text-red-500">₦0.00</p>
                                        </div>
                                    </div>
                                    <div className="card p-6">
                                        <h3 className="font-bold text-dark font-display mb-4">Treatment Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Overall Progress</span>
                                                <span className="font-bold text-navy">65%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-navy w-[65%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'dental-chart' && (
                            <DentalChart
                                patientId={patient.id}
                                initialData={patient.dentalChart?.teeth || []}
                            />
                        )}

                        {activeTab === 'appointments' && (
                            <div className="card overflow-hidden">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Service</th>
                                            <th>Status</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patient.appointments.map((app: any) => (
                                            <tr key={app.id}>
                                                <td className="font-medium text-dark">{formatDate(app.date)}</td>
                                                <td className="text-gray-500">{format(new Date(app.date), 'h:mm a')}</td>
                                                <td>{app.service?.name}</td>
                                                <td><span className={`badge ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointment(app)
                                                            setIsRecordModalOpen(true)
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-all flex items-center gap-2 ml-auto"
                                                    >
                                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">Record Visit</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'treatment-plan' && (
                            <TreatmentPlan plans={patient.treatmentPlans || []} />
                        )}

                        {activeTab === 'billing' && (
                            <InvoicesList invoices={patient.invoices || []} patient={patient} />
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            {selectedAppointment && (
                <VisitRecordModal
                    isOpen={isRecordModalOpen}
                    onClose={() => {
                        setIsRecordModalOpen(false)
                        setSelectedAppointment(null) // Clear selected appointment when closing
                    }}
                    appointment={selectedAppointment}
                    patientId={patient.id}
                    onSuccess={() => {
                        router.refresh()
                        setIsRecordModalOpen(false)
                        setSelectedAppointment(null)
                    }}
                />
            )}
        </div>
    )
}
