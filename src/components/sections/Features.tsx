'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { ShieldCheck, HeartPulse, Clock, Users, Sparkles, Smile, Award, Zap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const FEATURES = [
    {
        title: 'Specialist Care',
        description: 'Fellowship-trained surgeons delivering international standards.',
        icon: Award
    },
    {
        title: 'Anxiety-Free',
        description: 'Gentle techniques and advanced sedation for your comfort.',
        icon: Sparkles
    },
    {
        title: 'Complete Family',
        description: 'Comprehensive dental care for every generation.',
        icon: HeartPulse
    },
    {
        title: 'Emergency Response',
        description: 'Immediate mobile response for urgent clinical needs.',
        icon: Zap
    }
]

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Elegant text reveal
            gsap.from('.feature-text', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.feature-content',
                    start: 'top 80%',
                }
            })

            // Staggered cards popping up
            gsap.from('.feature-card', {
                y: 80,
                scale: 0.9,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: '.feature-grid',
                    start: 'top 85%'
                }
            })

            // Massive parallax effect on the main image
            gsap.fromTo('.feature-parallax-img',
                { yPercent: -15, scale: 1.1 },
                {
                    yPercent: 15,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.feature-image-container',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5 // Smooth scrubbing
                    }
                }
            )

            // Trust badge floats in
            gsap.from('.trust-badge', {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.feature-image-container',
                    start: 'top 60%'
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="py-24 md:py-40 bg-surface relative overflow-hidden border-t border-navy/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    <div className="feature-content">
                        <p className="feature-text text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-6">Uncompromising Global Quality</p>
                        <h2 className="feature-text text-4xl md:text-5xl lg:text-7xl font-medium text-navy leading-[1.05] tracking-tighter mb-10 font-display uppercase">
                            Why 10,000+ Nigerians<br />
                            <span className="italic font-light text-lavender">Choose Glow.</span>
                        </h2>
                        <p className="feature-text text-navy/40 text-sm md:text-lg leading-relaxed mb-16 max-w-md font-medium">
                            We deliver world-class dental care in Nigeria. Equipped with international medical technology and uncompromising sterilization protocols.
                        </p>

                        <div className="feature-grid grid sm:grid-cols-2 gap-6">
                            {FEATURES.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="feature-card p-8 bg-white rounded-[32px] border border-navy/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(130,119,224,0.08)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-lavender/10 flex items-center justify-center mb-6 group-hover:bg-lavender group-hover:-rotate-6 transition-all duration-500">
                                        <feature.icon className="w-5 h-5 text-lavender group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-sm font-bold text-navy mb-3 uppercase tracking-wider">{feature.title}</h3>
                                    <p className="text-navy/50 text-[11px] leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="feature-image-container relative mt-12 lg:mt-0">
                        {/* Parallax Container */}
                        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl">
                            <Image
                                src="/images/hero-patient-black.png"
                                alt="Patient receiving premium dental care at Glow"
                                fill
                                className="feature-parallax-img object-cover scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-80" />
                            
                            {/* Inner vignette frame */}
                            <div className="absolute inset-0 border border-white/20 rounded-[48px] m-4 pointer-events-none" />
                        </div>
                        
                        {/* Trust Badge */}
                        <div className="trust-badge absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-navy/5 max-w-[240px] z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-lavender/10 flex items-center justify-center">
                                    <Smile className="w-4 h-4 text-lavender" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-navy">Trusted Nationwide</span>
                            </div>
                            <p className="text-navy/40 text-[10px] font-bold leading-[1.6] uppercase tracking-wider">
                                Elite clinical standards for thousands of satisfied patients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
