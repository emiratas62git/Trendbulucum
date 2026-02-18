"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { TrendingUp, Activity, Award, Hash } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import styles from './Dashboard.module.css';

export default function Home() {
    const [trends, setTrends] = useState(null);
    const [dailyHighlights, setDailyHighlights] = useState([]);
    const [weeklyHighlights, setWeeklyHighlights] = useState([]);
    const [platformIdeas, setPlatformIdeas] = useState({});
    const [loading, setLoading] = useState(true);
    const { isPlatformVisible, visiblePlatforms, reorderPlatforms, searchQuery, timeframe } = useDashboard();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const results = await Promise.allSettled([
                    TrendService.getAllTrends(timeframe),
                    TrendService.getTimeframeHighlights('daily'),
                    TrendService.getTimeframeHighlights('weekly')
                ]);

                // Handle results safely
                if (results[0].status === 'fulfilled') setTrends(results[0].value);
                if (results[1].status === 'fulfilled') setDailyHighlights(results[1].value);
                if (results[2].status === 'fulfilled') setWeeklyHighlights(results[2].value);

                // Fetch ideas for all platforms
                const platforms = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'];
                const ideas = {};

                await Promise.all(platforms.map(async (p) => {
                    try {
                        ideas[p] = await TrendService.getContentIdeas(p);
                    } catch (e) {
                        ideas[p] = [];
                    }
                }));

                setPlatformIdeas(ideas);

            } catch (error) {
                console.error("Dashboard critical error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [timeframe]);

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

        const q = (searchQuery || '').toLowerCase().trim();
        const rawItems = trends[platform] || [];

        // Filter items based on searchQuery
        const filteredItems = q.length < 2 ? rawItems.slice(0, 3) : rawItems.filter(item => {
            const text = (item.title || item.topic || item.hashtag || item.category || '').toLowerCase();
            return text.includes(q);
        });

        // If searching and no results in this platform, don't show the card? 
        // Or show a "No results" message if searching.
        if (q.length >= 2 && filteredItems.length === 0) return null;

        const ideas = platformIdeas[platform] || [];
        const IdeasSection = () => (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    💡 {platform.charAt(0).toUpperCase() + platform.slice(1)} Content Suggestions
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
                            <h3>YouTube Trends</h3>
                            <span className={styles.badge}>Live</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
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
                            <h3>TikTok Trends</h3>
                            <span className={styles.badge}>Viral</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
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
                            <h3>Twitter / X Trends</h3>
                            <span className={styles.badge}>Hashtag</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
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
                            <h3>Instagram Trends</h3>
                            <span className={styles.badge}>Reels</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
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
                            <h3>LinkedIn Trending</h3>
                            <span className={styles.badge}>Professional</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
                                const isPositive = item.growth?.includes('+');
                                return (
                                    <li key={item.id} className={styles.trendItem}>
                                        <div className={styles.trendInfo}>
                                            <span className={styles.topic}>{item.topic}</span>
                                            <span className={styles.industry}>{item.industry}</span>
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
                            <h3>Pinterest Trends</h3>
                            <span className={styles.badge}>Inspiration</span>
                        </div>
                        <ul className={styles.trendList}>
                            {filteredItems.map(item => {
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
        <div className={styles.content}>
            <div className={styles.statsGrid}>
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.iconBox} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h4>Total Analytics</h4>
                        <p className={styles.statValue}>12,450</p>
                        <div className={styles.statTrend} style={{ color: 'var(--success)' }}>+12% increase</div>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.iconBox} style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <h4>Viral Potential</h4>
                        <p className={styles.statValue}>High</p>
                        <div className={styles.statTrend}>Last 24 hours</div>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.iconBox} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <Award size={24} />
                    </div>
                    <div>
                        <h4>Top Category</h4>
                        <p className={styles.statValue}>Technology</p>
                        <div className={styles.statTrend}>2.4M interactions</div>
                    </div>
                </div>

                <a href="/blog" target="_blank" className={`${styles.card} ${styles.statCard} ${styles.blogCard}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div className={styles.iconBox} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <Hash size={24} />
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Read Our Blog</h4>
                        <p className={styles.statValue} style={{ fontSize: '1.2rem' }}>Expert Insights</p>
                        <div className={styles.statTrend}>Click to open separate page</div>
                    </div>
                </a>
            </div>

            <div className={styles.layoutGrid}>
                <div className={styles.mainColumn}>
                    <h3 className={styles.sectionTitle}>Platform Summaries</h3>
                    <div className={styles.trendsGrid}>
                        {loading ? (
                            <p>Loading data...</p>
                        ) : (
                            <>
                                {/* Static Full Width Hashtags Section (MOVED TO TOP) */}
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3>🔥 Popular Tags</h3>
                                    </div>
                                    <ul className={styles.hashtagList}>
                                        {trends?.hashtags?.map((tag) => {
                                            const isPositive = tag.growth?.includes('+');
                                            return (
                                                <li key={tag.id} className={styles.hashtagItem}>
                                                    <div className={styles.tagInfo}>
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

                                {/* Summary Highlights Section (STATIC) */}
                                <div className={styles.summarySection}>
                                    <h3 className={styles.sectionTitle}>Summary Highlights</h3>
                                    <div className={styles.highlightsGrid}>
                                        <div className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <h3>🚀 Last 24 Hours</h3>
                                                <span className={styles.badge}>Live</span>
                                            </div>
                                            <div className={styles.highlightsList}>
                                                {dailyHighlights.map((item, idx) => (
                                                    <div key={idx} className={styles.highlightItem}>
                                                        <div className={`${styles.platformDot} ${styles[item.platform]}`}></div>
                                                        <div className={styles.highlightInfo}>
                                                            <span className={styles.highlightTitle}>{item.title || item.topic || item.hashtag}</span>
                                                            <span className={styles.highlightValue}>{item.displayValue}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <h3>📅 Last 7 Days</h3>
                                                <span className={styles.badge}>Weekly</span>
                                            </div>
                                            <div className={styles.highlightsList}>
                                                {weeklyHighlights.map((item, idx) => (
                                                    <div key={idx} className={styles.highlightItem}>
                                                        <div className={`${styles.platformDot} ${styles[item.platform]}`}></div>
                                                        <div className={styles.highlightInfo}>
                                                            <span className={styles.highlightTitle}>{item.title || item.topic || item.hashtag}</span>
                                                            <span className={styles.highlightValue}>{item.displayValue}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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
    );
}
