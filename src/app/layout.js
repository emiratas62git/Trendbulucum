import './globals.css'
import { Inter } from 'next/font/google'
import { DashboardProvider } from '@/context/DashboardContext';
import AdSlot from '@/components/AdSlot';
import ScrollToTop from '@/components/ScrollToTop';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: {
        default: 'TrendyFinder | Social Media Trend Analysis',
        template: '%s | TrendyFinder'
    },
    description: 'Master social media with TrendyFinder. Real-time trend analysis and content suggestions for TikTok, YouTube, Instagram, Pinterest, and LinkedIn.',
    keywords: ['social media trends', 'content strategy', 'viral trends', 'trend analysis', 'TikTok trends', 'YouTube growth', 'Instagram reels ideas'],
    authors: [{ name: 'TrendyFinder Team' }],
    creator: 'TrendyFinder',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://trendyfinder.com', // Replace with actual URL if known
        title: 'TrendyFinder | Master Social Media Trends',
        description: 'Real-time trend analysis and content suggestions to help you grow your social media presence.',
        siteName: 'TrendyFinder',
        images: [{
            url: '/logo.png',
            width: 800,
            height: 600,
            alt: 'TrendyFinder Logo',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TrendyFinder | Master Social Media Trends',
        description: 'Real-time trend analysis and content suggestions.',
        images: ['/logo.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
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
