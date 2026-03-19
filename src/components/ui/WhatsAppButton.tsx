'use client'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2340000000000'
    const message = encodeURIComponent('Hello, I would like to book an appointment at Glow Dental Clinic.')

    return (
        <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
        >
            {/* Tooltip */}
            <span className="absolute right-16 bg-white text-[#1A0A0E] text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                Chat with us
            </span>

            {/* Button */}
            <div className="animate-pulse-ring w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200">
                <MessageCircle className="w-7 h-7 text-white fill-white" />
            </div>
        </a>
    )
}
