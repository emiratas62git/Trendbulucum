"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Linkedin, Briefcase, Users, X, BarChart2 } from 'lucide-react';
import BlogPromoCard from '@/components/BlogPromoCard';
import styles from './page.module.css';

export default function LinkedinPage() {
    const [trends, setTrends] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const openReport = (trend) => {
        setSelectedReport(trend);
    };

    const closeReport = () => {
        setSelectedReport(null);
    };

    const getRankClass = (index) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return styles.rankOther;
    };

    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await TrendService.getPlatformTrends('linkedin', timeframe);
            setTrends(data);
            setLoading(false);
        }
        fetchData();
    }, [timeframe]);

    return (
        <div className={styles.content}>
            <Header title="LinkedIn Analysis" onTimeframeChange={setTimeframe} />

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
                                                style={{ height: `${item.value}%` }}
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
                            <p>This trend has shown <strong>{selectedReport.growth}</strong> growth in the last 12 months. The highest engagement comes from the {selectedReport.top_demographic} audience.</p>
                        </div>
                    </div>
                </div>
            )}
            <BlogPromoCard platform="linkedin" />
        </div>
    );
}
