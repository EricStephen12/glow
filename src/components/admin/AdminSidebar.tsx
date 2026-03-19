'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard, Calendar, Users, FileText, Receipt,
    BarChart3, Settings, LogOut, ChevronRight, ShieldCheck, Sparkles
} from 'lucide-react'

const NAV = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/schedule', icon: Calendar, label: 'Clinical Schedule' },
    { href: '/admin/patients', icon: Users, label: 'Patient Registry' },
    { href: '/admin/billing', icon: Receipt, label: 'Account Statement' },
    { href: '/admin/services', icon: Sparkles, label: 'Service Catalog' },
    { href: '/admin/reports', icon: BarChart3, label: 'Performance' },
]

export default function AdminSidebar() {
    const path = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/admin/login')
            router.refresh()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-navy flex flex-col z-40 border-r border-white/5 shadow-2xl">
            {/* Logo — Professional & Luxury */}
            <div className="p-8 border-b border-white/5">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                        <Sparkles className="w-6 h-6 text-lavender" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base leading-none tracking-tight font-display">Glow Dental</p>
                        <p className="text-[10px] text-lavender tracking-[0.3em] uppercase font-bold mt-1">Admin Portal</p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-white/20 font-bold tracking-[0.4em] uppercase mb-6 px-4">Clinical Management</p>
                {NAV.map(({ href, icon: Icon, label }) => {
                    const isActive = path === href || (href !== '/admin' && path.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all group relative overflow-hidden ${isActive
                                ? 'bg-lavender text-white shadow-lg shadow-lavender/10'
                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-lavender group-hover:text-lavender'}`} />
                            <span className="flex-1">{label}</span>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-40" />}
                            {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-white/20" />}
                        </Link>
                    )
                })}

                <div className="pt-8 border-t border-white/5 mt-8">
                    <p className="text-[10px] text-white/20 font-bold tracking-[0.4em] uppercase mb-6 px-4">Administration</p>
                    <Link href="/admin/settings" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-white/40 hover:bg-white/5 hover:text-white group transition-all">
                        <Settings className="w-5 h-5 text-lavender/40 group-hover:text-lavender transition-colors" />
                        <span>Clinic Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 group transition-all w-full text-left"
                    >
                        <LogOut className="w-5 h-5 text-red-400/50 group-hover:text-red-400 transition-colors" />
                        <span>Authorize Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        DR
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">Clinical Staff</p>
                        <p className="text-lavender text-[10px] font-bold uppercase tracking-widest mt-0.5">Verified Admin</p>
                    </div>
                    <Settings className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                </div>
            </div>
        </aside>
    )
}
