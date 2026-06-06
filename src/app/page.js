"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, Zap, Rocket, Star, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import styles from './pricing.module.css';
import Link from 'next/link';

import { getTranslation } from '@/lib/i18n';

export default function PricingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const autoCheckoutRan = useRef(false);

    // Detection for browser language
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    const PLANS = [
        {
            name: 'Monthly Pro',
            price: '10',
            period: t.membershipType === 'Üyelik Tipi' ? 'ay' : 'month',
            description: t.membershipType === 'Üyelik Tipi' ? 'Yapay zeka destekli analiz ile trendleri tahmin edin.' : 'Predict trends with AI-powered intelligence.',
            features: [
                t.welcomeStep4Title === 'Panel' ? 'Haftalık Premium Yapay Zeka Raporları' : 'Premium Weekly AI Reports',
                t.welcomeStep4Title === 'Panel' ? 'Tüm Platform Trend Verileri' : 'Full Platform Trend Data',
                t.welcomeStep4Title === 'Panel' ? 'Fikir Üretme Motoru' : 'Idea Generation Engine',
                t.welcomeStep4Title === 'Panel' ? 'Pro Erişimi' : 'Pro Access',
                t.welcomeStep4Title === 'Panel' ? 'Standart Destek' : 'Standard Support'
            ],
            icon: <Zap />,
            variant: 'standard',
            buttonText: t.membershipType === 'Üyelik Tipi' ? 'Aylık Plan Satın Al' : 'Buy Monthly Plan'
        },
        {
            name: '3-Month Growth',
            price: '25',
            period: t.membershipType === 'Üyelik Tipi' ? '3 ay' : 'quarter',
            description: t.membershipType === 'Üyelik Tipi' ? 'Profesyoneller için en popüler seçim.' : 'The most popular choice for professionals.',
            features: [
                t.membershipType === 'Üyelik Tipi' ? 'Aylık Plandaki Her Şey' : 'Everything in Monthly',
                t.membershipType === 'Üyelik Tipi' ? 'Özel Yapay Zeka Trend Uyarıları' : 'Exclusive AI Trend Alerts',
                t.membershipType === 'Üyelik Tipi' ? 'Derinlemesine Yapay Zeka Analizi' : 'Deep-Dive AI Analysis',
                t.membershipType === 'Üyelik Tipi' ? '%20 İndirim Dahil' : '20% Discount included',
                t.membershipType === 'Üyelik Tipi' ? 'Öncelikli Destek' : 'Priority Support'
            ],
            icon: <Rocket />,
            variant: 'featured',
            badge: t.membershipType === 'Üyelik Tipi' ? 'En İyi Değer' : 'Best Value',
            buttonText: t.membershipType === 'Üyelik Tipi' ? '3 Aylık Plan Satın Al' : 'Buy 3-Month Plan'
        },
        {
            name: 'Annual Mastery',
            price: '100',
            period: t.membershipType === 'Üyelik Tipi' ? 'yıl' : 'year',
            description: t.membershipType === 'Üyelik Tipi' ? 'Sosyal medya oyununda kalıcı olarak uzmanlaşın.' : 'Master the social media game permanently.',
            features: [
                t.membershipType === 'Üyelik Tipi' ? '3 Aylık Plandaki Her Şey' : 'Everything in 3-Month',
                t.membershipType === 'Üyelik Tipi' ? 'Özel Yapay Zeka Konu Takibi' : 'Custom AI Topic Tracking',
                t.membershipType === 'Üyelik Tipi' ? 'Geçmiş Yapay Zeka Trend Verileri' : 'Historical AI Trend Data',
                t.membershipType === 'Üyelik Tipi' ? 'Eski Fiyat Kilidi' : 'Legacy Price Lock',
                t.membershipType === 'Üyelik Tipi' ? 'VIP 7/24 Destek' : 'VIP 24/7 Support'
            ],
            icon: <Star />,
            variant: 'premium',
            buttonText: t.membershipType === 'Üyelik Tipi' ? 'Yıllık Plan Satın Al' : 'Buy Annual Plan'
        }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeen = localStorage.getItem('hasSeenWelcome');
            if (!hasSeen) {
                setShowWelcome(true);
            }
        }
    }, []);

    const closeWelcome = () => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
    };

    const handleSubscribe = async (plan) => {
        // If not logged in, redirect to login page first and remember their intent
        if (status !== 'authenticated') {
            signIn(undefined, { callbackUrl: '/?checkout=' + encodeURIComponent(plan.name) });
            return;
        }

        // Bypass payment for specific user
        if (session?.user?.email === 'emircanatas62@gmail.com') {
            router.push('/dashboard');
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
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                alert(`Billing system error: ${data.error}`);
            }
        } catch (e) {
            console.error("Subscription failed:", e);
            alert("An error occurred while connecting to the payment page. Please check your internet connection or try again later.");
        } finally {
            setLoading(null);
        }
    };

    // Redirect premium users from landing page to dashboard
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.isPremium) {
            // Only redirect if they aren't explicitly trying to checkout a different plan
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.get('checkout')) {
                router.push('/dashboard');
            }
        }
    }, [status, session]);

    // Auto-checkout if user was redirected from login with a pending plan
    useEffect(() => {
        if (typeof window !== 'undefined' && status === 'authenticated' && !autoCheckoutRan.current) {
            const urlParams = new URLSearchParams(window.location.search);
            const checkoutPlan = urlParams.get('checkout');
            if (checkoutPlan) {
                const plan = PLANS.find(p => p.name === checkoutPlan);
                if (plan) {
                    autoCheckoutRan.current = true;
                    // Clean URL immediately so it doesn't run again
                    window.history.replaceState({}, document.title, window.location.pathname);
                    handleSubscribe(plan);
                }
            }
        }
    }, [status]);

    return (
        <div className={styles.container}>
            {showWelcome && (
                <div className={styles.welcomeOverlay}>
                    <div className={styles.welcomeModal}>
                        <h2>{t.welcomeTitle}</h2>
                        <p>{t.welcomeSubtitle}</p>
                        <div className={styles.guideSteps}>
                            <div className={styles.guideStep}>
                                <div className={styles.stepNumber}>1</div>
                                <div><strong>{t.welcomeStep1Title}</strong>: {t.welcomeStep1Desc}</div>
                            </div>
                            <div className={styles.guideStep}>
                                <div className={styles.stepNumber}>2</div>
                                <div><strong>{t.welcomeStep2Title}</strong>: {t.welcomeStep2Desc}</div>
                            </div>
                            <div className={styles.guideStep}>
                                <div className={styles.stepNumber}>3</div>
                                <div><strong>{t.welcomeStep3Title}</strong>: {t.welcomeStep3Desc}</div>
                            </div>
                            <div className={styles.guideStep}>
                                <div className={styles.stepNumber}>4</div>
                                <div><strong>{t.welcomeStep4Title}</strong>: {t.welcomeStep4Desc}</div>
                            </div>
                        </div>
                        <button onClick={closeWelcome} className={styles.gotItBtn}>
                            {t.gotItStart}
                        </button>
                    </div>
                </div>
            )}
            
            <header className={styles.navHeader}>
                <Link href="/" className={styles.logoLink}>
                    <img src="/logo.png" alt="TrendyFinder Logo" className={styles.pageLogo} />
                </Link>
                <div className={styles.navActions}>
                    <Link href="/blog" className={styles.blogHeaderBtn}>{t.blog}</Link>
                    {status === 'authenticated' ? (
                        <Link href="/dashboard" className={styles.loginBtn}>{t.dashboard}</Link>
                    ) : (
                        <button onClick={() => signIn()} className={styles.loginBtn}>{t.signIn}</button>
                    )}
                </div>
            </header>
            <div className={styles.header}>
                <span className={styles.badge}>{t.pricingPlans}</span>
                <h1>{t.masterTrends}</h1>
                <p>{t.pricingDesc}</p>
            </div>

            <section className={styles.productSummary}>
                <div className={styles.summaryContent}>
                    <h2>{t.whyTrendyFinder}</h2>
                    <p>{t.summaryParagraph1}</p>
                    <p>{t.summaryParagraph2}</p>
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
                        <h4>{t.securityPolicy}</h4>
                        <p>{t.securityDesc}</p>
                    </div>
                </div>
                <div className={styles.trustItem}>
                    <Sparkles size={24} />
                    <div>
                        <h4>{t.aboutTrendyFinder}</h4>
                        <p>{t.aboutDesc}</p>
                    </div>
                </div>
            </div>

            <footer className={styles.mainFooter}>
                <div className={styles.footerLinks}>
                    <Link href="/about">{t.whoWeAre}</Link>
                    <Link href="/privacy">{t.privacyPolicy}</Link>
                    <Link href="/terms">{t.termsOfService}</Link>
                    <a href="https://www.linkedin.com/in/emircanata%C5%9F626210/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="mailto:emircanatas62@gmail.com">{t.emailSupport}</a>
                </div>
                <p className={styles.copyright}>{t.allRightsReserved}</p>
            </footer>
        </div>
    );
}
