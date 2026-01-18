"use client";
import React from 'react';
import { X, SearchX, AlertTriangle } from 'lucide-react';
import styles from './SearchAlertModal.module.css';

const PLATFORM_THEMES = {
    youtube: { color: '#ef4444', icon: 'YouTube' },
    tiktok: { color: '#d946ef', icon: 'TikTok' }, // Updated to Fuchsia/Purple
    twitter: { color: '#1d9bf0', icon: 'Twitter' },
    instagram: { color: '#d62976', icon: 'Instagram' },
    linkedin: { color: '#0a66c2', icon: 'LinkedIn' },
    pinterest: { color: '#bd081c', icon: 'Pinterest' },
    default: { color: '#6366f1', icon: 'Trend Bulucu' }
};

export default function SearchAlertModal({ isOpen, onClose, platformContext, searchTerm }) {
    if (!isOpen) return null;

    const theme = PLATFORM_THEMES[platformContext] || PLATFORM_THEMES.default;

    return (
        <div className={styles.overlay}>
            <div
                className={styles.modal}
                style={{
                    borderColor: theme.color,
                    boxShadow: `0 10px 40px -10px ${theme.color}50, 0 0 20px -5px ${theme.color}30`
                }}
            >
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.iconWrapper} style={{ backgroundColor: `${theme.color}20`, color: theme.color }}>
                    <SearchX size={48} />
                </div>

                <h2 className={styles.title}>Sonuç Bulunamadı</h2>

                <p className={styles.message}>
                    <span style={{ color: theme.color, fontWeight: 600 }}>"{searchTerm}"</span> ile ilgili
                    {platformContext ? ` ${theme.icon} üzerinde ` : ' '}
                    herhangi bir trend verisi yakalayamadık.
                </p>

                <div className={styles.suggestionBox}>
                    <AlertTriangle size={18} className={styles.warningIcon} style={{ color: theme.color }} />
                    <span>Lütfen yazım hatası yapmadığınızdan emin olun veya daha genel terimler deneyin.</span>
                </div>

                <button
                    className={styles.actionBtn}
                    style={{ backgroundColor: theme.color }}
                    onClick={onClose}
                >
                    Tamam, Anlaşıldı
                </button>
            </div>
        </div>
    );
}
