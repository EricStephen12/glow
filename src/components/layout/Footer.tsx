import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-navy text-white">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                                <span className="text-lavender font-bold text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>G</span>
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>Glow Dental</p>
                                <p className="text-[10px] text-lavender tracking-widest uppercase font-bold">Clinic</p>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
                            Nigeria&apos;s premier dental experience — world-class clinical precision delivered with genuine warmth and care.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-lavender hover:border-lavender group"
                                >
                                    <Icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-lavender" />
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/services', label: 'Services' },
                                { href: '/about', label: 'About Us' },
                                { href: '/book', label: 'Book Appointment' },
                                { href: '/portal', label: 'Patient Portal' },
                                { href: '/contact', label: 'Contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/40 hover:text-lavender text-sm transition-colors flex items-center gap-3 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full border border-lavender/30 group-hover:bg-lavender group-hover:border-lavender transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8 relative inline-block">
                            Services
                            <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-lavender" />
                        </h4>
                        <ul className="space-y-4">
                            {[
                                'Digital Smile Design',
                                'Dental Implants',
                                'Orthodontics',
                                'Veneers & Crowns',
                                'Root Canal',
                                'Teeth Whitening',
                                'Emergency Care',
                            ].map((s) => (
                                <li key={s}>
                                    <Link
                                        href="/services"
                                        className="text-white/40 hover:text-lavender text-sm transition-colors flex items-center gap-3 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full border border-lavender/30 group-hover:bg-lavender group-hover:border-lavender transition-all" />
                                        {s}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8 relative inline-block">
                            Contact info
                            <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-lavender" />
                        </h4>
                        <ul className="space-y-6">
                            <li>
                                <a href="tel:08036345839" className="flex items-start gap-4 text-white/40 hover:text-lavender transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-lavender/10 group-hover:border-lavender/30 transition-colors">
                                        <Phone className="w-4 h-4 text-lavender" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Call Us</p>
                                        <p className="text-sm font-medium">{process.env.NEXT_PUBLIC_CLINIC_PHONE || '0803 634 5839'}</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@glowdentalclinic.com" className="flex items-start gap-4 text-white/40 hover:text-lavender transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-lavender/10 group-hover:border-lavender/30 transition-colors">
                                        <Mail className="w-4 h-4 text-lavender" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-sm font-medium">{process.env.NEXT_PUBLIC_CLINIC_EMAIL || 'contact@glowdentalclinic.com'}</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-4 text-white/40 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-lavender" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Flagship Clinic</p>
                                        <p className="text-sm font-medium">{process.env.NEXT_PUBLIC_CLINIC_ADDRESS || 'Kubwa, Abuja, Nigeria'}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-white/20 text-xs tracking-wide">
                        © {currentYear} Glow Dental Clinic. Nigeria&apos;s Premier Dental Experience.
                    </p>
                    <div className="flex items-center gap-8">
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <Link key={item} href="#" className="text-white/20 hover:text-lavender text-xs transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
