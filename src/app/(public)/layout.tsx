import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ToothJourney from '@/components/sections/ToothJourney'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <ToothJourney />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}
