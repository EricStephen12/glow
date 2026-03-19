'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import {
    ArrowRight, Calendar, Star, Shield, Clock,
    Award, Sparkles, Heart, ChevronRight, Phone,
    Sparkle, Users, Zap, CheckCircle
} from 'lucide-react'
import Team from '@/components/sections/Team'
import BeforeAfter from '@/components/sections/BeforeAfter'
import Hero3D from '@/components/sections/Hero3D'
import ToothJourney from '@/components/sections/ToothJourney'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: i * 0.1 },
    }),
}

export default function HomePage() {
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const sections = gsap.utils.toArray('section')
        sections.forEach((section: any) => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            })
        })
    }, [])

    return (
        <div ref={mainRef} className="overflow-x-hidden bg-white text-navy selection:bg-lavender/20">
            {/* ═══════════════════════════════════════════════════════════════
                 HERO — 3D Advanced (Mira Style)
            ═══════════════════════════════════════════════════════════════ */}
            <Hero3D />


            {/* ═══════════════════════════════════════════════════════════════
                 CLINICAL RESULTS — The Core Value
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-white border-t border-navy/5">
                <BeforeAfter />
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                 OUR SPECIALISTS — The Human Factor
            ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white">
                <Team />
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                 PATIENT STORIES — Social Proof
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-surface">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-navy/40 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Voices of Glow</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-navy font-display leading-[1.1] uppercase tracking-tighter">
                            Patient <span className="text-lavender italic">Perspective.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                text: "I'd been avoiding dentists for six years. Dr. Adeyemi made me feel so calm that I forgot I was even in a clinic. Zero pain, total comfort.",
                                author: 'Chioma Eze',
                                role: 'Verified Patient',
                            },
                            {
                                text: "Flew in from Port Harcourt specifically for my veneers. The Digital Smile Design preview sold me — seeing my new smile before they even started? Next level.",
                                author: 'Emeka Obi',
                                role: 'Verified Patient',
                            },
                            {
                                text: "My daughter now asks when her next 'tooth adventure' is. That kind of care you can't fake. Best pediatric team in Nigeria.",
                                author: 'Hauwa Ibrahim',
                                role: 'Verified Patient',
                            },
                        ].map((review, i) => (
                            <div
                                key={review.author}
                                className="bg-white p-12 rounded-[50px] border border-navy/5 relative group hover:shadow-3xl hover:shadow-navy/5 transition-all duration-700"
                            >
                                <div className="flex text-navy/10 mb-8 gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                </div>
                                <p className="text-navy/70 leading-relaxed mb-10 text-[16px] italic font-medium">
                                    &ldquo;{review.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-5 pt-8 border-t border-navy/5">
                                    <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center font-bold text-navy/40 text-sm">
                                        {review.author[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-navy tracking-tight text-base">{review.author}</p>
                                        <p className="text-[10px] text-navy/20 uppercase tracking-[0.4em] font-bold">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                 FINAL CTA — Conversion Focused
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-white relative overflow-hidden">
                {/* 3D-like background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-surface skew-x-12 translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="md:flex items-center justify-between gap-12">
                        <div className="max-w-2xl mb-12 md:mb-0">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-navy mb-8 font-display leading-[1] uppercase tracking-tighter">
                                Start Your<br /><span className="text-lavender italic">Transformation.</span>
                            </h2>
                            <p className="text-navy/50 text-base md:text-xl leading-relaxed font-medium max-w-lg border-l-2 border-navy/10 pl-8">
                                Join those who choose the best for their smile. Experience dental care that puts you first.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6 items-center md:items-start">
                            <Link href="/book" className="group bg-navy text-white px-16 py-7 rounded-full text-[12px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-navy/20 flex items-center gap-4">
                                <Calendar className="w-5 h-5 mr-3" /> Reserve Consultation
                            </Link>
                            <p className="text-navy/20 text-[10px] uppercase tracking-[0.5em] font-bold">Nigeria&apos;s Trusted Dental Practice</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
