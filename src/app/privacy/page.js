"use client";
import styles from '../pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/" className={styles.logoLink} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} />
                <span>Ana Sayfaya Dön</span>
            </Link>
            
            <header style={{ marginBottom: '3rem' }}>
                <Shield size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>Privacy & Security Policy</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>How we protect your data and trends.</p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>1. Data Encryption</h2>
                <p>All user information is encrypted using 256-bit SSL protocols. We do not store your raw password; only secure hashes.</p>
                
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>2. Payment Security</h2>
                <p>Payments are handled exclusively through Lemon Squeezy. TrendyFinder Pro never sees or stores your credit card details.</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>3. Third-Party Access</h2>
                <p>We do not sell your personal trend preferences or dashboard activity to third parties. Your growth strategy is your own.</p>
            </section>
        </div>
    );
}
