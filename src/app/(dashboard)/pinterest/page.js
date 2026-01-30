"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Pin, Palette, TrendingUp, X, BarChart2 } from 'lucide-react';
import BlogPromoCard from '@/components/BlogPromoCard';
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


    const [timeframe, setTimeframe] = useState('monthly');
    const [copiedColor, setCopiedColor] = useState(null);

    const handleCopyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [trendsData, colorsData] = await Promise.all([
                TrendService.getPlatformTrends('pinterest', timeframe),
                TrendService.getPlatformTrends('pinterest_colors', timeframe)
            ]);
            setTrends(trendsData);
            setColors(colorsData);
            setLoading(false);
        }
        fetchData();
    }, [timeframe]);

    return (
        <div className={styles.content}>
            <Header title="Pinterest Analysis" onTimeframeChange={setTimeframe} />

            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Pinterest Board</h1>
                        <p>Visual inspiration, decoration trends, and aesthetic ideas.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Pin size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>📌 Popular Pins</h3>
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
                                                <span className={styles.metaLabel}>Saves</span>
                                                <span className={styles.metaValue}>{trend.saves}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaLabel}>Pin Count</span>
                                                <span className={styles.metaValue}>{trend.pins}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaLabel}>Growth</span>
                                                <span className={styles.growth}>{trend.impression_growth}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <span className={styles.dateTag}>{trend.category}</span>
                                        <button className={styles.actionButton} onClick={() => openReport(trend)}>Analyze</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Color Trends</h3>
                        <div className={styles.suggestionBox}>
                            <div className={styles.ideaHeader}>
                                <TrendingUp size={20} className={styles.ideaIcon} />
                                <h4>Colors of the Season</h4>
                            </div>
                            <div className={styles.colorPalette}>
                                {colors.map((color, idx) => (
                                    <div key={idx} className={styles.colorItem}>
                                        <div className={styles.colorExample} style={{ background: color.hex }}></div>
                                        <div className={styles.colorInfo}>
                                            <span className={styles.colorName}>{color.name}</span>
                                            <span className={styles.colorHex}>{color.hex}</span>
                                        </div>
                                        <button
                                            className={styles.copyButton}
                                            style={{ backgroundColor: color.hex }}
                                            onClick={() => handleCopyColor(color.hex)}
                                            title="Copy color code"
                                        >
                                            {copiedColor === color.hex ? '✓ Copied!' : 'Copy Color'}
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
                            <p>This trend's impression growth in the last 12 months is <strong>{selectedReport.impression_growth}</strong>. It receives the most engagement in the {selectedReport.category} category.</p>
                        </div>
                    </div>
                </div>
            )}
            <BlogPromoCard platform="pinterest" />
        </div>
    );
}
