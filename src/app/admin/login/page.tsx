'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, ArrowRight, AlertCircle, Shield, Key } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                setError(data.error || 'Identity verification failed')
            }
        } catch (err) {
            setError('System communication error. Please retry.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-6 selection:bg-lavender/30 font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[150px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-lavender/10 rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <Shield className="w-8 h-8 text-lavender" />
                        </div>
                    </Link>
                    <h1 className="text-4xl font-medium text-white font-display mb-3">Clinical <span className="text-lavender italic font-display">Gateway</span></h1>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Authorized Access Required • Glow Dental Administration</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[56px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/5 rounded-bl-full translate-x-8 -translate-y-8" />

                    <form onSubmit={handleLogin} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            <div>
                                <label className="text-lavender/60 text-[10px] ml-5 uppercase tracking-widest font-bold">Authorized Identity</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-lavender transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-lavender/20 focus:border-lavender/30 transition-all text-sm font-medium"
                                        placeholder="clinician@glowdental.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-lavender/60 text-[10px] ml-5 uppercase tracking-widest font-bold">Security Credentials</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-lavender transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-lavender/20 focus:border-lavender/30 transition-all text-sm font-medium"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 flex items-center justify-center gap-3 bg-white text-navy rounded-full text-[10px] shadow-2xl disabled:opacity-50 group uppercase tracking-[0.3em] font-bold hover:bg-lavender hover:text-white transition-all duration-500"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                            ) : (
                                <>
                                    Authorize Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-12 space-y-4">
                    <p className="text-[9px] text-white/10 font-bold uppercase tracking-[0.5em]">
                        System Encryption: AES-256-GCM Active
                    </p>
                    <p className="text-[10px] text-white/30 font-medium">
                        Unauthorized access is strictly prohibited. <button className="text-lavender font-bold hover:underline">Support</button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
