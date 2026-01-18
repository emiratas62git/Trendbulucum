"use client";
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { TrendingUp, Activity, Award, Hash } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './Dashboard.module.css';

export default function Home() {
    const [trends, setTrends] = useState(null);
    const [platformIdeas, setPlatformIdeas] = useState({});
    const [loading, setLoading] = useState(true);
    const { isPlatformVisible, visiblePlatforms, reorderPlatforms } = useDashboard();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await TrendService.getAllTrends();
                setTrends(data);

                const platforms = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'];
                const ideas = {};
                for (const p of platforms) {
                    ideas[p] = await TrendService.getContentIdeas(p);
                }
                setPlatformIdeas(ideas);

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("platformIndex", index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, newIndex) => {
        e.preventDefault();
        const oldIndex = parseInt(e.dataTransfer.getData("platformIndex"));
        if (oldIndex === newIndex) return;

        const newOrder = [...visiblePlatforms];
        const [movedItem] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, movedItem);

        reorderPlatforms(newOrder);
    };

    const renderPlatformCard = (platform) => {
        if (!trends) return null;

        const ideas = platformIdeas[platform] || [];
        const IdeasSection = () => (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    💡 {platform.charAt(0).toUpperCase() + platform.slice(1)} İçerik Önerileri
                </h4>
                <div className={styles.ideasGrid}>
                    {ideas.map(idea => (
                        <div key={idea.id} className={styles.ideaCard}>
                            <div className={styles.ideaTitle}>{idea.title}</div>
                            <div className={styles.ideaDesc}>{idea.desc}</div>
                            <div className={styles.ideaMeta}>{idea.difficulty}</div>
                        </div>
                    ))}
                </div>
            </div>
        );

        switch (platform) {
            case 'youtube':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>YouTube Trendleri</h3>
                            <span className={styles.badge}>Canlı</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.youtube?.slice(0, 3).map(item => {
                                const isPositive = item.growth?.includes('+');
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.trendTitle}>{item.title}</span>
                                            <span className={styles.trendCategory}>{item.category}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.views}>{item.views}</span>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {item.growth}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            case 'tiktok':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>TikTok Akımları</h3>
                            <span className={styles.badge}>Viral</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.tiktok?.slice(0, 3).map(item => {
                                let growthText = "+0%";
                                let isPositive = true;
                                if (item.history && item.history.length >= 2) {
                                    const last = item.history[item.history.length - 1].value;
                                    const prev = item.history[item.history.length - 2].value;
                                    const diff = ((last - prev) / prev) * 100;
                                    isPositive = diff >= 0;
                                    growthText = (diff > 0 ? '+' : '') + Math.round(diff) + '%';
                                }
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.topic}>{item.topic}</span>
                                            <span className={styles.trendCategory}>Score: {item.trend_score}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.posts}>{item.posts}</span>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {growthText}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            case 'twitter':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Twitter / X Trendleri</h3>
                            <span className={styles.badge}>Hashtag</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.twitter?.slice(0, 3).map(item => {
                                const isPositive = true;
                                const growthText = "+15%";
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.trendTitle}>{item.hashtag}</span>
                                            <span className={styles.trendCategory}>{item.volume}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {growthText}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            case 'instagram':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Instagram Trendleri</h3>
                            <span className={styles.badge}>Reels</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.instagram?.slice(0, 3).map(item => {
                                const isPositive = true;
                                const growthText = "+10%";
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.trendTitle}>{item.title}</span>
                                            <span className={styles.trendCategory}>{item.type}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.views}>{item.views || item.interactions}</span>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {growthText}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            case 'linkedin':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>LinkedIn Gündemi</h3>
                            <span className={styles.badge}>Profesyonel</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.linkedin?.slice(0, 3).map(item => {
                                const isPositive = item.growth?.includes('+');
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.trendTitle}>{item.topic}</span>
                                            <span className={styles.trendCategory}>{item.industry}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {item.growth}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            case 'pinterest':
                return (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Pinterest Trendleri</h3>
                            <span className={styles.badge}>İlham</span>
                        </div>
                        <ul className={styles.trendList}>
                            {trends?.pinterest?.slice(0, 3).map(item => {
                                const isPositive = item.impression_growth?.includes('+');
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.trendTitle}>{item.topic}</span>
                                            <span className={styles.trendCategory}>{item.category}</span>
                                        </div>
                                        <div className={styles.trendMetas}>
                                            <span className={styles.growth} style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                                                {item.impression_growth}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <IdeasSection />
                    </div>
                );
            default:
                return (
                    <div className={styles.card}>
                        <h3>{platform}</h3>
                    </div>
                );
        }
    };


    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="Trend Kontrol Paneli" />

                <div className={styles.content}>
                    <div className={styles.statsGrid}>
                        <div className={`${styles.card} ${styles.statCard}`}>
                            <div className={styles.iconBox} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4>Toplam Analiz</h4>
                                <p className={styles.statValue}>12,450</p>
                                <div className={styles.statTrend} style={{ color: 'var(--success)' }}>+12% artış</div>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.statCard}`}>
                            <div className={styles.iconBox} style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)' }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <h4>Viral Potansiyel</h4>
                                <p className={styles.statValue}>Yüksek</p>
                                <div className={styles.statTrend}>Son 24 saat</div>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.statCard}`}>
                            <div className={styles.iconBox} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <h4>En İyi Kategori</h4>
                                <p className={styles.statValue}>Teknoloji</p>
                                <div className={styles.statTrend}>2.4M etkileşim</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.layoutGrid}>
                        <div className={styles.mainColumn}>
                            <h3 className={styles.sectionTitle}>Platform Özetleri</h3>
                            <div className={styles.trendsGrid}>
                                {loading ? (
                                    <p>Veriler yükleniyor...</p>
                                ) : (
                                    <>
                                        {/* Static Full Width Hashtags Section (MOVED TO TOP) */}
                                        <div className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <h3>🔥 Popüler Etiketler</h3>
                                            </div>
                                            <ul className={styles.hashtagList}>
                                                {trends?.hashtags?.map((tag) => {
                                                    const isPositive = tag.growth?.includes('+');
                                                    return (
                                                        <li key={tag.id} className={styles.hashtagItem}>
                                                            <div className={styles.tagInfo}>
                                                                <Hash size={14} className={styles.tagIcon} />
                                                                <span>{tag.tag}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                                <span className={styles.tagVolume}>{tag.volume}</span>
                                                                <span style={{ color: isPositive ? '#22c55e' : '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                                    {tag.growth}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>

                                        {/* Draggable Platform Cards */}
                                        {visiblePlatforms.map((platform, index) => (
                                            <div
                                                key={platform}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDrop={(e) => handleDrop(e, index)}
                                                style={{ cursor: 'move' }}
                                            >
                                                {renderPlatformCard(platform)}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
