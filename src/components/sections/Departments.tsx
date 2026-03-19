'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Heart, Award } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const DEPARTMENTS = [
    {
        title: 'Cosmetic',
        description: 'Bespoke smile design and artistic restoration.',
        image: '/images/smile-portrait.png',
        icon: Sparkles,
        link: '/services/cosmetic'
    },
    {
        title: 'Implants',
        description: 'State-of-the-art titanium and ceramic solutions.',
        image: '/images/service-implant.png',
        icon: Shield,
        link: '/services/implants'
    },
    {
        title: 'Orthodontics',
        description: 'Modern alignment for a perfectly balanced profile.',
        image: '/images/dental-products.png',
        icon: Award,
        link: '/services/orthodontics'
    },
    {
        title: 'Wellness',
        description: 'Comprehensive prevention in a serene environment.',
        image: '/images/treatment-room.png',
        icon: Heart,
        link: '/services/general'
    }
]

export default function Departments() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Header text staggered reveal
            gsap.from('.dept-header', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.dept-content',
                    start: 'top 80%',
                }
            })

            // Stunning staggered card drop-in
            gsap.from('.dept-card', {
                y: 100,
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.dept-grid',
                    start: 'top 75%'
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden border-t border-navy/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="dept-content flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-xl">
                        <p className="dept-header text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Comprehensive Global Care</p>
                        <h2 className="dept-header text-4xl md:text-5xl lg:text-6xl font-medium text-navy leading-[1.05] tracking-tighter uppercase font-display">
                            Clinical Precision.<br />
                            <span className="italic font-light text-lavender">Specialized Expertise.</span>
                        </h2>
                    </div>
                    <p className="dept-header text-navy/40 text-sm md:text-base max-w-xs leading-relaxed font-medium">
                        Experience international medical standards across all our specialized clinical departments.
                    </p>
                </div>

                <div className="dept-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {DEPARTMENTS.map((dept) => (
                        <div
                            key={dept.title}
                            className="dept-card group relative cursor-pointer"
                        >
                            <Link href={dept.link} className="block">
                                <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden mb-8 shadow-xl shadow-navy/5 transition-transform duration-700 group-hover:scale-[1.03]">
                                    <Image
                                        src={dept.image}
                                        alt={dept.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1s] group-hover:scale-110 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-700" />

                                    <div className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:bg-lavender/80 group-hover:-rotate-6 group-hover:border-transparent">
                                        <dept.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-navy mb-3 flex items-center gap-3 uppercase tracking-wide">
                                    {dept.title}
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-lavender" />
                                </h3>
                                <p className="text-navy/50 text-[11px] leading-relaxed font-medium pr-4">
                                    {dept.description}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
