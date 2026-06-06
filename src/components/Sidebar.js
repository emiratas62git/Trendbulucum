"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { useSession } from 'next-auth/react';
import { Home, Youtube, Twitter, Instagram, Video, BarChart2, Linkedin, Pin, Info, ShieldCheck, Mail, Wrench, FileText, BookOpen, X, Sparkles } from 'lucide-react';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
    { name: 'Overview', path: '/dashboard', icon: Home },
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

import { getTranslation } from '@/lib/i18n';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { isPlatformVisible, togglePlatform, isSidebarOpen, closeSidebar } = useDashboard();
    
    const isPremium = session?.user?.isPremium;
    const isAdmin = session?.user?.email === 'emircanatas62@gmail.com';

    // Detection for browser language
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    const menuItemsToRender = [...MENU_ITEMS];
    if (isAdmin && !menuItemsToRender.some(item => item.path === '/admin')) {
        menuItemsToRender.splice(1, 0, { name: 'Admin Panel', path: '/admin', icon: BarChart2 });
    }

    const getMenuNameTranslation = (name) => {
        if (name === 'Overview') return t.menuOverview;
        if (name === 'Admin Panel') return t.menuAdminPanel || 'Admin Panel';
        if (name === 'YouTube') return t.menuYouTube;
        if (name === 'TikTok') return t.menuTikTok;
        if (name === 'Twitter / X') return t.menuTwitter;
        if (name === 'Instagram') return t.menuInstagram;
        if (name === 'LinkedIn') return t.menuLinkedIn;
        if (name === 'Pinterest') return t.menuPinterest;
        if (name === 'Blog & Insights') return t.menuBlog;
        if (name === 'About Us') return t.menuAbout;
        if (name === 'Privacy Policy') return t.menuPrivacy;
        if (name === 'Terms of Service') return t.menuTerms;
        if (name === 'Contact') return t.menuContact;
        if (name === 'How It Works') return t.menuHowItWorks;
        return name;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.logoContainer}>
                    <img src="/logo.png" alt="TrendyFinder Logo" className={styles.brandLogo} />
                </div>

                <div className={styles.mobileHeader}>
                    <button className={styles.closeSidebar} onClick={closeSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuItemsToRender.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        // Map path to platform key for context
                        const platformKey = item.path.replace('/', '');
                        const isPlatform = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'].includes(platformKey);

                        const isVisible = isPlatform && isPlatformVisible(platformKey);

                        const isFirstInfo = item.type === 'info' && (index === 0 || menuItemsToRender[index - 1].type !== 'info');

                        return (
                            <div key={item.path}>
                                {index === 0 && !isPremium && (
                                    <Link 
                                        href="/" 
                                        className={styles.premiumMenuItem}
                                        onClick={closeSidebar}
                                    >
                                        <Sparkles size={20} />
                                        <span>{t.upgradePro}</span>
                                    </Link>
                                )}
                                {isFirstInfo && <div className={styles.navTitle}>{t.infoSupport}</div>}
                                <div className={`${styles.navItemWrapper} ${item.path === '/blog' ? styles.blogNavItemWrapper : ''}`}>
                                    <Link
                                        href={!isPremium && (isPlatform || item.path === '/dashboard') ? '/' : item.path}
                                        className={`${styles.navItem} ${isActive ? styles.active : ''} ${item.path === '/blog' ? styles.blogNavItem : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <span className={item.path === '/blog' ? styles.blogIconWrapper : ''}>
                                            <Icon size={20} />
                                            {item.path === '/blog' && <span className={styles.blogPulseDot} />}
                                        </span>
                                        <span>{getMenuNameTranslation(item.name)}</span>
                                        {item.path === '/blog' && <span className={styles.blogNewBadge}>NEW</span>}
                                    </Link>
                                    {isPlatform && (
                                        <button
                                            className={`${styles.toggleButton} ${isVisible ? styles.removeBtn : styles.addBtn}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                togglePlatform(platformKey);
                                            }}
                                            title={isVisible ? t.removeFromOverview : t.addToOverview}
                                        >
                                            {isVisible ? '-' : '+'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </nav>

            </aside >
        </>
    );
}
