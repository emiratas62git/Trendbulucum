"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Check, Zap, Rocket, Star, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import styles from './pricing.module.css';
import Link from 'next/link';

const PLANS = [
    {
        name: 'Monthly Pro',
        price: '10',
        period: 'month',
        description: 'Predict trends with AI-powered intelligence.',
        features: [
            'Premium Weekly AI Reports',
            'Full Platform Trend Data',
            'Idea Generation Engine',
            'Pro Access',
            'Standard Support'
        ],
        icon: <Zap />,
        variant: 'standard',
        buttonText: 'Buy Monthly Plan'
    },
    {
        name: '3-Month Growth',
        price: '25',
        period: 'quarter',
        description: 'The most popular choice for professionals.',
        features: [
            'Everything in Monthly',
            'Exclusive AI Trend Alerts',
            'Deep-Dive AI Analysis',
            '20% Discount included',
            'Priority Support'
        ],
        icon: <Rocket />,
        variant: 'featured',
        badge: 'Best Value',
        buttonText: 'Buy 3-Month Plan'
    },
    {
        name: 'Annual Mastery',
        price: '100',
        period: 'year',
        description: 'Master the social media game permanently.',
        features: [
            'Everything in 3-Month',
            'Custom AI Topic Tracking',
            'Historical AI Trend Data',
            'Legacy Price Lock',
            'VIP 24/7 Support'
        ],
        icon: <Star />,
        variant: 'premium',
        buttonText: 'Buy Annual Plan'
    }
];

export default function PricingPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(null);

    const handleSubscribe = async (plan) => {
        // If not logged in, redirect to login page first and remember their intent
        if (status !== 'authenticated') {
            signIn(undefined, { callbackUrl: '/?checkout=' + encodeURIComponent(plan.name) });
            return;
        }

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
            } else if (data.error) {
                alert(`Ödeme sistemi hatası: ${data.error}`);
            }
        } catch (e) {
            console.error("Subscription failed:", e);
            alert("Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(null);
        }
    };

    // Auto-checkout if user was redirected from login with a pending plan
    useEffect(() => {
        if (typeof window !== 'undefined' && status === 'authenticated') {
            const urlParams = new URLSearchParams(window.location.search);
            const checkoutPlan = urlParams.get('checkout');
            if (checkoutPlan) {
                const plan = PLANS.find(p => p.name === checkoutPlan);
                if (plan) {
                    // Clean URL immediately so it doesn't run again
                    window.history.replaceState({}, document.title, window.location.pathname);
                    handleSubscribe(plan);
                }
            }
        }
    }, [status]);

    return (
        <div className={styles.container}>
            <header className={styles.navHeader}>
                <Link href="/" className={styles.logoLink}>
                    <img src="/logo.png" alt="TrendyFinder Logo" className={styles.pageLogo} />
                </Link>
                <div className={styles.navActions}>
                    {status === 'authenticated' ? (
                        <Link href="/dashboard" className={styles.loginBtn}>Dashboard</Link>
                    ) : (
                        <button onClick={() => signIn()} className={styles.loginBtn}>Sign In</button>
                    )}
                </div>
            </header>
            <div className={styles.header}>
                <span className={styles.badge}>Pricing Plans</span>
                <h1>Master the Trends with Pro</h1>
                <p>Choose the plan that fits your goals. Unlock Pro access today.</p>
            </div>

            <section className={styles.productSummary}>
                <div className={styles.summaryContent}>
                    <h2>Why TrendyFinder Pro?</h2>
                    <p>
                        TrendyFinder is a premium AI-driven intelligence platform designed for content creators, marketers, and social media professionals. 
                        Our advanced algorithms analyze real-time data across major platforms like TikTok, YouTube, and LinkedIn to provide you with actionable insights, 
                        viral content ideas, and predictive trend analysis.
                    </p>
                    <p>
                        By bridging the gap between raw data and creative execution, TrendyFinder empowers you to dominate your niche and grow your audience with data-backed confidence. 
                        Our Pro features unlock deep-dive analytics and exclusive trend reports that give you a competitive edge in the fast-paced digital landscape.
                    </p>
                </div>
            </section>

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
                            {loading === plan.name ? <Loader2 className={styles.spin} /> : plan.buttonText || 'Upgrade to Pro'}
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
