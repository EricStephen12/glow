'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Linkedin, Mail, Award, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const TEAM = [
    {
        name: 'Dr. Sarah Adeyemi',
        role: 'Clinical Director',
        specialty: 'Smile Design',
        image: '/images/black-woman-hero.png',
        bio: '12+ years in aesthetic dentistry. Fellow of the ICOI. Expert in international Digital Smile Design protocols.'
    },
    {
        name: 'Dr. Marcus Okafor',
        role: 'Lead Oral Surgeon',
        specialty: 'Implantology',
        image: '/images/hero-clinic.png',
        bio: 'Specialist in guided implant surgery with 2,000+ successful cases. Internationally trained surgical expert.'
    }
]

export default function Team() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Header text staggered reveal
            gsap.from('.team-header', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.team-content',
                    start: 'top 80%',
                }
            })

            // Image stunning clip-path curtain reveal
            const cards = gsap.utils.toArray('.team-card')
            cards.forEach((card: any, i) => {
                const imgContainer = card.querySelector('.team-img-wrapper')
                const textElements = card.querySelectorAll('.team-text')

                gsap.fromTo(imgContainer,
                    { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        duration: 1.5,
                        ease: 'power4.inOut',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                        },
                        delay: i * 0.1
                    }
                )

                // Staggered text drop-in for each member
                gsap.from(textElements, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 75%'
                    },
                    delay: 0.5 + (i * 0.1) // Wait for image to partially reveal
                })
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-surface border-y border-navy/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="team-content flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-xl">
                        <p className="team-header text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Meet Our Doctors</p>
                        <h2 className="team-header text-4xl md:text-5xl lg:text-6xl font-medium text-navy leading-[1.05] tracking-tighter uppercase font-display">
                            Expert Doctors.<br />
                            <span className="italic font-light text-lavender">Personal Care.</span>
                        </h2>
                    </div>
                    <p className="team-header text-lavender/60 text-sm md:text-base max-w-xs leading-relaxed font-medium">
                        We bring top-tier training to every patient we see.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {TEAM.map((member) => (
                        <div
                            key={member.name}
                            className="team-card flex flex-col sm:flex-row gap-8 items-start group"
                        >
                            <div className="team-img-wrapper relative w-full sm:w-56 h-72 sm:h-64 rounded-[40px] overflow-hidden shadow-2xl flex-shrink-0">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-80" />
                            </div>

                            <div className="flex-1 pt-4">
                                <div className="team-text inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 border border-navy/5 shadow-sm group-hover:border-lavender/30 transition-colors">
                                    <Award className="w-4 h-4 text-lavender" />
                                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">{member.specialty}</span>
                                </div>
                                
                                <h3 className="team-text text-3xl font-medium text-navy mb-2 tracking-tight font-display">{member.name}</h3>
                                <p className="team-text text-lavender text-[11px] font-bold uppercase tracking-[0.2em] mb-6">{member.role}</p>
                                
                                <p className="team-text text-navy/50 text-xs leading-relaxed font-medium mb-8">
                                    {member.bio}
                                </p>
                                
                                <div className="team-text flex items-center gap-4 border-t border-navy/5 pt-6">
                                    <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-navy/5 flex items-center justify-center text-navy/40 hover:bg-lavender hover:text-white hover:border-lavender transition-all group/btn">
                                        <Linkedin className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-navy/5 flex items-center justify-center text-navy/40 hover:bg-lavender hover:text-white hover:border-lavender transition-all group/btn">
                                        <Mail className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                    </button>
                                    <button className="flex-1 rounded-full bg-navy/5 text-navy/70 text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2 group/book">
                                        Consult {member.name.split(' ')[1]}
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover/book:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
