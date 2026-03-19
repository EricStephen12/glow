'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar, Clock, CheckCircle, Sparkles, Shield, ArrowRight, ArrowLeft
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PortalBookPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [patient, setPatient] = useState<any>(null)
    const [loadingData, setLoadingData] = useState(true)
    
    const [bookingData, setBookingData] = useState({
        service: '',
        date: '',
        time: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const services = [
        { id: 'static-1', name: 'Smile Transformation', price: 'Consultation', icon: Sparkles },
        { id: 'static-2', name: 'Teeth Whitening', price: 'Fixed Fee', icon: Sparkles },
        { id: 'static-3', name: 'General Check-up', price: 'Routine Care', icon: Shield },
        { id: 'static-4', name: 'Dental Implants', price: 'Consultation', icon: Shield },
        { id: 'static-5', name: 'Emergency Care', price: 'Immediate Access', icon: Sparkles },
    ]

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch('/api/patient/dashboard')
                if (!res.ok) throw new Error('Unauthorized')
                const data = await res.json()
                setPatient(data.patient)
            } catch (err) {
                router.push('/portal/login')
            } finally {
                setLoadingData(false)
            }
        }
        fetchPatient()
    }, [router])

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    async function handleFinalizeBooking() {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...bookingData,
                    name: patient.name,
                    email: patient.email,
                    phone: patient.phone || ''
                })
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to book appointment')
            } else {
                setStep(3)
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return <div className="p-12 text-center text-navy/40 font-bold uppercase tracking-widest text-xs">Authorizing...</div>
    }

    return (
        <div className="p-8 pb-24 font-sans selection:bg-lavender/20">
            <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] text-lavender font-bold uppercase tracking-[0.4em] mb-2">Clinical Visit</p>
                    <h1 className="text-3xl md:text-5xl font-medium text-navy font-display leading-[1.1] tracking-tight">Book <span className="text-lavender italic">Appointment</span></h1>
                </div>

                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step >= i ? 'bg-navy text-white shadow-lg' : 'bg-navy/5 text-navy/30'
                            }`}>
                                {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                            </div>
                            {i < 3 && <div className={`w-8 h-0.5 rounded-full ${step > i ? 'bg-navy' : 'bg-navy/10'}`} />}
                        </div>
                    ))}
                </div>
            </header>

            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-navy mb-2">Select Your Treatment</h2>
                                <p className="text-navy/40 text-sm font-medium">Choose a service for your upcoming visit, {patient.name.split(' ')[0]}.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {services.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setBookingData({ ...bookingData, service: s.name })
                                            nextStep()
                                        }}
                                        className="flex items-center justify-between p-6 bg-white rounded-3xl border border-navy/5 hover:border-lavender/40 hover:shadow-xl transition-all group text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-lavender/10 flex items-center justify-center group-hover:bg-lavender group-hover:scale-110 transition-all">
                                                <s.icon className="w-5 h-5 text-lavender group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-navy group-hover:text-lavender transition-colors">{s.name}</h3>
                                                <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest mt-1">{s.price}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-navy mb-2">Preferred Schedule</h2>
                                <p className="text-navy/40 text-sm font-medium">Select a time that suits your lifestyle.</p>
                            </div>

                            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-navy/5 shadow-sm space-y-10">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <label className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-4 block">Available Dates</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[...Array(12)].map((_, i) => {
                                                const d = new Date()
                                                d.setDate(d.getDate() + i + 1)
                                                const dateStr = d.toISOString().split('T')[0]
                                                const dayNum = d.getDate()
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setBookingData({ ...bookingData, date: dateStr })}
                                                        className={`py-4 rounded-xl border flex items-center justify-center flex-col transition-all ${
                                                            bookingData.date === dateStr
                                                                ? 'bg-navy border-navy text-white shadow-lg scale-105'
                                                                : 'bg-white border-navy/5 text-navy/60 hover:border-lavender/30 hover:text-lavender'
                                                        }`}
                                                    >
                                                        <span className="text-lg font-bold">{dayNum}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-4 block">Time Window</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['08:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:30 PM'].map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setBookingData({ ...bookingData, time: t })}
                                                    className={`py-4 rounded-xl border text-xs font-bold tracking-widest transition-all ${
                                                        bookingData.time === t
                                                            ? 'bg-lavender border-lavender text-white shadow-lg scale-105'
                                                            : 'bg-white border-navy/5 text-navy/60 hover:border-lavender/30 hover:text-lavender'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest bg-red-50 py-3 rounded-lg">{error}</p>}

                                <div className="flex gap-4 pt-6 border-t border-navy/5">
                                    <button onClick={prevStep} className="px-8 py-5 border border-navy/5 rounded-2xl text-[10px] font-bold text-navy/40 flex items-center gap-2 uppercase tracking-widest hover:bg-surface transition-all">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        onClick={handleFinalizeBooking}
                                        disabled={!bookingData.date || !bookingData.time || loading}
                                        className="flex-1 bg-navy text-white rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lavender hover:shadow-xl transition-all"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Appointment'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] p-12 text-center border border-navy/5 shadow-xl max-w-2xl mx-auto mt-10"
                        >
                            <div className="w-24 h-24 bg-lavender/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <div className="absolute inset-0 border-2 border-lavender/30 rounded-full animate-ping opacity-50" />
                                <CheckCircle className="w-10 h-10 text-lavender relative z-10" />
                            </div>
                            <h2 className="text-3xl font-medium text-navy font-display mb-4">Visit Confrimed</h2>
                            <p className="text-navy/40 text-sm font-medium mb-10 max-w-md mx-auto">
                                Your appointment for <span className="font-bold text-navy">{bookingData.service}</span> has been scheduled successfully. You can manage this visit from your dashboard.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => router.push('/portal/dashboard')} className="px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-lavender transition-all hover:-translate-y-1">
                                    View Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
