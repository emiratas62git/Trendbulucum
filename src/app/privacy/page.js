"use client";
import { useState, useEffect } from 'react';
import styles from '../pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function PrivacyPage() {
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
                <Shield size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>{t.privacyTitle}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.privacySubtitle}</p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.privacySec1Title}</h2>
                <p>{t.privacySec1Text}</p>
                
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.privacySec2Title}</h2>
                <p>{t.privacySec2Text}</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{t.privacySec3Title}</h2>
                <p>{t.privacySec3Text}</p>
            </section>
        </div>
    );
}
