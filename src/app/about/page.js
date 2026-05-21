"use client";
import { useState, useEffect } from 'react';
import styles from '../pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function AboutPage() {
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    return (
        <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
            <Link href="/" className={styles.logoLink} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} />
                <span>{t.backToHome}</span>
            </Link>
            
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <User size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>{t.aboutTitle}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {t.aboutText1}
                </p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    {t.aboutText2}
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    {t.aboutText3}
                </p>
            </section>
        </div>
    );
}
