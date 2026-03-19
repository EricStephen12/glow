import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Glow Dental Clinic — Nigeria's Premier Dental Experience",
    template: '%s | Glow Dental Clinic',
  },
  description:
    "Nigeria's leading dental clinic delivering world-class cosmetic, restorative, and preventive dentistry. Digital Smile Design, dental implants, orthodontics, and emergency care. Book online 24/7.",
  keywords: ['Nigeria best dentist', 'premium dental Nigeria', 'dental clinic Nigeria', 'cosmetic dentistry Nigeria', 'dental implants Nigeria', 'teeth whitening Nigeria', 'glow dental clinic', 'luxury dental care', 'smile design Nigeria', 'orthodontics Nigeria'],
  authors: [{ name: 'Glow Dental Clinic' }],
  openGraph: {
    type: 'website',
    siteName: 'Glow Dental Clinic',
    title: "Glow Dental Clinic — Nigeria's Premier Dental Experience",
    description: "World-class dental care trusted by over 10,000 Nigerians. Cosmetic excellence, surgical precision, and luxury patient experience. Book your consultation today.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
