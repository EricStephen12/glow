'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Shield, Heart, Award, ArrowRight, User, CheckCircle, Zap } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="pt-24 bg-surface selection:bg-lavender/20">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-clinic.png"
                        alt="Glow Dental Clinic Interior"
                        fill
                        className="object-cover opacity-20 filter grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-6">About Glow Dental</p>
                        <h1 className="text-5xl md:text-7xl font-medium text-white mb-8 font-display italic">
                            Redefining Dental <span className="text-lavender">Care</span> in Nigeria
                        </h1>
                        <p className="text-white/40 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                            We built Glow Dental to prove that world-class dentistry doesn&apos;t require a flight abroad — it just requires the right team, the right technology, and an obsession with doing things properly.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden shadow-2xl z-10 border border-navy/5">
                                <Image src="/images/hero-patient-black.png" alt="Patient receiving care" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
                            </div>
                            <div className="absolute inset-0 border border-lavender/20 rounded-[40px] translate-x-10 translate-y-10 -z-10" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-lavender text-xs font-bold tracking-[0.3em] uppercase mb-6">Our Philosophy</p>
                            <h2 className="text-4xl md:text-5xl font-medium text-navy mb-8 font-display">The Standard <span className="text-lavender italic">Should Be</span> Higher</h2>
                            <p className="text-navy/60 text-lg mb-6 leading-relaxed font-medium">
                                Most dental clinics in Nigeria operate on volume. We operate on precision. Every procedure, from a routine cleaning to a full-mouth restoration, gets the same meticulous attention.
                            </p>
                            <p className="text-navy/40 text-base mb-10 leading-relaxed">
                                Our team trains internationally, invests in the latest diagnostic technology, and builds treatment plans that respect both your time and your goals. That approach has earned the trust of over 10,000 patients across Nigeria.
                            </p>
                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div>
                                    <p className="text-4xl font-bold text-navy mb-2">18+</p>
                                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest">Years of Practice</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-navy mb-2">10K+</p>
                                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest">Smiles Transformed</p>
                                </div>
                            </div>
                            <Link href="/book" className="btn-pill-lavender !px-10 !py-5">
                                Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-navy text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-lavender/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <p className="text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-4">What Drives Us</p>
                        <h2 className="text-4xl md:text-5xl font-medium font-display text-white">Our <span className="text-lavender italic">Non-Negotiables</span></h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Shield,
                                title: 'Sterile Obsession',
                                desc: 'Every instrument autoclave-sterilized. Every surface sanitized between patients. We follow international infection control protocols because there is no shortcut to safety.'
                            },
                            {
                                icon: Zap,
                                title: 'Technology-First',
                                desc: 'Digital radiography, intraoral 3D scanning, laser diagnostics — we invest in technology that makes treatments faster, more accurate, and less invasive.'
                            },
                            {
                                icon: Heart,
                                title: 'Patient-Centered',
                                desc: 'We explain before we treat. We listen before we plan. Every patient gets a custom treatment roadmap, not a one-size-fits-all protocol.'
                            },
                        ].map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 p-10 rounded-[40px] group hover:bg-white/10 transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-lavender/10 flex items-center justify-center mb-10 group-hover:bg-lavender group-hover:scale-110 transition-all">
                                    <v.icon className="w-8 h-8 text-lavender group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-display">{v.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed font-medium">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center mb-20">
                    <p className="text-lavender text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Leadership</p>
                    <h2 className="text-4xl md:text-5xl font-medium text-navy font-display">Our <span className="text-lavender italic">Specialists</span></h2>
                </div>
                <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                    {[
                        {
                            name: 'Dr. Sarah Adeyemi',
                            role: 'Clinical Director & Aesthetic Lead',
                            specialty: 'Fellow of the International Congress of Oral Implantologists. 12+ years specializing in Digital Smile Design, porcelain veneers, and full-mouth aesthetic rehabilitation.'
                        },
                        {
                            name: 'Dr. Marcus Okafor',
                            role: 'Lead Oral Surgeon & Implantologist',
                            specialty: 'Former LUTH residency. Expert in computer-guided implant surgery with 2,000+ successful placements. Focused on complex surgical restorations and bone grafting.'
                        },
                    ].map((m, i) => (
                        <motion.div
                            key={m.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface p-12 text-center group rounded-[48px] border border-navy/5 hover:shadow-xl hover:shadow-lavender/5 transition-all duration-300"
                        >
                            <div className="w-32 h-32 rounded-full bg-navy/5 mx-auto mb-8 flex items-center justify-center overflow-hidden border-2 border-lavender/20 p-2">
                                <div className="w-full h-full rounded-full bg-navy/10 flex items-center justify-center">
                                    <User className="w-12 h-12 text-navy/20" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-navy mb-2 group-hover:text-lavender transition-colors">{m.name}</h3>
                            <p className="text-lavender text-[10px] font-bold uppercase tracking-[0.2em] mb-6">{m.role}</p>
                            <p className="text-navy/40 text-sm leading-relaxed font-medium mb-10">{m.specialty}</p>
                            <div className="flex justify-center gap-2">
                                <Award className="w-5 h-5 text-lavender/40" />
                                <CheckCircle className="w-5 h-5 text-lavender/40" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
