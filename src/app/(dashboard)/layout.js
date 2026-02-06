import Sidebar from '@/components/Sidebar';
import AdSlot from '@/components/AdSlot';
import Header from '@/components/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="layout-body">
                <aside className="layout-ad-left">
                    <AdSlot type="vertical" />
                </aside>

                <main className="layout-main">
                    <header className="layout-header">
                        <AdSlot type="horizontal" />
                    </header>

                    <Header />

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
    );
}
