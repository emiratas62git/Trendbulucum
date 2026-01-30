import './globals.css'
import { Inter } from 'next/font/google'
import { DashboardProvider } from '@/context/DashboardContext';
import AdSlot from '@/components/AdSlot';
import ScrollToTop from '@/components/ScrollToTop';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Trendfinder',
    description: 'Social media trend analysis and content suggestions',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <DashboardProvider>
                    {children}
                    <ScrollToTop />
                </DashboardProvider>
            </body>
        </html>
    )
}
