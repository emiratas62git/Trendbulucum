"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Linkedin, Briefcase, Users, X, BarChart2 } from 'lucide-react';
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

    useEffect(() => {
        async function fetchData() {
            const data = await TrendService.getPlatformTrends('linkedin');
            setTrends(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="LinkedIn Analiz" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>LinkedIn Gündemi</h1>
                            <p>İş dünyası trendleri, sektör analizleri ve network fırsatları.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Linkedin size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>📈 Yükselen Tartışmalar</h3>
                            <div className={styles.cardList}>
                                {loading ? <p>Yükleniyor...</p> : trends.map((trend, index) => (
                                    <div key={trend.id} className={styles.card}>
                                        <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.cardHeader}>
                                                <h4>{trend.topic}</h4>
                                                <span className={styles.industryTag}>{trend.industry}</span>
                                            </div>
                                            <div className={styles.meta}>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Büyüme</span>
                                                    <span className={styles.growth}>{trend.growth}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Etkileşim</span>
                                                    <span className={styles.metaValue}>{trend.engagement_rate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.actionButton} onClick={() => openReport(trend)}>Analiz Et</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.colRight}>
                            <h3 className={styles.sectionTitle}>Profesyonel Öneriler</h3>
                            <div className={styles.suggestionBox}>
                                <div className={styles.ideaHeader}>
                                    <Users size={20} className={styles.ideaIcon} />
                                    <h4>Network Fırsatları</h4>
                                </div>
                                <ul className={styles.list}>
                                    <li>AI Konferansları (Q3)</li>
                                    <li>Remote Çalışma Webinar'ları</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {selectedReport && (
                <div className={styles.modalOverlay} onClick={closeReport}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleRow}>
                                <BarChart2 size={24} className={styles.modalIcon} />
                                <h3>Trend Analizi: {selectedReport.topic}</h3>
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
                            <p>Bu trend son 12 ayda <strong>{selectedReport.growth}</strong> büyüme gösterdi. En yüksek etkileşim {selectedReport.top_demographic} kitlesinden geliyor.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
