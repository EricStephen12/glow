'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        email: '',
        phone: ''
    })

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/patient/me')
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                    setFormData({
                        email: data.email || '',
                        phone: data.phone || ''
                    })
                }
            } catch (e) {
                console.error('Failed to fetch user', e)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const res = await fetch('/api/patient/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to update profile')

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            setUser({ ...user, ...formData })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
    )

    return (
        <div className="space-y-16 pb-24 selection:bg-lavender/20">
            {/* Minimalist Profile Header */}
            <header className="flex flex-col gap-4">
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] text-lavender font-bold uppercase tracking-[0.4em]"
                >
                    Account Registry
                </motion.p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-navy font-display leading-tight tracking-tight uppercase">
                        Profile <span className="text-lavender italic font-display font-medium lowercase">Settings</span>
                    </h1>
                    <div className="px-5 py-2.5 rounded-full border border-navy/5 bg-white/50 backdrop-blur-md text-[9px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-lavender" /> Identity Verified
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Profile Visual Card */}
                <div className="lg:col-span-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-navy rounded-[40px] p-10 text-white text-center relative overflow-hidden shadow-2xl shadow-navy/20 h-[400px] flex flex-col justify-center"
                    >
                        <div className="relative z-10">
                            <div className="w-32 h-32 rounded-[32px] border border-white/10 p-2 mx-auto mb-8 relative">
                                <div className="w-full h-full rounded-[24px] bg-white/5 flex items-center justify-center text-4xl font-bold text-white font-display border border-white/10 shadow-2xl">
                                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '...'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-lavender flex items-center justify-center border-4 border-navy shadow-lg">
                                    <CheckCircle2 className="w-5 h-5 text-navy" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold font-display text-white mb-2">{user?.name}</h2>
                            <p className="text-[10px] text-lavender font-bold uppercase tracking-[0.3em] opacity-60">
                                Patient Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                            </p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(168,143,245,0.1),transparent_70%)]" />
                    </motion.div>
                </div>

                {/* Refined Form Area */}
                <div className="lg:col-span-8 space-y-10">
                    <form onSubmit={handleSave} className="bg-white rounded-[40px] p-10 border border-navy/5 shadow-sm space-y-10">
                        <div className="grid gap-10">
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-bold text-navy/30 uppercase tracking-[0.4em] border-l-2 border-lavender pl-6">Contact Information</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20 ml-1">Legal Full Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full bg-navy/5 border-none rounded-2xl px-6 py-4 text-sm font-medium text-navy/40 cursor-not-allowed italic"
                                            value={user?.name || ''}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20 ml-1">Phone Connectivity</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender" />
                                            <input
                                                type="tel"
                                                className="w-full bg-surface border border-navy/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-lavender/20 focus:border-lavender/30 transition-all font-sans"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20 ml-1">Primary Email Access</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender" />
                                            <input
                                                type="email"
                                                className="w-full bg-surface border border-navy/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-lavender/20 focus:border-lavender/30 transition-all font-sans"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 rounded-[24px] flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-lavender/10 text-lavender border border-lavender/20' : 'bg-red-50 text-red-500 border border-red-100'}`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                {message.text}
                            </motion.div>
                        )}

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-12 py-5 rounded-2xl bg-navy text-white font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 hover:bg-lavender transition-all flex items-center gap-4 disabled:opacity-50"
                            >
                                {saving ? 'Syncing...' : <><Save className="w-4 h-4" /> Save Profile</>}
                            </button>
                        </div>
                    </form>

                    <div className="bg-white rounded-[40px] p-8 border border-navy/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-navy flex items-center justify-center text-lavender shadow-lg">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-navy uppercase tracking-widest leading-none mb-1">Cyber Security</h4>
                                <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">End-to-end encryption active</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-lavender border border-lavender/20 px-8 py-4 rounded-xl hover:bg-lavender hover:text-white transition-all">Manage Keys</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
