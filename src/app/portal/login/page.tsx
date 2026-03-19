'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Phone, ArrowRight, ShieldCheck, Lock, Loader2, Key, Star, CheckCircle2, Eye, EyeOff, Sparkles, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function PortalLoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const cardRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.auth-content', {
                opacity: 0,
                x: -30,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            })
            gsap.from(imageRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 1.5,
                ease: 'power3.out'
            })
        })
        return () => ctx.revert()
    }, [])

    async function handleAuthAction(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const endpoint = isLogin ? '/api/auth/patient/login' : '/api/auth/patient/register'
        const identifier = email || phone
        const payload = isLogin ? { identifier, password } : { name, email, phone, password }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to process request')
            } else {
                router.push('/portal/dashboard')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setError('')
        setEmail('')
        setPhone('')
        setPassword('')
    }

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans selection:bg-lavender/30">
            {/* ═══════════════════════════════════════════════════════════════
                 LEFT PANEL — CINEMATIC IMAGE & IDENTITY
            ═══════════════════════════════════════════════════════════════ */}
            <div ref={imageRef} className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy">
                <Image
                    src="/images/black-woman-hero.png"
                    alt="Premium Dental Clinic"
                    fill
                    className="object-cover opacity-60 mix-blend-luminosity grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-[2s] scale-110 hover:scale-100"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                
                <div className="absolute bottom-20 left-20 right-20 z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-lavender flex items-center justify-center shadow-2xl">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.5em]">A Smile You Love</p>
                    </div>
                    
                    <h2 className="text-6xl xl:text-7xl font-medium text-white font-display leading-[0.9] tracking-tighter mb-8 uppercase">
                        Care That<br />
                        <span className="italic font-light text-lavender">Matters.</span>
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div>
                            <p className="text-white text-3xl font-medium mb-1 font-display tracking-tight">2.5k+</p>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Successful Cases</p>
                        </div>
                        <div>
                            <p className="text-white text-3xl font-medium mb-1 font-display tracking-tight">15+</p>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Global Awards</p>
                        </div>
                    </div>
                </div>

                {/* Ambient Sparkles */}
                <div className="absolute top-20 right-20">
                    <Sparkles className="w-8 h-8 text-lavender/20 animate-pulse" />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 RIGHT PANEL — THE AUTH FORM
            ═══════════════════════════════════════════════════════════════ */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col bg-[#F8FAFF] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-navy/5 rounded-full blur-[80px]" />

                {/* Header Back Button */}
                <div className="p-8 flex items-center justify-between z-10">
                    <Link href="/" className="group flex items-center gap-3 text-navy/40 hover:text-lavender transition-all">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Back to Studio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/20">Portal Secure</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 md:px-24">
                    <div className="w-full max-w-sm">
                        <div className="auth-content space-y-3 mb-12">
                            <h1 className="text-5xl md:text-6xl font-medium text-navy font-display leading-[0.9] tracking-tighter uppercase">
                                {isLogin ? 'Welcome' : 'Join'}<br />
                                <span className="italic font-light text-lavender">{isLogin ? 'Back.' : 'Glow.'}</span>
                            </h1>
                            <p className="text-navy/40 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[280px]">
                                {isLogin ? 'Access your medical history and book new appointments securely.' : 'Experience dental care designed around you.'}
                            </p>
                        </div>

                        <form onSubmit={handleAuthAction} className="auth-content space-y-6">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-navy/30 text-[9px] uppercase tracking-widest font-black ml-4">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20 group-focus-within:text-lavender transition-colors">
                                            <ShieldCheck className="w-full h-full" />
                                        </div>
                                        <input
                                            type="text"
                                            required={!isLogin}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-white border border-navy/5 rounded-[24px] py-5 px-14 text-sm text-navy placeholder:text-navy/20 focus:outline-none focus:ring-4 focus:ring-lavender/10 focus:border-lavender/30 transition-all font-medium shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-navy/30 text-[9px] uppercase tracking-widest font-black ml-4">
                                    {isLogin ? 'Identity (Email or Phone)' : 'Email Address'}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20 group-focus-within:text-lavender transition-colors">
                                        {isLogin ? <Key className="w-full h-full" /> : <Mail className="w-full h-full" />}
                                    </div>
                                    <input
                                        type={isLogin ? "text" : "email"}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={isLogin ? "your@email.com or 080..." : "your@email.com"}
                                        className="w-full bg-white border border-navy/5 rounded-[24px] py-5 px-14 text-sm text-navy placeholder:text-navy/20 focus:outline-none focus:ring-4 focus:ring-lavender/10 focus:border-lavender/30 transition-all font-medium shadow-sm"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-navy/30 text-[9px] uppercase tracking-widest font-black ml-4">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20 group-focus-within:text-lavender transition-colors">
                                            <Phone className="w-full h-full" />
                                        </div>
                                        <input
                                            type="tel"
                                            required={!isLogin}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="08012345678"
                                            className="w-full bg-white border border-navy/5 rounded-[24px] py-5 px-14 text-sm text-navy placeholder:text-navy/20 focus:outline-none focus:ring-4 focus:ring-lavender/10 focus:border-lavender/30 transition-all font-medium shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-navy/30 text-[9px] uppercase tracking-widest font-black ml-4">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20 group-focus-within:text-lavender transition-colors">
                                        <Lock className="w-full h-full" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-navy/5 rounded-[24px] py-5 px-14 text-sm text-navy placeholder:text-navy/20 focus:outline-none focus:ring-4 focus:ring-lavender/10 focus:border-lavender/30 transition-all font-medium shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/20 hover:text-lavender transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-navy text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-lavender transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 group hover:-translate-y-1 active:scale-95 translate-y-0"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Access Portal' : 'Create Profile'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="pt-8 text-center">
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/30 hover:text-lavender transition-colors active:scale-95"
                                >
                                    {isLogin ? "New to Glow? Join Now" : "Returning Member? Sign In"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="p-8 text-center text-navy/10">
                    <p className="text-[8px] font-black uppercase tracking-[0.6em]">Trusted Care in Nigeria</p>
                </div>
            </div>
        </div>
    )
}

