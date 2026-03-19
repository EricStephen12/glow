'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Calendar, ClipboardList, Stethoscope, Pill } from 'lucide-react'

export default function VisitRecordModal({
    isOpen,
    onClose,
    appointment,
    patientId,
    onSuccess
}: {
    isOpen: boolean,
    onClose: () => void,
    appointment: any,
    patientId: string,
    onSuccess: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        chiefComplaint: appointment?.visitRecord?.chiefComplaint || '',
        diagnosis: appointment?.visitRecord?.diagnosis || '',
        treatmentDone: appointment?.visitRecord?.treatmentDone || '',
        medicationGiven: appointment?.visitRecord?.medicationGiven || '',
        notes: appointment?.visitRecord?.notes || '',
        nextVisitDate: appointment?.visitRecord?.nextVisitDate ? new Date(appointment.visitRecord.nextVisitDate).toISOString().split('T')[0] : '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/visit-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    appointmentId: appointment.id,
                    patientId
                })
            })
            if (res.ok) {
                onSuccess()
                onClose()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-end">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-navy/20 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-dark font-display">Clinical Visit Record</h2>
                            <p className="text-xs text-gray-400 mt-1">For appointment on {new Date(appointment.date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-navy mb-2">
                                <Stethoscope className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Assessment</h3>
                            </div>

                            <div>
                                <label className="form-label text-[10px]">Chief Complaint</label>
                                <textarea
                                    className="form-input text-sm"
                                    rows={2}
                                    value={formData.chiefComplaint}
                                    onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                    placeholder="What brought the patient in?"
                                />
                            </div>

                            <div>
                                <label className="form-label text-[10px]">Diagnosis</label>
                                <textarea
                                    className="form-input text-sm"
                                    rows={2}
                                    value={formData.diagnosis}
                                    onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                                    placeholder="Clinical findings..."
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-mint-dark mb-2">
                                <ClipboardList className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Treatment</h3>
                            </div>

                            <div>
                                <label className="form-label text-[10px]">Treatment Performed</label>
                                <textarea
                                    className="form-input text-sm"
                                    rows={3}
                                    value={formData.treatmentDone}
                                    onChange={e => setFormData({ ...formData, treatmentDone: e.target.value })}
                                    placeholder="Procedures completed during this visit..."
                                />
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <label className="form-label text-[10px]">Medication / Prescription</label>
                                    <div className="relative">
                                        <Pill className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                                        <textarea
                                            className="form-input text-sm pl-10"
                                            rows={2}
                                            value={formData.medicationGiven}
                                            onChange={e => setFormData({ ...formData, medicationGiven: e.target.value })}
                                            placeholder="Drugs administered or prescribed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Calendar className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Follow-up</h3>
                            </div>

                            <div>
                                <label className="form-label text-[10px]">Notes</label>
                                <textarea
                                    className="form-input text-sm"
                                    rows={2}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            <div>
                                <label className="form-label text-[10px]">Recommended Next Visit</label>
                                <input
                                    type="date"
                                    className="form-input text-sm"
                                    value={formData.nextVisitDate}
                                    onChange={e => setFormData({ ...formData, nextVisitDate: e.target.value })}
                                />
                            </div>
                        </section>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-2 px-8 py-3 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Clinical Record
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
