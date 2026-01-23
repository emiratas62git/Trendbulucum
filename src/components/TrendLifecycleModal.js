"use client";
import React from 'react';
import { X, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import styles from './TrendLifecycleModal.module.css';

export default function TrendLifecycleModal({ isOpen, onClose, trend }) {
    if (!isOpen || !trend) return null;

    const { lifecycle, platform } = trend;
    const isLive = lifecycle.status === 'Rising' || lifecycle.status === 'Peak';
    const statusColor = isLive ? '#22c55e' : '#ef4444';

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <div className={styles.platformBadge}>{platform}</div>
                    <h2 className={styles.title}>{trend.title || trend.topic || trend.hashtag}</h2>
                    <div className={styles.mainStatus} style={{ color: statusColor }}>
                        {isLive ? <TrendingUp size={24} /> : <AlertCircle size={24} />}
                        <span>{lifecycle.status}</span>
                    </div>
                </div>

                <div className={styles.gaugeContainer}>
                    <div className={styles.gaugeLabel}>Trend Validity Score</div>
                    <div className={styles.gaugeBarBackground}>
                        <div
                            className={styles.gaugeBarFill}
                            style={{
                                width: `${lifecycle.validityScore}%`,
                                backgroundColor: statusColor
                            }}
                        />
                    </div>
                    <div className={styles.scoreValue}>{lifecycle.validityScore}/100</div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.infoCard}>
                        <Calendar size={20} className={styles.icon} />
                        <div>
                            <div className={styles.label}>Start</div>
                            <div className={styles.value}>{lifecycle.startDate}</div>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <Calendar size={20} className={styles.icon} />
                        <div>
                            <div className={styles.label}>Estimated End</div>
                            <div className={styles.value}>{lifecycle.endDate}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.summary}>
                    <h3>Analysis Summary</h3>
                    <p>{lifecycle.summary}</p>
                </div>

                <div className={styles.action}>
                    {isLive ? (
                        <button className={styles.actionBtn} style={{ backgroundColor: '#22c55e' }}>
                            Create Content Now! 🚀
                        </button>
                    ) : (
                        <button className={styles.actionBtn} style={{ backgroundColor: '#64748b' }}>
                            Skip This Trend ⚠️
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
