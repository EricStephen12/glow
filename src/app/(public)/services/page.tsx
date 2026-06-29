'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Shield, Zap, Heart, ArrowRight, ChevronRight, Star } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function ServicesPage() {
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const bgTexts = gsap.utils.toArray('.editorial-bg-text')
        bgTexts.forEach((text: any) => {
            gsap.to(text, {
                yPercent: -45,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: text,
                    start: 'top 70%',
                    end: 'bottom 10%',
                    scrub: 1.2
                }
            })
        })
    }, [])
    const treatments = [
        {
            category: 'Preventive Care',
            items: [
                { title: 'Scaling & Polishing', desc: 'Professional cleaning to remove plaque and tartar for healthy gums.', price: 'Routine' },
                { title: 'Dental Check-up', desc: 'Thorough examination and oral health education to prevent future issues.', price: 'Prevention' },
                { title: 'Pediatric Care', desc: 'Gentle and specialized dental services for children of all ages.', price: 'Family' }
            ]
        },
        {
            category: 'Cosmetic & Orthodontics',
            items: [
                { title: 'Teeth Whitening', desc: 'Professional whitening systems to safely brighten your natural smile.', price: 'Aesthetic' },
                { title: 'Veneers & Bonding', desc: 'Custom restorations to fix gaps, chips, or tooth discoloration.', price: 'Smile Design' },
                { title: 'Braces & Aligners', desc: 'Expert teeth straightening solutions for perfect alignment.', price: 'Orthodontic' }
            ]
        },
        {
            category: 'Restorative & Emergency',
            items: [
                { title: 'Fillings & Crowns', desc: 'Durable restorations to repair cavities and protect weak teeth.', price: 'Restorative' },
                { title: 'Dental Bridges', desc: 'Permanent bridges to replace missing teeth and restore function.', price: 'Permanent' },
                { title: 'Emergency Service', desc: 'Fast and reliable treatment for pain, accidents, or sudden issues.', price: '24/7 Priority' }
            ]
        }
    ]

    return (
        <div ref={mainRef} className="relative pt-24 bg-transparent selection:bg-lavender/20">
            {/* Editorial Background Parallax Watermarks */}
            <div className="absolute top-[75vh] left-0 w-full overflow-hidden pointer-events-none z-0 select-none">
                <span className="editorial-bg-text text-[22vw] font-display font-black text-lavender/[0.07] uppercase tracking-[0.1em] block text-center leading-none">
                    CLINICAL
                </span>
            </div>

            <div className="absolute top-[160vh] left-0 w-full overflow-hidden pointer-events-none z-0 select-none">
                <span className="editorial-bg-text text-[18vw] font-display font-light italic text-lavender/[0.08] uppercase tracking-[0.05em] block text-center leading-none">
                    Technology
                </span>
            </div>

            {/* Hero */}
            <section className="bg-navy py-24 md:py-32 relative overflow-hidden text-center">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <p className="text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-6">Our Services</p>
                    <h1 className="text-5xl md:text-7xl font-medium text-white mb-8 font-display italic">
                        Our <span className="text-lavender">Treatments</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                        From routine cleanings to complex surgical restorations, we focus on patient comfort and long-term health.
                    </p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-lavender/5 rounded-full blur-[100px]" />
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
            </section>

            {/* Featured Services */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {treatments.map((cat, idx) => (
                        <div key={cat.category} className="mb-24 last:mb-0">
                            <div className="flex items-center gap-6 mb-16">
                                <h2 className="text-3xl font-medium text-navy font-display whitespace-nowrap">{cat.category}</h2>
                                <div className="h-px bg-navy/5 flex-1" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {cat.items.map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-10 group hover:border-lavender/30 transition-all flex flex-col justify-between rounded-[48px] border border-navy/5 shadow-sm hover:shadow-xl hover:shadow-lavender/5"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="w-14 h-14 rounded-2xl bg-lavender/10 flex items-center justify-center group-hover:bg-lavender transition-colors">
                                                    <Sparkles className="w-6 h-6 text-lavender group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-bold text-lavender uppercase tracking-widest">{item.price}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-navy mb-4 font-display group-hover:text-lavender transition-colors">{item.title}</h3>
                                            <p className="text-navy/40 text-sm leading-relaxed font-medium mb-10">{item.desc}</p>
                                        </div>
                                        <Link href="/book" className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] flex items-center gap-2 group/link">
                                            Request Consultation <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* High-end Tech Highlight */}
            <section className="py-24 bg-transparent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-navy rounded-[60px] p-10 md:p-24 text-white relative overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                            <div>
                                <p className="text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-8">Modern Technology</p>
                                <h2 className="text-4xl md:text-6xl font-medium mb-10 font-display italic leading-tight">Advanced <span className="text-lavender">Diagnostic</span> Suite</h2>
                                <div className="space-y-8">
                                    {[
                                        { title: 'Digital 3D Scanning', desc: 'No messy impressions. We capture highly accurate digital scans in seconds.' },
                                        { title: 'Laser Treatments', desc: 'Faster healing times and less discomfort for gum treatments.' },
                                        { title: 'Enhanced Imaging', desc: 'High-resolution diagnostics to spot potential issues early.' },
                                    ].map((tech) => (
                                        <div key={tech.title} className="flex gap-6 group">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-lavender transition-colors flex-shrink-0">
                                                <Zap className="w-5 h-5 text-lavender group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-1 font-display">{tech.title}</h4>
                                                <p className="text-white/40 text-sm font-medium">{tech.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative aspect-square">
                                <Image src="/images/treatment-room.png" alt="Clinical Technology" fill className="object-cover rounded-[40px] opacity-40 filter grayscale" />
                                <div className="absolute inset-0 border-[20px] border-lavender/10 rounded-[40px] -translate-x-6 translate-y-6" />
                            </div>
                        </div>
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-lavender/5 rounded-full blur-[120px]" />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 md:py-32 text-center pb-40">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-medium text-navy mb-8 font-display">Talk to a <span className="text-lavender italic">Dentist</span></h2>
                    <p className="text-navy/40 text-lg mb-12 font-medium">Ready to schedule a visit? Book a time to meet with our clinical team.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/book" className="btn-pill-lavender px-12 py-5 text-sm">Book Appointment</Link>
                        <Link href="/portal/login" className="px-12 py-5 text-sm border border-navy/10 rounded-full font-bold uppercase tracking-widest text-navy hover:bg-navy/5 transition-all">Client Portal</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
