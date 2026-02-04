"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Youtube, PlayCircle, TrendingUp, Lightbulb, Music, X, BarChart2, BookOpen, ArrowRight } from 'lucide-react';
import { TrendService } from '@/services/TrendService';
import styles from './page.module.css';

export default function YoutubePage() {
    const [trends, setTrends] = useState([]);
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);

    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [trendData, musicData] = await Promise.all([
                TrendService.getPlatformTrends('youtube', timeframe),
                TrendService.getPlatformTrends('youtube_music')
            ]);
            setTrends(trendData);
            setMusic(musicData);
            setLoading(false);
        }
        fetchData();
    }, [timeframe]);

    const openReport = (trend) => {
        setSelectedTrend(trend);
    };

    const closeReport = () => {
        setSelectedTrend(null);
    };

    return (
        <div className={styles.content}>
            <Header title="YouTube Analysis" onTimeframeChange={setTimeframe} />

            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>YouTube Trends</h1>
                        <p>Viral video ideas and channel growth strategies.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <Youtube size={64} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <h3 className={styles.sectionTitle}>Rising Videos</h3>
                        <div className={styles.videoList}>
                            {loading ? <p>Loading...</p> : trends.map((trend, idx) => (
                                <div key={trend.id} className={styles.videoCard}>
                                    <div className={styles.videoIcon}>
                                        <span className={styles.rank}>#{idx + 1}</span>
                                    </div>
                                    <div className={styles.videoInfo}>
                                        <h4>{trend.title}</h4>
                                        <div className={styles.videoMeta}>
                                            <span className={styles.views}>{trend.views} views</span>
                                            <span className={styles.growth}>{trend.growth}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => openReport(trend)}
                                    >
                                        Analyze
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.musicSection}>
                            <h3 className={styles.sectionTitle}>🎶 Trending Songs</h3>
                            <div className={styles.musicList}>
                                {music.map((song, index) => (
                                    <div key={song.id} className={styles.musicItem}>
                                        <div className={styles.musicRank}>{index + 1}</div>
                                        <div className={styles.musicIconBox}>
                                            <Music size={20} />
                                        </div>
                                        <div className={styles.musicInfo}>
                                            <p className={styles.songTitle}>{song.title}</p>
                                            <p className={styles.artistName}>{song.artist}</p>
                                        </div>
                                        <div className={styles.musicStats}>
                                            <span className={styles.usesLabel}>{song.uses}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.colRight}>
                        <h3 className={styles.sectionTitle}>Content Suggestions</h3>
                        <div className={styles.suggestionBox}>
                            <div className={styles.ideaHeader}>
                                <Lightbulb size={20} className={styles.ideaIcon} />
                                <h4>Chosen for You</h4>
                            </div>
                            <div className={styles.ideaList}>
                                {loading ? <p>Analyzing...</p> : trends.slice(0, 3).map((trend) => (
                                    <div key={trend.id} className={styles.ideaItem}>
                                        <p>{TrendService.generateIdea(trend)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.suggestionBox} ${styles.marginTop}`}>
                            <div className={styles.ideaHeader}>
                                <TrendingUp size={20} className={styles.ideaIcon} />
                                <h4>Category Opportunities</h4>
                            </div>
                            <ul className={styles.categoryList}>
                                <li>Technology: AI Tools</li>
                                <li>Gaming: Minecraft Mods</li>
                                <li>Education: Personal Development</li>
                            </ul>
                        </div>

                        <div className={`${styles.suggestionBox} ${styles.marginTop}`} style={{ marginTop: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <div className={styles.ideaHeader}>
                                <BookOpen size={20} className={styles.ideaIcon} style={{ color: '#ef4444' }} />
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
                                    Learn how to master YouTube algorithms and grow your channel.
                                </p>
                                <Link
                                    href="/blog/youtube-shorts-trends"
                                    className={styles.actionButton}
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        display: 'block',
                                        textDecoration: 'none',
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid #ef4444',
                                        color: '#ef4444',
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
                <div className={styles.modalOverlay} onClick={closeReport}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeReport}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalBody}>
                            <div className={styles.modalIconWrapper}>
                                <BarChart2 size={40} className={styles.modalIcon} />
                            </div>
                            <h3 className={styles.modalTitle}>Trend Analysis: {selectedTrend.title}</h3>
                            <p className={styles.modalSubtitle}>View performance and growth chart for the last 12 months.</p>

                            <div className={styles.chartContainer}>
                                <div className={styles.chart}>
                                    {selectedTrend.history?.map((item, idx) => (
                                        <div key={idx} className={styles.barItem}>
                                            <div className={styles.barFill} style={{ height: `${item.value}%` }}>
                                                <span className={styles.tooltip}>{item.value}K</span>
                                            </div>
                                            <span className={styles.barLabel}>{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.statBox}>
                                <div>
                                    <span className={styles.statLabel}>Total Views</span>
                                    <span className={styles.statValue}>{selectedTrend.views}</span>
                                </div>
                                <div className={styles.divider}></div>
                                <div>
                                    <span className={styles.statLabel}>Growth</span>
                                    <span className={styles.statValueGrowth}>{selectedTrend.growth}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
