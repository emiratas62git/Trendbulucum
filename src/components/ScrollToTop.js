'use client';
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import styles from './ScrollToTop.module.css';
import { useDashboard } from '@/context/DashboardContext';

const ScrollToTop = () => {
    const { activeColor } = useDashboard();
    const [isUpVisible, setIsUpVisible] = useState(false);
    const [isDownVisible, setIsDownVisible] = useState(true);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        const layoutMain = document.querySelector('.layout-main');
        if (layoutMain) layoutMain.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        const height = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo({
            top: height,
            behavior: 'smooth',
        });
        const layoutMain = document.querySelector('.layout-main');
        if (layoutMain) {
            layoutMain.scrollTo({
                top: layoutMain.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                const scrolled = window.scrollY ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    (document.querySelector('.layout-main')?.scrollTop || 0);

                // Up button visible after 300px
                setIsUpVisible(scrolled > 300);
                // Down button visible initially, hidden after 300px
                setIsDownVisible(scrolled <= 300);
            };

            const layoutMain = document.querySelector('.layout-main');
            window.addEventListener('scroll', handleScroll, true);
            if (layoutMain) layoutMain.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);

            // Initial check
            handleScroll();

            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                if (layoutMain) layoutMain.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, []);

    const [buttonColor, setButtonColor] = useState(activeColor);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isBlog = window.location.pathname.startsWith('/blog');
            const color = isBlog ? '#6366f1' : activeColor;
            setButtonColor(color);
            // Update global scrollbar color
            document.documentElement.style.setProperty('--platform-scrollbar-color', color);
        }
    }, [activeColor]);

    return (
        <>
            <button
                className={`${styles.scrollToTop} ${isUpVisible ? styles.visible : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
                style={{
                    zIndex: 2147483647,
                    '--scroll-color': buttonColor,
                    boxShadow: `0 4px 15px ${buttonColor}40`
                }}
            >
                <ArrowUp size={24} />
            </button>

            <button
                className={`${styles.scrollToTop} ${isDownVisible ? styles.visible : ''}`}
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
                style={{
                    zIndex: 2147483647,
                    '--scroll-color': buttonColor,
                    boxShadow: `0 4px 15px ${buttonColor}40`
                }}
            >
                <ArrowDown size={24} />
            </button>
        </>
    );
};

export default ScrollToTop;
