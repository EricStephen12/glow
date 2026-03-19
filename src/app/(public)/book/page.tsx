'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar, Clock, User, ChevronRight,
    CheckCircle, Sparkles, Shield, ArrowRight, ArrowLeft
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function BookPage() {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState({
        service: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: ''
    })

    const services = [
        { id: '1', name: 'Smile Transformation', price: 'Consultation Required', icon: Sparkles },
        { id: '2', name: 'Teeth Whitening', price: 'Fixed Fee', icon: Sparkles },
        { id: '3', name: 'General Check-up', price: 'Routine Care', icon: Shield },
        { id: '4', name: 'Dental Implants', price: 'Consultation Required', icon: Shield },
        { id: '5', name: 'Emergency Care', price: 'Immediate Access', icon: Sparkles },
    ]

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    async function handleFinalizeBooking() {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to book appointment')
            } else {
                setStep(4)
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pt-24 min-h-screen bg-surface">
            {/* Header */}
            <section className="bg-navy py-12 md:py-16 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <p className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Priority Access</p>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Book Your <span className="text-gold italic font-display font-medium">Excellence</span></h1>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= i ? 'bg-gold text-white shadow-[0_0_15px_rgba(197,164,126,0.3)]' : 'bg-white/10 text-white/30'
                                    }`}>
                                    {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                                </div>
                                {i < 3 && <div className={`w-12 h-0.5 rounded-full ${step > i ? 'bg-gold' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-16">
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
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-navy mb-2">Select Your Treatment</h2>
                                <p className="text-navy/40 text-sm font-medium">Experience personalized care from the first click.</p>
                            </div>

                            <div className="grid gap-4">
                                {services.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setBookingData({ ...bookingData, service: s.name })
                                            nextStep()
                                        }}
                                        className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border border-navy/5 hover:border-gold/40 hover:shadow-float transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all">
                                                <s.icon className="w-5 h-5 text-gold group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-navy group-hover:text-gold transition-colors">{s.name}</h3>
                                                <p className="text-xs text-navy/40 font-semibold uppercase tracking-widest mt-1">{s.price}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-navy/10 group-hover:text-gold group-hover:translate-x-1 transition-all" />
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
                            className="space-y-10"
                        >
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-navy mb-2">Preferred Schedule</h2>
                                <p className="text-navy/40 text-sm font-medium">Select a time that suits your lifestyle.</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="form-label mb-4">Date Selection</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[...Array(12)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setBookingData({ ...bookingData, date: `2026-03-${10 + i}` })}
                                                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${bookingData.date === `2026-03-${10 + i}`
                                                        ? 'bg-gold border-gold text-white shadow-lg'
                                                        : 'bg-white border-navy/5 text-navy/60 hover:border-gold/30 hover:text-gold'
                                                        }`}
                                                >
                                                    {10 + i}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label mb-4">Time Window</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['08:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'].map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setBookingData({ ...bookingData, time: t })}
                                                    className={`py-4 rounded-xl border text-xs font-bold tracking-widest transition-all ${bookingData.time === t
                                                        ? 'bg-navy border-navy text-white shadow-lg'
                                                        : 'bg-white border-navy/5 text-navy/60 hover:border-gold/30 hover:text-gold'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-secondary flex-1 py-5 justify-center"><ArrowLeft className="w-4 h-4" /> Back</button>
                                <button
                                    onClick={nextStep}
                                    className="btn-gold flex-[2] py-5 justify-center"
                                    disabled={!bookingData.date || !bookingData.time}
                                >
                                    Continue to Detail <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Registration */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto space-y-10"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8 text-gold" />
                                </div>
                                <h2 className="text-3xl font-bold text-navy mb-2">Patient Registry</h2>
                                <p className="text-navy/40 text-sm font-medium">Provide your details to confirm the booking.</p>
                            </div>

                            <div className="bg-white rounded-3xl p-10 border border-navy/5 shadow-float space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="form-label">Patient Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Full Name"
                                                value={bookingData.name}
                                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number (Optional)</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="+234 ..."
                                            value={bookingData.phone}
                                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="email@address.com"
                                        value={bookingData.email}
                                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="p-4 bg-navy/5 rounded-2xl flex items-center gap-4 text-navy/60 text-xs font-medium">
                                    <Shield className="w-5 h-5 text-gold" />
                                    This is a secure clinical booking protected by end-to-end encryption.
                                </div>
                                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                                <button
                                    onClick={handleFinalizeBooking}
                                    disabled={loading || !bookingData.name || !bookingData.email}
                                    className="btn-gold w-full py-5 text-base shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Finalize Booking'}
                                </button>
                                <button onClick={prevStep} className="w-full text-navy/30 text-[10px] font-bold uppercase tracking-widest hover:text-navy transition-colors">
                                    Back to Schedule
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse-ring">
                                <CheckCircle className="w-12 h-12 text-gold" />
                            </div>
                            <h2 className="text-4xl font-bold text-navy mb-4 font-display italic">Booking Confirmed</h2>
                            <p className="text-navy/40 text-lg max-w-sm mx-auto mb-12 font-medium">
                                Your sanctuary visit is scheduled. A priority confirmation has been sent to your email.
                            </p>
                            <div className="flex flex-col gap-4 max-w-xs mx-auto">
                                <Link href="/portal/login" className="btn-gold justify-center">Access Patient Portal</Link>
                                <Link href="/" className="btn-secondary justify-center border-navy/10">Return to Home</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    )
}
