'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';
import { useDashboard } from '@/context/DashboardContext';

const ScrollToTop = () => {
    const { activeColor } = useDashboard();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        // Check window scroll and document element scroll
        const scrolled = window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            (document.querySelector('.layout-main')?.scrollTop || 0);

        if (scrolled > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // Also scroll containers if needed
        const layoutMain = document.querySelector('.layout-main');
        if (layoutMain) layoutMain.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // Use true for capture phase to catch scroll events from containers
        window.addEventListener('scroll', toggleVisibility, true);
        window.addEventListener('resize', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility, true);
            window.removeEventListener('resize', toggleVisibility);
        };
    }, []);

    const isBlog = window.location.pathname.startsWith('/blog');
    const buttonColor = isBlog ? '#3b82f6' : activeColor; // Blue for blog, dynamic for others

    return (
        <button
            className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
                zIndex: 999999,
                '--scroll-color': buttonColor,
                boxShadow: `0 4px 15px ${buttonColor}40`
            }}
        >
            <ArrowUp size={24} />
        </button >
    );
};

export default ScrollToTop;
