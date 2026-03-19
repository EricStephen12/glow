'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LogOut, LayoutDashboard, Calendar, History, CreditCard, User, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import ToothJourney from '@/components/sections/ToothJourney'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [fetching, setFetching] = useState(true)

    const isLoginPage = pathname === '/portal/login'

    useEffect(() => {
        if (isLoginPage) {
            setFetching(false)
            return
        }

        async function fetchUser() {
            try {
                const res = await fetch('/api/patient/me')
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                }
            } catch (e) {
                console.error('Failed to fetch user', e)
            } finally {
                setFetching(false)
            }
        }
        fetchUser()
    }, [isLoginPage])

    const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '...'

    // If it's the login page, just render the children without layout
    if (isLoginPage) {
        return <div className="min-h-screen bg-[#F8FAFF]">{children}</div>
    }

    // While fetching on non-login pages, show a clean loader
    if (fetching) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-lavender/10 border-t-lavender rounded-full animate-spin" />
            </div>
        )
    }

    // Only show layout if user is authenticated
    return (
        <div className="min-h-screen bg-[#F8FAFF] font-sans selection:bg-lavender/20 flex">
            {/* ═══════════════════════════════════════════════════════════════
                SIDEBAR (Desktop)
                ═══════════════════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex flex-col w-[280px] bg-[#050510] fixed h-screen z-[60] border-r border-white/5">
                {/* Brand Header */}
                <div className="p-8 pb-12">
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all duration-500">
                            <ShieldCheck className="w-5 h-5 text-navy" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-[10px] font-display uppercase tracking-[0.3em]">Glow <span className="text-lavender italic">Portal</span></p>
                            <p className="text-[7px] text-white/30 font-bold uppercase tracking-[0.4em] mt-0.5">Trust. Care. Results.</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 px-4 space-y-8">
                    <div>
                        <p className="px-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Patient Center</p>
                        <div className="space-y-1">
                            {[
                                { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/portal/dashboard' },
                                { id: 'appointments', label: 'Book Appointment', icon: Calendar, href: '/book' },
                                { id: 'history', label: 'Medical Records', icon: History, href: '/portal/dashboard' },
                            ].map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest group ${isActive
                                            ? 'bg-lavender text-navy shadow-lg shadow-lavender/10'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-navy' : 'text-white/10 group-hover:text-lavender'}`} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="px-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Account</p>
                        <div className="space-y-1">
                            {[
                                { id: 'billing', label: 'Billing & Quotes', icon: CreditCard, href: '/portal/dashboard' },
                                { id: 'profile', label: 'Profile Settings', icon: User, href: '/portal/profile' },
                            ].map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest group ${isActive
                                            ? 'bg-lavender text-navy shadow-lg'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-navy' : 'text-white/10 group-hover:text-lavender'}`} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </nav>

                {/* Bottom User Profile */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-lavender/20 text-lavender flex items-center justify-center text-[10px] font-bold">
                                {initials}
                            </div>
                            <div className="overflow-hidden max-w-[120px]">
                                <p className="text-[10px] font-bold text-white truncate">{user?.name || 'Patient'}</p>
                                <p className="text-[7px] text-white/30 truncate">Verified Account</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                document.cookie = 'patient_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                                window.location.href = '/portal/login'
                            }}
                            className="p-2 text-white/20 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════
                MAIN CONTENT AREA
                ═══════════════════════════════════════════════════════════════ */}
            <main className="flex-1 lg:ml-[280px] min-h-screen relative">
                {/* Top Desktop Bar (Mobile Toggle + Page Info) */}
                <div className="sticky top-0 z-40 bg-[#F8FAFF]/80 backdrop-blur-xl h-20 flex items-center justify-between px-8 lg:px-12 border-b border-navy/5">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xs font-bold text-navy uppercase tracking-[0.3em]">
                            {pathname.split('/').pop()?.replace('-', ' ')}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-navy/5 text-[9px] font-bold text-navy/40 uppercase tracking-widest hover:bg-navy hover:text-white transition-all">
                            <Sparkles className="w-3 h-3 text-lavender" /> Support
                        </button>
                    </div>
                </div>

                <div className="p-8 lg:p-12 pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>

                {/* Mobile Navigation (Floating Bottom) */}
                <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-navy/95 backdrop-blur-xl rounded-2xl px-6 flex justify-between items-center z-[70] shadow-2xl border border-white/10">
                    {[
                        { icon: LayoutDashboard, href: '/portal/dashboard' },
                        { icon: Calendar, href: '/book' },
                        { icon: CreditCard, href: '/portal/dashboard' },
                        { icon: User, href: '/portal/profile' },
                    ].map((item, i) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-lavender text-navy scale-110 shadow-lg' : 'text-white/30'
                                    }`}
                            >
                                <item.icon className="w-4.5 h-4.5" />
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

