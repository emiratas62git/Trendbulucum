import './globals.css'
import { Inter } from 'next/font/google'
import { DashboardProvider } from '@/context/DashboardContext';
import AdSlot from '@/components/AdSlot';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Trend Bulucu',
    description: 'Sosyal medya trend analizi ve içerik önerileri',
}

export default function RootLayout({ children }) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <DashboardProvider>
                    <div className="app-layout">
                        <div className="layout-body">
                            <aside className="layout-ad-left">
                                <AdSlot type="vertical" />
                            </aside>

                            <main className="layout-main">
                                <header className="layout-header">
                                    <AdSlot type="horizontal" />
                                </header>

                                <div className="app-container">
                                    {children}
                                </div>

                                <footer className="layout-footer">
                                    <AdSlot type="horizontal" />
                                </footer>
                            </main>

                            <aside className="layout-ad-right">
                                <AdSlot type="vertical" />
                            </aside>
                        </div>
                    </div>
                </DashboardProvider>
            </body>
        </html>
    )
}
