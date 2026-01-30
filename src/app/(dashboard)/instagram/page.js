"use client";
import Header from '@/components/Header';
import { Instagram, Image as ImageIcon, Film, X, TrendingUp, BarChart2 } from 'lucide-react';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { TrendService } from '@/services/TrendService';
import BlogPromoCard from '@/components/BlogPromoCard';

export default function InstagramPage() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const openReport = (trend) => {
        setSelectedReport(trend);
    };

    const closeReport = () => {
        setSelectedReport(null);
    };

    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            const data = await TrendService.getPlatformTrends('instagram_categories', timeframe);
            setCategories(data);
            setLoading(false);
        }
        fetchCategories();
    }, [timeframe]);

    // Static data for ideas since simpler
    const storyIdeas = [
        "Morning routine poll: 'Early bird vs Night Owl'",
        "Office/Workspace 'This/That' choice",
        "Start a follower Q&A session",
        "Weekly goal sharing template"
    ];

    return (
        <div className={styles.content}>
            <Header title="Instagram Analysis" onTimeframeChange={setTimeframe} />

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
                                                style={{ height: `${item.value}%` }}
                                                title={`${item.value}%`}
                                            >
                                                <span className={styles.barValue}>{item.value}%</span>
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
                </div>
            )}
            <BlogPromoCard platform="instagram" />
        </div>
    );
}
