import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Font optimization dengan Next.js 15+
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'My Landing Page',
  description: 'A responsive landing page built with Next.js 15 and Tailwind CSS',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Landing Page'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  )
}