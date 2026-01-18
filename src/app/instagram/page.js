"use client";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Instagram, Image as ImageIcon, Film, X, TrendingUp, BarChart2 } from 'lucide-react';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { TrendService } from '@/services/TrendService';

export default function InstagramPage() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const openReport = (trend) => {
        setSelectedReport(trend);
    };

    const closeReport = () => {
        setSelectedReport(null);
    };

    useEffect(() => {
        async function fetchCategories() {
            const data = await TrendService.getPlatformTrends('instagram_categories');
            setCategories(data);
            setLoading(false);
        }
        fetchCategories();
    }, []);

    // Static data for ideas since simpler
    const storyIdeas = [
        "Sabah rutini anketi: 'Erken kalkmak vs Gece Kuşu'",
        "Ofis/Çalışma alanı 'Bunu/Şunu' seçimi",
        "Takipçi Soru-Cevap etkinliği başlat",
        "Haftalık hedef paylaşımı şablonu"
    ];

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="Instagram Analiz" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>Instagram Trendleri</h1>
                            <p>Reels, Story ve Keşfet için en popüler şablonlar.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Instagram size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>🔥 Trend Reels Şablonları</h3>
                            <div className={styles.cardList}>
                                <div className={styles.card}>
                                    <div className={styles.iconBox}>
                                        <Film size={24} />
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h4>"Day in My Life" Geçişleri</h4>
                                        <div className={styles.meta}>
                                            <span className={styles.metaText}>Aesthetic Jazz</span>
                                            <span className={styles.growth}>+45% artış</span>
                                        </div>
                                    </div>
                                    <button className={styles.actionButton} onClick={() => openReport({
                                        topic: '"Day in My Life" Geçişleri',
                                        history: [
                                            { month: 'Oca', value: 20 }, { month: 'Şub', value: 30 }, { month: 'Mar', value: 45 },
                                            { month: 'Nis', value: 60 }, { month: 'May', value: 80 }, { month: 'Haz', value: 95 },
                                            { month: 'Tem', value: 100 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 75 },
                                            { month: 'Eki', value: 60 }, { month: 'Kas', value: 50 }, { month: 'Ara', value: 40 }
                                        ]
                                    })}>Rapor</button>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.iconBox}>
                                        <ImageIcon size={24} />
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h4>Photo Dump Sıralaması</h4>
                                        <div className={styles.meta}>
                                            <span className={styles.metaText}>Haftalık Özet</span>
                                            <span className={styles.growth}>Viral</span>
                                        </div>
                                    </div>
                                    <button className={styles.actionButton} onClick={() => openReport({
                                        topic: 'Photo Dump Sıralaması',
                                        history: [
                                            { month: 'Oca', value: 40 }, { month: 'Şub', value: 45 }, { month: 'Mar', value: 50 },
                                            { month: 'Nis', value: 55 }, { month: 'May', value: 60 }, { month: 'Haz', value: 65 },
                                            { month: 'Tem', value: 70 }, { month: 'Ağu', value: 80 }, { month: 'Eyl', value: 85 },
                                            { month: 'Eki', value: 90 }, { month: 'Kas', value: 95 }, { month: 'Ara', value: 100 }
                                        ]
                                    })}>Rapor</button>
                                </div>
                            </div>

                            <h3 className={`${styles.sectionTitle} ${styles.marginTop}`}>Hikaye Fikirleri</h3>
                            <div className={styles.textListContainer}>
                                {storyIdeas.map((idea, idx) => (
                                    <div key={idx} className={styles.textListItem}>
                                        <TrendingUp size={16} className={styles.listIcon} />
                                        <span>{idea}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.colRight}>
                            <h3 className={styles.sectionTitle}>İçerik Önerileri</h3>
                            <div className={styles.suggestionBox}>
                                <h4>Kategori Fırsatları</h4>
                                <div className={styles.trendList}>
                                    {loading ? <p>Yükleniyor...</p> : categories.map((cat, index) => (
                                        <div key={cat.id} className={styles.trendItem}>
                                            <div className={`${styles.rankCircle} ${styles[`rank${index + 1}`] || styles.rankOther}`}>
                                                {index + 1}
                                            </div>
                                            <div className={styles.trendInfo}>
                                                <span className={styles.topicText}>
                                                    <strong>{cat.category}:</strong> {cat.topic}
                                                </span>
                                            </div>
                                            <button
                                                className={styles.miniReportBtn}
                                                onClick={() => openReport(cat)}
                                                title="Analiz Raporu"
                                            >
                                                <BarChart2 size={16} />
                                            </button>
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
                            <h3>Trend Raporu: {selectedReport.category ? `${selectedReport.category} - ${selectedReport.topic}` : selectedReport.topic}</h3>
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
                                                title={`${item.value}%`}
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
                            <p>Bu trendin yıllık performans analizi.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
