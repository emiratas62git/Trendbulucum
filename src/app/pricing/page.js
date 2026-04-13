"use client";
import { useState } from 'react';
import { Check, Zap, Rocket, Star, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import styles from './pricing.module.css';
import Link from 'next/link';

const PLANS = [
    {
        name: 'Monthly Pro',
        price: '10',
        period: 'month',
        description: 'Perfect for regular content creators.',
        features: [
            'Daily AI Trend Summaries',
            'Full Platform Insights',
            'Idea Generation Engine',
            '7-Day Premium Pass',
            'Standard Support'
        ],
        icon: <Zap />,
        variant: 'standard'
    },
    {
        name: '3-Month Growth',
        price: '25',
        period: 'quarter',
        description: 'The most popular choice for professionals.',
        features: [
            'Everything in Monthly',
            'Priority Trend Alerts',
            'Extended History Access',
            '20% Discount included',
            'Priority Support'
        ],
        icon: <Rocket />,
        variant: 'featured',
        badge: 'Best Value'
    },
    {
        name: 'Annual Mastery',
        price: '100',
        period: 'year',
        description: 'Master the social media game permanently.',
        features: [
            'Everything in 3-Month',
            'Advanced Data Analysis',
            'Consultation Credits',
            'Legacy Price Lock',
            'VIP 24/7 Support'
        ],
        icon: <Star />,
        variant: 'premium'
    }
];

export default function PricingPage() {
    const [loading, setLoading] = useState(null);

    const handleSubscribe = async (plan) => {
        setLoading(plan.name);
        try {
            // Logic to create Lemon Squeezy checkout
            const res = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.name })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            console.error("Subscription failed:", e);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.navHeader}>
                <Link href="/" className={styles.logoLink}>
                    <img src="/logo.png" alt="TrendyFinder Logo" className={styles.pageLogo} />
                </Link>
            </header>
            <div className={styles.header}>
                <span className={styles.badge}>Pricing Plans</span>
                <h1>Master the Trends with Pro</h1>
                <p>Choose the plan that fits your ambition. Start with a 7-day premium pass.</p>
            </div>

            <div className={styles.pricingGrid}>
                {PLANS.map((plan, i) => (
                    <div 
                        key={i} 
                        className={`${styles.card} ${styles[plan.variant]}`}
                    >
                        {plan.badge && <div className={styles.featuredBadge}>{plan.badge}</div>}
                        
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>{plan.icon}</div>
                            <h3>{plan.name}</h3>
                            <div className={styles.priceWrapper}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>{plan.price}</span>
                                <span className={styles.period}>/{plan.period}</span>
                            </div>
                            <p className={styles.description}>{plan.description}</p>
                        </div>

                        <div className={styles.features}>
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className={styles.featureItem}>
                                    <Check size={16} className={styles.checkIcon} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={styles.subscribeBtn}
                            onClick={() => handleSubscribe(plan)}
                            disabled={loading !== null}
                        >
                            {loading === plan.name ? <Loader2 className={styles.spin} /> : 'Start 7-Day Premium Pass'}
                            {loading !== plan.name && <ArrowRight size={18} />}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.footerSection}>
                <div className={styles.trustItem}>
                    <ShieldCheck size={24} />
                    <div>
                        <h4>Security Policy</h4>
                        <p>Powered by Lemon Squeezy with 256-bit encryption and secure checkout.</p>
                    </div>
                </div>
                <div className={styles.trustItem}>
                    <Sparkles size={24} />
                    <div>
                        <h4>About TrendyFinder</h4>
                        <p>Providing cutting-edge AI trend analysis for creators since 2024.</p>
                    </div>
                </div>
            </div>

            <footer className={styles.mainFooter}>
                <div className={styles.footerLinks}>
                    <Link href="/about">Who We Are</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Service</Link>
                    <Link href="/contact">Contact Support</Link>
                </div>
                <p className={styles.copyright}>© 2026 TrendyFinder Pro. All rights reserved.</p>
            </footer>
        </div>
    );
}
