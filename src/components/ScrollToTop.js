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
        // Safe check for window
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                const scrolled = window.scrollY ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    (document.querySelector('.layout-main')?.scrollTop || 0);

                setIsVisible(scrolled > 300);
            };

            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);

            // Set initial state for blog
            if (window.location.pathname.startsWith('/blog')) {
                // We can use a different way to handle this if needed, 
                // but for now let's just use a local state or keep it simple
            }

            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, []);

    // Derived values should be safe if used correctly or moved to state
    const [buttonColor, setButtonColor] = useState(activeColor);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isBlog = window.location.pathname.startsWith('/blog');
            setButtonColor(isBlog ? '#3b82f6' : activeColor);
        }
    }, [activeColor]);

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
