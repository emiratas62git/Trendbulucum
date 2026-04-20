"use client";
import styles from '../pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, User, Shield, FileText } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
            <Link href="/" className={styles.logoLink} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} />
                <span>Ana Sayfaya Dön</span>
            </Link>
            
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <User size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>Who We Are</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    TrendyFinder Pro was founded with a single mission: to empower content creators and businesses with real-time, AI-driven trend intelligence. 
                </p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Founded in 2024 by Emir Can ATAŞ, we combine deep data analysis with the latest Google Gemini AI models to filter out the noise and deliver actionable insights.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Our team believes that the future of social media belongs to those who can predict the next big thing before it happens. TrendyFinder Pro is the bridge between raw data and creative success.
                </p>
            </section>
        </div>
    );
}
