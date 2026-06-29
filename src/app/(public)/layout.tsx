import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ToothJourney from '@/components/sections/ToothJourney'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen">
            {/* Film Grain Noise Overlay */}
            <div className="noise-overlay" />

            {/* Luxury Viewport Frame */}
            <div className="fixed inset-0 pointer-events-none z-[9999] border-4 border-surface md:border-12">
                {/* Thin inner hairline border */}
                <div className="absolute inset-0 border border-navy/[0.04]" />
                
                {/* Micro Metadata Labels in Corners */}
                <div className="absolute top-2.5 left-5 text-[8px] font-bold tracking-[0.4em] text-navy/35 uppercase hidden md:block">
                    [ GLOW DENTAL ]
                </div>
                <div className="absolute top-2.5 right-5 text-[8px] font-bold tracking-[0.4em] text-navy/35 uppercase hidden md:block">
                    [ LAGOS, NG ]
                </div>
                <div className="absolute bottom-2.5 left-5 text-[8px] font-bold tracking-[0.4em] text-navy/35 uppercase hidden md:block">
                    [ CLINICAL ARTISTRY ]
                </div>
                <div className="absolute bottom-2.5 right-5 text-[8px] font-bold tracking-[0.4em] text-navy/35 uppercase hidden md:block">
                    [ EST. 2026 ]
                </div>
            </div>

            {/* Editorial Column Lines */}
            <div className="fixed inset-0 pointer-events-none z-0 flex justify-between max-w-7xl mx-auto px-6">
                <div className="w-px h-full bg-navy/[0.04]" />
                <div className="w-px h-full bg-navy/[0.04] hidden md:block" />
                <div className="w-px h-full bg-navy/[0.04] hidden md:block" />
                <div className="w-px h-full bg-navy/[0.04] hidden lg:block" />
                <div className="w-px h-full bg-navy/[0.04]" />
            </div>

            <Header />
            <ToothJourney />
            <main className="relative z-10">{children}</main>
            <Footer />
            <WhatsAppButton />
        </div>
    )
}
