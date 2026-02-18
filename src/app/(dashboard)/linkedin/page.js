"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendService } from '@/services/TrendService';
import { Linkedin, Briefcase, Users, X, BarChart2, BookOpen, ArrowRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './page.module.css';

export default function LinkedinPage() {
    const { timeframe, setActiveColor } = useDashboard();
    const [trends, setTrends] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const openReport = (trend) => {
        setSelectedReport(trend);
    };

    const closeReport = () => {
        setSelectedReport(null);
    };

    /*
    ### [Fix] Build Error (Window Undefined)
    - **Resolution**: Guarded programmatic `window` references in `src/components/ScrollToTop.js`. Programmatic use of `window` during the static generation phase of the build was causing failure.
    - **Verification**: Ran `npm run build` locally to ensure a successful build process before pushing to GitHub.

    ### [Verification] Final Site Check
    The latest deployment was verified on the live site [trendyfinder.netlify.app](https://trendyfinder.netlify.app):
    - The Sidebar "X" icon is **permanently removed** on desktop view.
    - The layout is clean and matches the local environment.
    - The latest functional changes (Ad Slots, etc.) are confirmed live.

    ![Final Verification Screenshot](file:///Users/emircanapple/.gemini/antigravity/brain/704d65ba-8c85-414f-a687-bcadd65f883b/netlify_final_check_fix_1771432240068.webp)

    > [!NOTE]
    > All changes are now fully synced between your local environment, GitHub, and Netlify.
    */
    const getRankClass = (index) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return styles.rankOther;
    };


    useEffect(() => {
        setActiveColor('#0A66C2'); // LinkedIn Blue
        async function fetchData() {
            setLoading(true);
            const data = await TrendService.getPlatformTrends('linkedin_discussions', timeframe);
            setTrends(data);
            setLoading(false);
        }
        fetchData();
    }, [timeframe, setActiveColor]);

    return (
        <>
            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>LinkedIn Trending</h1>
                        <p>Business world trends, industry analysis, and networking opportunities.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Linkedin size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>📈 Rising Discussions</h3>
                        <div className={styles.cardList}>
                            {loading ? <p>Loading...</p> : trends.map((trend, index) => (
                                <div key={trend.id} className={styles.card}>
                                    <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                        {index + 1}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h4>{trend.topic}</h4>
                                        <div className={styles.meta}>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaLabel}>Growth</span>
                                                <span className={styles.growth}>{trend.growth}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaLabel}>Engagement</span>
                                                <span className={styles.metaValue}>{trend.engagement_rate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <span className={styles.industryTag}>{trend.industry}</span>
                                        <button className={styles.actionButton} onClick={() => openReport(trend)}>Analyze</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Professional Suggestions</h3>
                        <div className={styles.suggestionBox}>
                            <div className={styles.ideaHeader}>
                                <Users size={20} className={styles.ideaIcon} />
                                <h4>Networking Opportunities</h4>
                            </div>
                            <ul className={styles.list}>
                                <li>AI Conferences (Q3)</li>
                                <li>Remote Work Webinars</li>
                            </ul>
                        </div>

                        {/* Read Expert Insight Card */}
                        <div className={styles.suggestionBox} style={{ marginTop: '1.5rem', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                            <div className={styles.ideaHeader}>
                                <BookOpen size={20} className={styles.ideaIcon} style={{ color: 'var(--primary)' }} />
                                <h4>Read Expert Insight</h4>
                            </div>
                            <div style={{ padding: '0 0.5rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ width: '100%', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60"
                                        alt="Insight"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    Learn how to master LinkedIn algorithms and grow your network.
                                </p>
                                <Link
                                    href="/blog/rising-social-media-trends-2026"
                                    className={styles.actionButton}
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        display: 'block',
                                        textDecoration: 'none',
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid var(--primary)',
                                        color: 'var(--primary)',
                                        marginTop: '0.25rem'
                                    }}
                                >
                                    Read Article <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedReport && (
                <div className={styles.modalOverlay} onClick={closeReport}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleRow}>
                                <BarChart2 size={24} className={styles.modalIcon} />
                                <h3>Trend Analysis: {selectedReport.topic}</h3>
                            </div>
                            <button className={styles.closeButton} onClick={closeReport}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.chartContainer}>
                            <div className={styles.chartBars}>
                                {selectedReport.history.map((item, index) => (
                                    <div key={index} className={styles.barGroup}>
                                        <div className={styles.barWrapper}>
                                            <div
                                                className={styles.bar}
                                                style={{ height: `${Math.min(item.value, 100)}%` }}
                                            >
                                                <span className={styles.barValue}>{Number(item.value).toFixed(2)}%</span>
                                            </div>
                                        </div>
                                        <span className={styles.barLabel}>{item.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.chartAxis} />
                        </div>

                        <div className={styles.reportSummary}>
                            <p>This trend has shown <strong>{selectedReport.growth}</strong> growth in the last 12 months. The highest engagement comes from the {selectedReport.top_demographic} audience.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
