"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Pin, Palette, TrendingUp, X, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

export default function PinterestPage() {
    const [trends, setTrends] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

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
            const [trendsData, colorsData] = await Promise.all([
                TrendService.getPlatformTrends('pinterest'),
                TrendService.getPlatformTrends('pinterest_colors')
            ]);
            setTrends(trendsData);
            setColors(colorsData);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="Pinterest Analiz" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>Pinterest Panosu</h1>
                            <p>Görsel ilhamlar, dekorasyon trendleri ve estetik fikirler.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Pin size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>📌 Popüler Pinler</h3>
                            <div className={styles.cardList}>
                                {loading ? <p>Yükleniyor...</p> : trends.map((trend, index) => (
                                    <div key={trend.id} className={styles.card}>
                                        <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.cardHeader}>
                                                <h4>{trend.topic}</h4>
                                                <span className={styles.dateTag}>{trend.category}</span>
                                            </div>
                                            <div className={styles.meta}>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Kaydedilme</span>
                                                    <span className={styles.metaValue}>{trend.saves}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Pin Sayısı</span>
                                                    <span className={styles.metaValue}>{trend.pins}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Büyüme</span>
                                                    <span className={styles.growth}>{trend.impression_growth}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.actionButton} onClick={() => openReport(trend)}>Analiz Et</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.colRight}>
                            <h3 className={styles.sectionTitle}>Renk Trendleri</h3>
                            <div className={styles.suggestionBox}>
                                <div className={styles.ideaHeader}>
                                    <TrendingUp size={20} className={styles.ideaIcon} />
                                    <h4>Sezonun Renkleri</h4>
                                </div>
                                <div className={styles.colorPalette}>
                                    {colors.map((color, idx) => (
                                        <div key={idx} className={styles.colorItem}>
                                            <div className={styles.colorExample} style={{ background: color.hex }}></div>
                                            <div className={styles.colorInfo}>
                                                <span className={styles.colorName}>{color.name}</span>
                                                <span className={styles.colorHex}>{color.hex}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                            <p>Bu trendin son 12 aylık izlenim büyümesi <strong>{selectedReport.impression_growth}</strong>. En çok {selectedReport.category} kategorisinde etkileşim alıyor.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
