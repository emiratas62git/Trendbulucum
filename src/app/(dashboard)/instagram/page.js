"use client";
import Link from 'next/link';
import { Instagram, Image as ImageIcon, Film, X, TrendingUp, BarChart2, BookOpen, ArrowRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { TrendService } from '@/services/TrendService';

export default function InstagramPage() {
    const { timeframe, setActiveColor } = useDashboard();
    const [selectedReport, setSelectedReport] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const openReport = (trend) => {
        setSelectedReport(trend);
    };

    const closeReport = () => {
        setSelectedReport(null);
    };


    useEffect(() => {
        setActiveColor('#D62976'); // Instagram Pink
        async function fetchCategories() {
            setLoading(true);
            const data = await TrendService.getPlatformTrends('instagram_categories', timeframe);
            setCategories(data);
            setLoading(false);
        }
        fetchCategories();
    }, [timeframe, setActiveColor]);

    // Static data for ideas since simpler
    const storyIdeas = [
        "Morning routine poll: 'Early bird vs Night Owl'",
        "Office/Workspace 'This/That' choice",
        "Start a follower Q&A session",
        "Weekly goal sharing template"
    ];

    return (
        <>
            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Instagram Trends</h1>
                        <p>Most popular templates for Reels, Story, and Explore.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Instagram size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>🔥 Trend Reels Templates</h3>
                        <div className={styles.cardList}>
                            <div className={styles.card}>
                                <div className={styles.iconBox}>
                                    <Film size={24} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <h4>"Day in My Life" Transitions</h4>
                                    <div className={styles.meta}>
                                        <span className={styles.metaText}>Aesthetic Jazz</span>
                                        <span className={styles.growth}>+45% increase</span>
                                    </div>
                                </div>
                                <button className={styles.actionButton} onClick={() => openReport({
                                    topic: '"Day in My Life" Transitions',
                                    history: [
                                        { month: 'Jan', value: 20 }, { month: 'Feb', value: 30 }, { month: 'Mar', value: 45 },
                                        { month: 'Apr', value: 60 }, { month: 'May', value: 80 }, { month: 'Jun', value: 95 },
                                        { month: 'Jul', value: 100 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 75 },
                                        { month: 'Oct', value: 60 }, { month: 'Nov', value: 50 }, { month: 'Dec', value: 40 }
                                    ]
                                })}>Report</button>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconBox}>
                                    <ImageIcon size={24} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <h4>Photo Dump Ranking</h4>
                                    <div className={styles.meta}>
                                        <span className={styles.metaText}>Weekly Summary</span>
                                        <span className={styles.growth}>Viral</span>
                                    </div>
                                </div>
                                <button className={styles.actionButton} onClick={() => openReport({
                                    topic: 'Photo Dump Ranking',
                                    history: [
                                        { month: 'Jan', value: 40 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 50 },
                                        { month: 'Apr', value: 55 }, { month: 'May', value: 60 }, { month: 'Jun', value: 65 },
                                        { month: 'Jul', value: 70 }, { month: 'Aug', value: 80 }, { month: 'Sep', value: 85 },
                                        { month: 'Oct', value: 90 }, { month: 'Nov', value: 95 }, { month: 'Dec', value: 100 }
                                    ]
                                })}>Report</button>
                            </div>
                        </div>

                        <h3 className={`${styles.sectionTitle} ${styles.marginTop}`}>Story Ideas</h3>
                        <div className={styles.textListContainer}>
                            {storyIdeas.map((idea, idx) => (
                                <div key={idx} className={styles.textListItem}>
                                    <TrendingUp size={16} className={styles.listIcon} />
                                    <span>{idea}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Content Suggestions</h3>
                        <div className={styles.suggestionBox}>
                            <h4>Category Opportunities</h4>
                            <div className={styles.trendList}>
                                {loading ? <p>Loading...</p> : categories.map((cat, index) => (
                                    <div key={cat.id} className={styles.trendItem}>
                                        <div className={`${styles.rankCircle} ${styles[`rank${index + 1}`] || styles.rankOther}`}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.topicText}>
                                                <strong>{cat.category}:</strong> {cat.topic}
                                            </span>
                                        </div>
                                        <button
                                            className={styles.miniReportBtn}
                                            onClick={() => openReport(cat)}
                                            title="Analysis Report"
                                        >
                                            <BarChart2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.suggestionBox} ${styles.marginTop}`} style={{ marginTop: '1.5rem', borderColor: 'rgba(214, 41, 118, 0.2)' }}>
                            <div className={styles.ideaHeader}>
                                <BookOpen size={20} className={styles.ideaIcon} style={{ color: '#d62976' }} />
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
                                    Learn how to master Instagram Reels algorithms.
                                </p>
                                <Link
                                    href="/blog/instagram-reels-rising-types?from=instagram"
                                    className={styles.actionButton}
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        display: 'block',
                                        textDecoration: 'none',
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid #d62976',
                                        color: '#d62976',
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
                            <h3>Trend Report: {selectedReport.category ? `${selectedReport.category} - ${selectedReport.topic}` : selectedReport.topic}</h3>
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
                                                title={`${item.value}%`}
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
                        <p>Yearly performance analysis for this trend.</p>
                    </div>
                </div>
                </div >
            )
}
        </>
    );
}
