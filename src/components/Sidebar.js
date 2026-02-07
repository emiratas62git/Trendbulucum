"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Youtube, Twitter, Instagram, Video, BarChart2, Linkedin, Pin, Info, ShieldCheck, Mail, Wrench, FileText, BookOpen } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'YouTube', path: '/youtube', icon: Youtube },
    { name: 'TikTok', path: '/tiktok', icon: Video },
    { name: 'Twitter / X', path: '/twitter', icon: Twitter },
    { name: 'Instagram', path: '/instagram', icon: Instagram },
    { name: 'LinkedIn', path: '/linkedin', icon: Linkedin },
    { name: 'Pinterest', path: '/pinterest', icon: Pin },
    { name: 'Blog & Insights', path: '/blog', icon: BookOpen },
    { name: 'About Us', path: '/about-us', icon: Info, type: 'info' },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck, type: 'info' },
    { name: 'Terms of Service', path: '/terms-of-service', icon: FileText, type: 'info' },
    { name: 'Contact', path: '/contact', icon: Mail, type: 'info' },
    { name: 'How It Works', path: '/how-it-works', icon: Wrench, type: 'info' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isPlatformVisible, togglePlatform } = useDashboard();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <BarChart2 className={styles.logoIcon} />
                <span className={styles.logoText}>Trendfinder</span>
            </div>

            <nav className={styles.nav}>
                {MENU_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    // Map path to platform key for context
                    const platformKey = item.path.replace('/', '');
                    const isPlatform = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'].includes(platformKey);

                    const isVisible = isPlatform && isPlatformVisible(platformKey);

                    const isFirstInfo = item.type === 'info' && (index === 0 || MENU_ITEMS[index - 1].type !== 'info');

                    return (
                        <div key={item.path}>
                            {isFirstInfo && <div className={styles.navTitle}>Info & Support</div>}
                            <div className={styles.navItemWrapper}>
                                <Link
                                    href={item.path}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    target={item.path === '/blog' ? '_blank' : undefined}
                                    onClick={closeSidebar}
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
                                        title={isVisible ? "Remove from Overview" : "Add to Overview"}
                                    >
                                        {isVisible ? '-' : '+'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <p>© {new Date().getFullYear()} Trendfinder All rights reserved.</p>
            </div>
        </aside >
    );
}
