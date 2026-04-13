"use client";
import styles from '../pricing/pricing.module.css';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/pricing" className={styles.logoLink} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} />
                <span>Back to Pricing</span>
            </Link>
            
            <header style={{ marginBottom: '3rem' }}>
                <FileText size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>Terms of Service</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please read these terms before subscribing to Pro.</p>
            </header>

            <section style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>1. Subscription Service</h2>
                <p>TrendyFinder Pro is a subscription-based trend intelligence service. By subscribing, you agree to recurring payments for your chosen plan.</p>
                
                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>2. Cancellation Policy</h2>
                <p>You may cancel your subscription at any time. Your access will continue until the end of the current billing cycle. No refunds for partial months.</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>3. Usage Limits</h2>
                <p>Access is for personal or single-business use. Account sharing or mass scraping of regional trend data is strictly prohibited.</p>

                <h2 style={{ color: 'var(--primary)', marginTop: '2rem' }}>4. AI Reports</h2>
                <p>AI-generated reports are tools for analysis. TrendyFinder Pro is not responsible for the direct success of content based on these trends.</p>
            </section>
        </div>
    );
}
