'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Calendar, Phone, ShieldCheck } from 'lucide-react'

const NAV_LINKS = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial check
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => setIsOpen(false), [pathname])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                ? 'py-4 bg-white border-b border-navy/10 shadow-lg'
                : 'py-6 bg-white/80 backdrop-blur-md border-b border-white/20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                        <span className="font-bold text-xl text-white">G</span>
                    </div>
                    <div className="block">
                        <p className="font-bold text-lg leading-none text-navy uppercase tracking-tighter">Glow Dental</p>
                        <p className="text-[8px] tracking-[0.3em] uppercase font-bold text-lavender mt-0.5">Trust. Care. Results.</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                                pathname === link.href ? 'text-lavender' : 'text-navy hover:text-lavender'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/portal/login"
                        className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full border border-navy text-navy hover:bg-navy hover:text-white transition-all"
                    >
                        Portal
                    </Link>
                    <Link
                        href="/book"
                        className="bg-lavender text-white py-2.5 px-6 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 hover:bg-navy transition-all"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Now</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-navy"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Simple Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-navy/5 shadow-xl md:hidden py-8 px-6 flex flex-col gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-lg font-medium ${
                                pathname === link.href ? 'text-lavender' : 'text-navy'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/portal/login" className="text-sm font-bold text-navy uppercase tracking-widest pt-4 border-t border-navy/5">
                        Portal Login
                    </Link>
                    <Link href="/book" className="bg-lavender text-white py-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest">
                        Book Appointment
                    </Link>
                </div>
            )}
        </header>
    )
}
