"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BlogPromoCard from '@/components/BlogPromoCard';
import { TrendService } from '@/services/TrendService';
import { Video, Music, Hash, TrendingUp, X, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

export default function TiktokPage() {
    const [trends, setTrends] = useState([]);
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);

    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [trendData, musicData] = await Promise.all([
                TrendService.getPlatformTrends('tiktok', timeframe),
                TrendService.getPlatformTrends('tiktok_music')
            ]);
            setTrends(trendData);
            setMusic(musicData);
            setLoading(false);
        }
        fetchData();
    }, [timeframe]);

    const openAnalysis = (trend) => {
        setSelectedTrend(trend);
    };

    const closeAnalysis = () => {
        setSelectedTrend(null);
    };

    const getRankClass = (index) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return styles.rankOther;
    };

    return (
        <div className={styles.content}>
            <Header title="TikTok Trends" onTimeframeChange={setTimeframe} />

            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>TikTok Trends</h1>
                        <p>Viral dances, popular sounds, and rapid content ideas.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Video size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>🔥 Rising Hashtags</h3>
                        <div className={styles.cardList}>
                            {loading ? <p>Loading...</p> : trends.map((trend, index) => (
                                <div key={trend.id} className={styles.card}>
                                    <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                        {index + 1}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h4>{trend.topic}</h4>
                                        <div className={styles.meta}>
                                            <span className={styles.growth}>{trend.growth}</span>
                                            <span className={styles.vol}>{trend.volume}</span>
                                        </div>
                                    </div>
                                    <button className={styles.actionButton} onClick={() => openAnalysis(trend)}>Analyze</button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.musicSection}>
                            <h3 className={styles.sectionTitle}>🎵 Trending Sounds</h3>
                            <div className={styles.musicList}>
                                {music.map((song, index) => (
                                    <div key={song.id} className={styles.musicItem}>
                                        <div className={styles.musicRank}>{index + 1}</div>
                                        <div className={styles.musicIcon}>
                                            <Music size={20} />
                                        </div>
                                        <div className={styles.musicInfo}>
                                            <p className={styles.songTitle}>{song.title}</p>
                                            <p className={styles.artistName}>{song.artist}</p>
                                        </div>
                                        <div className={styles.musicStats}>
                                            <span className={styles.uses}>{song.uses}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Daily Ideas</h3>
                        <div className={styles.suggestionBox}>
                            <div className={styles.ideaHeader}>
                                <Hash size={20} className={styles.ideaIcon} />
                                <h4>Popular Tags</h4>
                            </div>
                            <ul className={styles.tagList}>
                                <li>#fyp</li>
                                <li>#explore</li>
                                <li>#tiktokviral</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {selectedTrend && (
                <div className={styles.modalOverlay} onClick={closeAnalysis}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeAnalysis}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalBody}>
                            <div className={styles.modalIconWrapper}>
                                <BarChart2 size={40} className={styles.modalIcon} />
                            </div>
                            <h3 className={styles.modalTitle}>Trend Analysis: {selectedTrend.topic}</h3>
                            <p className={styles.modalSubtitle}>Interaction performance for the last 12 months.</p>

                            <div className={styles.chartContainer}>
                                <div className={styles.chart}>
                                    {selectedTrend.history?.map((item, idx) => (
                                        <div key={idx} className={styles.barItem}>
                                            <div className={styles.barFill} style={{ height: `${(item.value / 100) * 100}%` }}>
                                                <span className={styles.tooltip}>{item.value}K</span>
                                            </div>
                                            <span className={styles.barLabel}>{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedTrend.generated_idea && (
                                <div className={styles.ideaBox}>
                                    <h4>💡 Content Idea:</h4>
                                    <p>"{selectedTrend.generated_idea}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <BlogPromoCard platform="tiktok" />
        </div>
    );
}
