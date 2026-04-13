import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Dashboard | Social Media Trend Center',
    description: 'Unified dashboard for tracking trends across TikTok, YouTube, Instagram, Pinterest, and LinkedIn.',
}

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isPremium) {
        redirect("/pricing");
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="layout-body">
                <main className="layout-main">
                    <Header />

                    <div className="app-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
