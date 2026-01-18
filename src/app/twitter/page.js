"use client";
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendService } from '@/services/TrendService';
import { Twitter, MessageCircle, TrendingUp, Heart, X, Sparkles, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

export default function TwitterPage() {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState(null);
    const [modalType, setModalType] = useState(null); // 'idea', 'analysis'

    useEffect(() => {
        async function fetchData() {
            const data = await TrendService.getPlatformTrends('twitter');
            setTrends(data);
            setLoading(false);
        }
        fetchData();
    }, []);

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
                    <h3>Fikir Önerisi</h3>
                    <p className={styles.modalText}>
                        "{selectedTrend.hashtag}" hakkında etkileşim alabilecek bir tweet fikri:
                    </p>
                    <div className={styles.ideaBox}>
                        "Bu hafta {selectedTrend.hashtag} konuşulurken gözden kaçan bir detay var... 👇 (Flood Başlangıcı)"
                    </div>
                    <p className={styles.subText}>Bu taslağı kullanarak zincirleme bir flood başlatabilirsin.</p>
                </div>
            );
        }

        if (modalType === 'sentiment') {
            const { positive, neutral, negative } = selectedTrend.sentiment || { positive: 0, neutral: 0, negative: 0 };
            return (
                <div className={styles.modalBody}>
                    <div className={styles.iconWrapper}><Heart size={32} color="#e0245e" /></div>
                    <h3>Duygu Analizi: {selectedTrend.hashtag}</h3>
                    <p className={styles.modalText}>Kullanıcıların bu konu hakkındaki hisleri.</p>

                    <div className={styles.sentimentContainer}>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Pozitif</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${positive}%`, backgroundColor: '#17bf63' }}></div></div>
                            <span className={styles.sentimentValue}>%{positive}</span>
                        </div>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Nötr</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${neutral}%`, backgroundColor: '#FFD700' }}></div></div>
                            <span className={styles.sentimentValue}>%{neutral}</span>
                        </div>
                        <div className={styles.sentimentRow}>
                            <span className={styles.sentimentLabel}>Negatif</span>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${negative}%`, backgroundColor: '#e0245e' }}></div></div>
                            <span className={styles.sentimentValue}>%{negative}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (modalType === 'analysis') {
            return (
                <div className={styles.modalBody}>
                    <div className={styles.iconWrapper}><BarChart2 size={32} color="#1da1f2" /></div>
                    <h3>Trend Analizi: {selectedTrend.hashtag}</h3>
                    <p className={styles.modalText}>Son 12 aylık etkileşim ve hacim performansı.</p>
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
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header title="Twitter / X Analiz" />

                <div className={styles.content}>
                    <div className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1>Twitter / X Gündemi</h1>
                            <p>Anlık etiket analizleri ve etkileşim getirecek tweet fikirleri.</p>
                        </div>
                        <div className={styles.heroIcon}>
                            <Twitter size={64} />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.colLeft}>
                            <h3 className={styles.sectionTitle}>Canlı Gündem & Analiz</h3>
                            <div className={styles.tweetGrid}>
                                {loading ? <p>Yükleniyor...</p> : trends.map((trend, index) => (
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
                                                <MessageCircle size={16} /> Fikir Yaz
                                            </button>
                                            <button className={styles.actionBtn} onClick={() => openModal(trend, 'sentiment')}>
                                                <Heart size={16} /> Duygu Ölçümü
                                            </button>
                                            <button className={styles.actionBtn} onClick={() => openModal(trend, 'analysis')}>
                                                <BarChart2 size={16} /> Analiz Et
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.colRight}>
                            <h3 className={styles.sectionTitle}>Tweet Önerileri</h3>
                            <div className={styles.suggestionBox}>
                                <div className={styles.ideaList}>
                                    <div className={styles.ideaItem}>
                                        <p><strong>Flood Fikri:</strong> "Yazılımcılar için 5 Verimlilik Aracı" flood'u hazırla.</p>
                                    </div>
                                    <div className={styles.ideaItem}>
                                        <p><strong>Anket:</strong> Takipçilerine "Remote mu Ofis mi?" diye sor.</p>
                                    </div>
                                    <div className={styles.ideaItem}>
                                        <p><strong>Görsel:</strong> Çalışma masanın fotoğrafını "Setup War" etiketiyle paylaş.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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
        </div>
    );
}
