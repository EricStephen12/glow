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

        // Parallax for editorial background names
        const bgTexts = gsap.utils.toArray('.editorial-bg-text')
        bgTexts.forEach((text: any) => {
            gsap.to(text, {
                yPercent: -45, // Scroll slower/opposite for depth
                opacity: 0,    // Fade out as it scrolls out of view
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

    return (
        <div ref={mainRef} className="relative overflow-x-hidden bg-transparent text-navy selection:bg-lavender/20">
            {/* Editorial Background Parallax Watermarks */}
            <div className="absolute top-[28vh] left-0 w-full overflow-hidden pointer-events-none z-0 select-none">
                <span className="editorial-bg-text text-[26vw] font-display font-black text-lavender/[0.07] uppercase tracking-[0.1em] block text-center leading-none">
                    GLOW
                </span>
            </div>

            <div className="absolute top-[170vh] left-0 w-full overflow-hidden pointer-events-none z-0 select-none">
                <span className="editorial-bg-text text-[20vw] font-display font-light italic text-lavender/[0.08] uppercase tracking-[0.05em] block text-center leading-none">
                    Artistry
                </span>
            </div>

            <div className="absolute top-[310vh] left-0 w-full overflow-hidden pointer-events-none z-0 select-none">
                <span className="editorial-bg-text text-[22vw] font-display font-black text-lavender/[0.07] uppercase tracking-[0.08em] block text-center leading-none">
                    SMILES
                </span>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-[100vh] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] bg-lavender/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
            <div className="absolute top-[220vh] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] bg-navy/[0.04] rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />
            <div className="absolute top-[340vh] left-[10%] w-[55vw] h-[55vw] max-w-[700px] bg-lavender/[0.08] rounded-full mix-blend-multiply filter blur-[130px] pointer-events-none" />

            {/* ═══════════════════════════════════════════════════════════════
                 HERO — 3D Advanced (Mira Style)
            ═══════════════════════════════════════════════════════════════ */}
            <Hero3D />


            {/* ═══════════════════════════════════════════════════════════════
                 CLINICAL RESULTS — The Core Value
            ═══════════════════════════════════════════════════════════════ */}
            <BeforeAfter />


            {/* ═══════════════════════════════════════════════════════════════
                 OUR SPECIALISTS — The Human Factor
            ═══════════════════════════════════════════════════════════════ */}
            <Team />


            {/* ═══════════════════════════════════════════════════════════════
                 PATIENT STORIES — Social Proof
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-transparent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-navy/40 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Patient Stories</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-navy font-display leading-[1.1] uppercase tracking-tighter">
                            What Our <span className="text-lavender italic">Patients Say.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                text: "I hadn't seen a dentist in six years because of anxiety. Dr. Adeyemi and her team made me feel completely safe and comfortable. The treatment was entirely painless.",
                                author: 'Chioma Eze',
                                role: 'Verified Patient',
                            },
                            {
                                text: "The 3D preview of my new smile was incredible. Seeing the exact design before we even started gave me complete confidence. The results are perfect.",
                                author: 'Emeka Obi',
                                role: 'Verified Patient',
                            },
                            {
                                text: "Finding a clinic that knows how to make kids feel comfortable is rare. My daughter actually looks forward to her visits. The care here is exceptional.",
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
            <section className="py-24 md:py-32 bg-transparent relative overflow-hidden">
                {/* 3D-like background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/[0.02] skew-x-12 translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="md:flex items-center justify-between gap-12">
                        <div className="max-w-2xl mb-12 md:mb-0">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-navy mb-8 font-display leading-[1] uppercase tracking-tighter">
                                Start Your<br /><span className="text-lavender italic">Journey.</span>
                            </h2>
                            <p className="text-navy/50 text-base md:text-xl leading-relaxed font-medium max-w-lg border-l-2 border-navy/10 pl-8">
                                Book a session with one of our doctors to discuss your goals. We will build a simple, clear plan that fits your life.
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
