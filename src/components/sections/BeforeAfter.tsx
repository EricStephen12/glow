'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const RESULTS = [
    {
        title: 'Smile Design',
        category: 'Cosmetic',
        image: '/images/smile-portrait.png',
        before: 'Misaligned',
        after: 'Perfectly Straight'
    },
    {
        title: 'Rehabilitation',
        category: 'Restorative',
        image: '/images/hero-patient-black.png',
        before: 'Damaged',
        after: 'Fully Restored'
    },
    {
        title: 'Whitening',
        category: 'Esthetic',
        image: '/images/black-woman-hero.png',
        before: 'Stained',
        after: 'Clean & White'
    }
]

export default function BeforeAfter() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Elegant title text stagger
            gsap.from('.ba-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.ba-header',
                    start: 'top 80%',
                }
            })

            // Luxury image curtain reveal
            gsap.from('.ba-card', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.ba-grid',
                    start: 'top 75%'
                }
            })

            // The image clip-path reveal (awwwards style)
            const images = gsap.utils.toArray('.ba-image-container')
            images.forEach((img: any, i) => {
                gsap.fromTo(img, 
                    { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        duration: 1.5,
                        ease: 'power4.inOut',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 85%',
                        },
                        delay: i * 0.1
                    }
                )
                
                // Subtle zoom out on the image itself
                const innerImg = img.querySelector('img')
                if (innerImg) {
                    gsap.fromTo(innerImg,
                        { scale: 1.4 },
                        {
                            scale: 1,
                            duration: 2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: img,
                                start: 'top 85%'
                            }
                        }
                    )
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-transparent overflow-hidden border-t border-navy/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="ba-header text-center max-w-2xl mx-auto mb-20">
                    <p className="ba-title text-lavender text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Smiles we have built</p>
                    <h2 className="ba-title text-4xl md:text-5xl lg:text-6xl font-medium text-navy leading-[1.1] mb-8 font-display tracking-tighter uppercase">
                        Our Results.<br />
                        <span className="italic text-lavender font-light">Real Smiles.</span>
                    </h2>
                    <p className="ba-title text-lavender/60 text-sm md:text-base font-medium leading-relaxed max-w-lg mx-auto">
                        A look at some of our favorite cases. Subtle changes, dramatic differences. All crafted to look completely natural.
                    </p>
                </div>

                <div className="ba-grid grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {RESULTS.map((item) => (
                        <div key={item.title} className="ba-card group cursor-pointer">
                            <div className="ba-image-container relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 shadow-2xl shadow-navy/5">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Label Tags */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
                                    <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                                        <p className="text-white text-[9px] font-bold uppercase tracking-[0.2em]">After</p>
                                    </div>
                                    <div className="px-4 py-2 bg-navy/60 backdrop-blur-xl border border-white/10 rounded-full">
                                        <p className="text-white/80 text-[9px] font-bold uppercase tracking-[0.2em]">Glow Precision</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4">
                                <h3 className="text-2xl font-medium text-navy mb-2 font-display">{item.title}</h3>
                                <p className="text-lavender text-[10px] font-bold uppercase tracking-[0.3em] mb-6">{item.category}</p>
                                <div className="flex items-center gap-6 py-4 border-t border-navy/10 relative overflow-hidden group-hover:border-lavender/30 transition-colors duration-500">
                                    <div className="flex-1">
                                        <p className="text-navy/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Before</p>
                                        <p className="text-navy/70 text-xs font-medium">{item.before}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-lavender/40 transition-transform group-hover:translate-x-2 group-hover:text-lavender" />
                                    <div className="flex-1 text-right">
                                        <p className="text-lavender/40 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">After</p>
                                        <p className="text-navy font-bold text-xs">{item.after}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="inline-flex items-center gap-3 text-navy text-[11px] font-bold uppercase tracking-[0.3em] border-b-2 border-navy/10 pb-2 hover:border-lavender transition-all group overflow-hidden relative">
                        Browse the Case Library 
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2 text-lavender" />
                    </button>
                </div>
            </div>
        </section>
    )
}
