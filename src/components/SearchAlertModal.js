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
    default: { color: '#6366f1', icon: 'Trendfinder' }
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

                <h2 className={styles.title}>No Results Found</h2>

                <p className={styles.message}>
                    We couldn't capture any trend data for <span style={{ color: theme.color, fontWeight: 600 }}>"{searchTerm}"</span>
                    {platformContext ? ` on ${theme.icon}.` : '.'}
                </p>

                <div className={styles.suggestionBox}>
                    <AlertTriangle size={18} className={styles.warningIcon} style={{ color: theme.color }} />
                    <span>Please make sure there are no typos or try more general terms.</span>
                </div>

                <button
                    className={styles.actionBtn}
                    style={{ backgroundColor: theme.color }}
                    onClick={onClose}
                >
                    Got it, Thanks
                </button>
            </div>
        </div>
    );
}
