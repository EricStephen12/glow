'use client'
import { motion } from 'framer-motion'
import {
    Phone, Mail, MapPin, Clock,
    MessageCircle, ArrowRight, Send
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <div className="pt-24 bg-surface">
            {/* Hero Section */}
            <section className="bg-navy py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-lavender rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 px-6"
                >
                    <p className="text-lavender text-xs font-bold tracking-[0.4em] uppercase mb-4">Get In Touch</p>
                    <h1 className="text-4xl md:text-6xl font-medium text-white mb-6">
                        Contact <span className="text-lavender italic font-display">Us</span>
                    </h1>
                    <p className="text-white/40 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                        Have a question or ready to book? Our team is here to help and ensure your journey is seamless.
                    </p>
                </motion.div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6 pb-40">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-medium text-navy mb-10">Reach <span className="text-lavender italic font-display">Us</span></h2>

                        <div className="grid gap-6 mb-12">
                            {[
                                {
                                    Icon: Phone,
                                    label: 'Phone Consultation',
                                    value: '0803 634 5839',
                                    href: 'tel:08036345839'
                                },
                                {
                                    Icon: Mail,
                                    label: 'Clinical Inquiries',
                                    value: 'contact@glowdentalclinic.com',
                                    href: 'mailto:contact@glowdentalclinic.com'
                                },
                                {
                                    Icon: MessageCircle,
                                    label: 'WhatsApp',
                                    value: 'Chat with us directly',
                                    href: '#'
                                },
                            ].map(({ Icon, label, value, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="flex items-center gap-5 p-6 bg-white rounded-[32px] shadow-sm border border-navy/5 group hover:border-lavender/30 hover:shadow-xl hover:shadow-lavender/5 transition-all"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-lavender/5 flex items-center justify-center group-hover:bg-lavender group-hover:scale-110 transition-all">
                                        <Icon className="w-6 h-6 text-lavender group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-lavender font-bold uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-bold text-navy text-lg">{value}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-navy/10 group-hover:text-lavender group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                        </div>

                        {/* Opening Hours */}
                        <div className="bg-navy text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/10 rounded-bl-full translate-x-8 -translate-y-8" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-lavender" />
                                </div>
                                <h3 className="text-xl font-bold">Clinical Hours</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { day: 'Monday - Friday', hours: '08:00 AM - 08:00 PM' },
                                    { day: 'Saturday', hours: '09:00 AM - 05:00 PM' },
                                    { day: 'Sunday', hours: 'Emergency Only' },
                                ].map((item) => (
                                    <div key={item.day} className="flex justify-between items-center text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <span className="text-white/40 font-medium">{item.day}</span>
                                        <span className={`font-bold ${item.hours === 'Emergency Only' ? 'text-lavender' : 'text-white'}`}>{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-[48px] shadow-float p-10 md:p-12 border border-navy/5">
                            {!isSubmitted ? (
                                <>
                                    <h2 className="text-3xl font-medium text-navy mb-4 font-display">Message Our Team</h2>
                                    <p className="text-navy/40 text-sm mb-10 leading-relaxed font-medium">Our specialists will get back to you within 24 clinical hours.</p>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-bold text-navy uppercase tracking-widest block mb-3 opacity-50">Your Name</label>
                                                <input type="text" className="w-full bg-surface border border-navy/5 rounded-2xl p-4 focus:outline-none focus:border-lavender transition-colors font-medium text-navy" placeholder="Full Name" required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-navy uppercase tracking-widest block mb-3 opacity-50">Email Address</label>
                                                <input type="email" className="w-full bg-surface border border-navy/5 rounded-2xl p-4 focus:outline-none focus:border-lavender transition-colors font-medium text-navy" placeholder="email@example.com" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-navy uppercase tracking-widest block mb-3 opacity-50">Subject</label>
                                            <select className="w-full bg-surface border border-navy/5 rounded-2xl p-4 focus:outline-none focus:border-lavender transition-colors font-medium text-navy appearance-none">
                                                <option>General Inquiry</option>
                                                <option>Veneers & Aesthetics</option>
                                                <option>Implants & Surgery</option>
                                                <option>Emergency Request</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-navy uppercase tracking-widest block mb-3 opacity-50">Your Message</label>
                                            <textarea className="w-full bg-surface border border-navy/5 rounded-2xl p-4 focus:outline-none focus:border-lavender transition-colors font-medium text-navy min-h-[150px] resize-none" placeholder="How can we assist you?" required></textarea>
                                        </div>
                                        <button type="submit" className="btn-pill-lavender w-full justify-center py-5 group shadow-2xl shadow-lavender/20">
                                            Send Secure Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                        <p className="text-[10px] text-center text-navy/30 uppercase tracking-widest font-bold">Your privacy is our clinical priority</p>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-lavender/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Send className="w-8 h-8 text-lavender" />
                                    </div>
                                    <h2 className="text-3xl font-medium text-navy mb-4">Message Sent!</h2>
                                    <p className="text-navy/40 max-w-xs mx-auto mb-10 text-lg leading-relaxed font-medium">Thank you for reaching out. We will get back to you via your provided email shortly.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 border border-navy/10 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-navy/5 transition-all text-navy">Send Another Message</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-24 border-t border-navy/5 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                    <p className="text-lavender text-xs font-bold tracking-[0.4em] uppercase mb-4">Visit Us</p>
                    <h2 className="text-3xl md:text-5xl font-medium text-navy">Our <span className="text-lavender italic font-display">Flagship</span> Clinic</h2>
                </div>
                <div className="max-w-7xl mx-auto px-6 overflow-hidden rounded-[48px] shadow-2xl relative h-[500px] border border-navy/5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15754.717148560372!2d7.3377224!3d9.1488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e76a6e5399589:0x8797b7673a5a79!2sKubwa, Abuja!5e0!3m2!1sen!2sng!4v1709645500000!5m2!1sen!2sng"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            </section>
        </div>
    )
}
