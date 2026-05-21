"use client";
import { useState, useEffect } from 'react';
import styles from '../pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function TermsPage() {
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
                <FileText size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>{t.termsTitle}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.termsSubtitle}</p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.termsSec1Title}</h2>
                <p>{t.termsSec1Text}</p>
                
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.termsSec2Title}</h2>
                <p>{t.termsSec2Text}</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.termsSec3Title}</h2>
                <p>{t.termsSec3Text}</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.termsSec4Title}</h2>
                <p>{t.termsSec4Text}</p>
            </section>
        </div>
    );
}
