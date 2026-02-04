"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Video, Music, Hash, TrendingUp, X, BarChart2, BookOpen, ArrowRight } from 'lucide-react';
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
        <>
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
                        <div className={styles.videoList}>
                            {loading ? <p>Loading...</p> : trends.map((trend, index) => (
                                <div key={trend.id} className={styles.videoCard}>
                                    <div className={styles.videoIcon}>
                                        <span className={styles.rank}>#{index + 1}</span>
                                    </div>
                                    <div className={styles.videoInfo}>
                                        <h4>{trend.topic}</h4>
                                        <div className={styles.videoMeta}>
                                            <span className={styles.views}>{trend.volume}</span>
                                            <span className={styles.growth}>{trend.growth}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => openAnalysis(trend)}
                                    >
                                        Analyze
                                    </button>
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

                        <div className={`${styles.suggestionBox} ${styles.marginTop}`} style={{ marginTop: '1.5rem', borderColor: 'rgba(217, 70, 239, 0.2)' }}>
                            <div className={styles.ideaHeader}>
                                <BookOpen size={20} className={styles.ideaIcon} style={{ color: '#d946ef' }} />
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
                                    Learn how to master TikTok algorithms and go viral.
                                </p>
                                <Link
                                    href="/blog/finding-tiktok-trends?from=tiktok"
                                    className={styles.actionButton}
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        display: 'block',
                                        textDecoration: 'none',
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid #d946ef',
                                        color: '#d946ef',
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
        </>
    );
}
