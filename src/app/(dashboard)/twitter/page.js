"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Twitter, MessageCircle, TrendingUp, Heart, X, Sparkles, BarChart2 } from 'lucide-react';
import BlogPromoCard from '@/components/BlogPromoCard';
import styles from './page.module.css';

export default function TwitterPage() {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);
    const [modalType, setModalType] = useState(null); // 'idea', 'analysis'

    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await TrendService.getPlatformTrends('twitter', timeframe);
            setTrends(data);
            setLoading(false);
        }
        fetchData();
    }, [timeframe]);

    const openModal = (trend, type) => {
        setSelectedTrend(trend);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedTrend(null);
        setModalType(null);
    };

    const getRankClass = (index) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return styles.rankOther;
    };

    const renderModalContent = () => {
        if (!selectedTrend || !modalType) return null;

        if (modalType === 'idea') {
            return (
                <div className={styles.modalBody}>
                    <div className={styles.iconWrapper}><Sparkles size={32} color="#1da1f2" /></div>
                    <h3>Idea Suggestion</h3>
                    <p className={styles.modalText}>
                        Tweet idea about "{selectedTrend.hashtag}" that can get engagement:
                    </p>
                    <div className={styles.ideaBox}>
                        "While {selectedTrend.hashtag} is being talked about this week, there's a detail that went unnoticed... 👇 (Start of Thread)"
                    </div>
                    <p className={styles.subText}>You can start a thread using this draft.</p>
                </div>
            );
        }

        if (modalType === 'sentiment') {
            const { positive, neutral, negative } = selectedTrend.sentiment || { positive: 0, neutral: 0, negative: 0 };
            return (
                <div className={styles.modalBody}>
                    <div className={styles.iconWrapper}><Heart size={32} color="#e0245e" /></div>
                    <h3>Sentiment Analysis: {selectedTrend.hashtag}</h3>
                    <p className={styles.modalText}>User feelings about this topic.</p>

                    <div className={styles.sentimentContainer}>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Positive</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${positive}%`, backgroundColor: '#17bf63' }}></div></div>
                            <span className={styles.sentimentValue}>{positive}%</span>
                        </div>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Neutral</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${neutral}%`, backgroundColor: '#FFD700' }}></div></div>
                            <span className={styles.sentimentValue}>{neutral}%</span>
                        </div>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Negative</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${negative}%`, backgroundColor: '#e0245e' }}></div></div>
                            <span className={styles.sentimentValue}>{negative}%</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (modalType === 'analysis') {
            return (
                <div className={styles.modalBody}>
                    <div className={styles.iconWrapper}><BarChart2 size={32} color="#1da1f2" /></div>
                    <h3>Trend Analysis: {selectedTrend.hashtag}</h3>
                    <p className={styles.modalText}>Interaction and volume performance for the last 12 months.</p>
                    <div className={styles.chartContainer}>
                        <div className={styles.chart}>
                            {selectedTrend.history?.map((item, idx) => (
                                <div key={idx} className={styles.barItem}>
                                    <div className={styles.barFill} style={{ height: `${(item.value / 300) * 100}%` }}>
                                        <span className={styles.tooltip}>{item.value}K</span>
                                    </div>
                                    <span className={styles.barLabel}>{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={styles.content}>
            <Header title="Twitter / X Analysis" onTimeframeChange={setTimeframe} />

            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Twitter / X Trending</h1>
                        <p>Instant hashtag analysis and tweet ideas for engagement.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Twitter size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>Live Agenda & Analysis</h3>
                        <div className={styles.tweetGrid}>
                            {loading ? <p>Loading...</p> : trends.map((trend, index) => (
                                <div key={trend.id} className={styles.tweetCard}>
                                    <div className={styles.tweetHeader}>
                                        <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.headerInfo}>
                                            <span className={styles.hashtag}>{trend.hashtag}</span>
                                            <span className={styles.volume}>{trend.volume}</span>
                                        </div>
                                    </div>
                                    <p className={styles.tweetText}>
                                        {trend.description}
                                    </p>
                                    <div className={styles.tweetActions}>
                                        <button className={styles.actionBtn} onClick={() => openModal(trend, 'idea')}>
                                            <MessageCircle size={16} /> Write Idea
                                        </button>
                                        <button className={styles.actionBtn} onClick={() => openModal(trend, 'sentiment')}>
                                            <Heart size={16} /> Sentiment
                                        </button>
                                        <button className={styles.actionBtn} onClick={() => openModal(trend, 'analysis')}>
                                            <BarChart2 size={16} /> Analyze
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Tweet Suggestions</h3>
                        <div className={styles.suggestionBox}>
                            <div className={styles.ideaList}>
                                <div className={styles.ideaItem}>
                                    <p><strong>Thread Idea:</strong> Prepare "5 Productivity Tools for Developers" thread.</p>
                                </div>
                                <div className={styles.ideaItem}>
                                    <p><strong>Poll:</strong> Ask followers "Remote or Office?".</p>
                                </div>
                                <div className={styles.ideaItem}>
                                    <p><strong>Media:</strong> Share a photo of your desk with #SetupWar tag.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedTrend && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            <X size={24} />
                        </button>
                        {renderModalContent()}
                    </div>
                </div>
            )}
            <BlogPromoCard platform="twitter" />
        </div>
    );
}
