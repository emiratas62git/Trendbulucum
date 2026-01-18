"use client";
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Video, Music, Hash, TrendingUp, X, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

export default function TiktokPage() {
    const [trends, setTrends] = useState([]);
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const [trendData, musicData] = await Promise.all([
                TrendService.getPlatformTrends('tiktok'),
                TrendService.getPlatformTrends('tiktok_music')
            ]);
            setTrends(trendData);
            setMusic(musicData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const openAnalysis = (trend) => {
        setSelectedTrend(trend);
    };

    const closeAnalysis = () => {
        setSelectedTrend(null);
    };

    // Helper to get rank class
    const getRankClass = (index) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return styles.rankOther;
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="TikTok Trendleri" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>TikTok Akımları</h1>
                            <p>Viral danslar, popüler sesler ve hızlı yayılan içerik fikirleri.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Video size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>En Çok Kullanılan Akımlar</h3>
                            <div className={styles.trendList}>
                                {loading ? <p>Veriler çekiliyor...</p> : trends.map((trend, index) => (
                                    <div key={trend.id} className={styles.trendCard}>
                                        <div className={`${styles.rankCircle} ${getRankClass(index)}`}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.trendInfo}>
                                            <h4>{trend.topic}</h4>
                                            <div className={styles.trendMeta}>
                                                <span className={styles.posts}>{trend.posts} post</span>
                                                <span className={styles.score}>Skor: {trend.trend_score}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => openAnalysis(trend)}
                                        >
                                            Analiz Et
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.musicSection}>
                                <h3 className={styles.sectionTitle}>🎶 Yükselen Müzikler</h3>
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
                            <h3 className={styles.sectionTitle}>İçerik Önerileri</h3>
                            <div className={styles.suggestionBox}>
                                <div className={styles.ideaHeader}>
                                    <TrendingUp size={20} className={styles.ideaIcon} />
                                    <h4>Viral Fırsatlar</h4>
                                </div>
                                <div className={styles.ideaList}>
                                    {trends.slice(0, 3).map(trend => (
                                        <div key={trend.id} className={styles.ideaItem}>
                                            <p>Bu sesi kullanarak {trend.topic} hakkında 15 saniyelik bir challenge videosu çek.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.suggestionBox} ${styles.marginTop}`}>
                                <div className={styles.ideaHeader}>
                                    <Hash size={20} className={styles.ideaIcon} />
                                    <h4>Popüler Etiketler</h4>
                                </div>
                                <ul className={styles.tagList}>
                                    <li>#fyp</li>
                                    <li>#kesfet</li>
                                    <li>#tiktokviral</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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
                            <h3 className={styles.modalTitle}>Trend Analizi: {selectedTrend.topic}</h3>
                            <p className={styles.modalSubtitle}>Son 12 aylık etkileşim performansı.</p>

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

                            {selectedTrend.generated_idea && (
                                <div className={styles.ideaBox}>
                                    <h4>💡 İçerik Fikri:</h4>
                                    <p>"{selectedTrend.generated_idea}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
