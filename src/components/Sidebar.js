"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Youtube, Twitter, Instagram, Video, BarChart2, Linkedin, Pin } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
    { name: 'Genel Bakış', path: '/', icon: Home },
    { name: 'YouTube', path: '/youtube', icon: Youtube },
    { name: 'TikTok', path: '/tiktok', icon: Video },
    { name: 'Twitter / X', path: '/twitter', icon: Twitter },
    { name: 'Instagram', path: '/instagram', icon: Instagram },
    { name: 'LinkedIn', path: '/linkedin', icon: Linkedin },
    { name: 'Pinterest', path: '/pinterest', icon: Pin },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <BarChart2 className={styles.logoIcon} />
                <span className={styles.logoText}>Trend Bulucu</span>
            </div>

            <nav className={styles.nav}>
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    // Map path to platform key for context
                    const platformKey = item.path.replace('/', '');
                    const isPlatform = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'].includes(platformKey);

                    const { isPlatformVisible, togglePlatform } = useDashboard();
                    const isVisible = isPlatform && isPlatformVisible(platformKey);

                    return (
                        <div key={item.path} className={styles.navItemWrapper}>
                            <Link
                                href={item.path}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                            {isPlatform && (
                                <button
                                    className={`${styles.toggleButton} ${isVisible ? styles.removeBtn : styles.addBtn}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        togglePlatform(platformKey);
                                    }}
                                    title={isVisible ? "Genel Bakıştan Çıkar" : "Genel Bakışa Ekle"}
                                >
                                    {isVisible ? '-' : '+'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <p>© 2024 Trend Bulucu</p>
            </div>
        </aside>
    );
}
