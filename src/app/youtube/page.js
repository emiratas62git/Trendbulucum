"use client";
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Youtube, PlayCircle, TrendingUp, Lightbulb, Music, X, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

export default function YoutubePage() {
    const [trends, setTrends] = useState([]);
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const [trendData, musicData] = await Promise.all([
                TrendService.getPlatformTrends('youtube'),
                TrendService.getPlatformTrends('youtube_music')
            ]);
            setTrends(trendData);
            setMusic(musicData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const openReport = (trend) => {
        setSelectedTrend(trend);
    };

    const closeReport = () => {
        setSelectedTrend(null);
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="YouTube Analiz" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>YouTube Trendleri</h1>
                            <p>Viral video fikirleri ve kanal büyüme stratejileri.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Youtube size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>Yükselen Videolar</h3>
                            <div className={styles.videoList}>
                                {loading ? <p>Yükleniyor...</p> : trends.map((trend, idx) => (
                                    <div key={trend.id} className={styles.videoCard}>
                                        <div className={styles.videoIcon}>
                                            <span className={styles.rank}>#{idx + 1}</span>
                                        </div>
                                        <div className={styles.videoInfo}>
                                            <h4>{trend.title}</h4>
                                            <div className={styles.videoMeta}>
                                                <span className={styles.views}>{trend.views} görüntülenme</span>
                                                <span className={styles.growth}>{trend.growth}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => openReport(trend)}
                                        >
                                            Analiz Et
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.musicSection}>
                                <h3 className={styles.sectionTitle}>🎶 Trend Şarkılar</h3>
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
                                    <Lightbulb size={20} className={styles.ideaIcon} />
                                    <h4>Sizin için Seçilenler</h4>
                                </div>
                                <div className={styles.ideaList}>
                                    {loading ? <p>Analiz ediliyor...</p> : trends.slice(0, 3).map((trend) => (
                                        <div key={trend.id} className={styles.ideaItem}>
                                            <p>{TrendService.generateIdea(trend)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.suggestionBox} ${styles.marginTop}`}>
                                <div className={styles.ideaHeader}>
                                    <TrendingUp size={20} className={styles.ideaIcon} />
                                    <h4>Kategori Fırsatları</h4>
                                </div>
                                <ul className={styles.categoryList}>
                                    <li>Teknoloji: Yapay Zeka Araçları</li>
                                    <li>Oyun: Minecraft Mods</li>
                                    <li>Eğitim: Kişisel Gelişim</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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
                            <h3 className={styles.modalTitle}>Trend Analizi: {selectedTrend.title}</h3>
                            <p className={styles.modalSubtitle}>Son 12 aylık izlenme performansı ve değişim grafiği.</p>

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
                                    <span className={styles.statLabel}>Toplam İzlenme</span>
                                    <span className={styles.statValue}>{selectedTrend.views}</span>
                                </div>
                                <div className={styles.divider}></div>
                                <div>
                                    <span className={styles.statLabel}>Büyüme</span>
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
