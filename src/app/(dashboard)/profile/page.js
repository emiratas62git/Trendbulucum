"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Shield, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './profile.module.css';
import { getTranslation } from '@/lib/i18n';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });

    // Detection for browser language
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: t.profileSuccess });
                // Update local session
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name,
                        email
                    }
                });
            } else {
                setStatus({ type: 'error', message: data.error || 'An error occurred.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t.accountSettings}</h1>
                    <p>{t.profileDescription}</p>
                </div>
            </div>

            <div className={styles.profileCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <User size={18} /> {t.personalInfo}
                        </h3>
                        
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">{t.fullName}</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.inputIcon} size={18} />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t.fullName}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">{t.emailAddress}</label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Shield size={18} /> {t.subscriptionStatus}
                        </h3>
                        <div className={styles.statusBox}>
                            <div className={styles.statusInfo}>
                                <span className={styles.statusLabel}>{t.membershipType}:</span>
                                <span className={styles.statusValue}>
                                    {session?.user?.isPremium ? t.premiumPlan : t.freePlan}
                                </span>
                            </div>
                            <div className={styles.statusInfo}>
                                <span className={styles.statusLabel}>{t.expiryDate}:</span>
                                <span className={styles.statusValue}>
                                    {session?.user?.subscriptionEnd === 'unlimited' ? t.unlimited : 
                                     session?.user?.subscriptionEnd ? new Date(session.user.subscriptionEnd).toLocaleDateString() : t.none}
                                </span>
                            </div>
                        </div>
                    </div>

                    {status.message && (
                        <div className={`${styles.alert} ${status.type === 'success' ? styles.success : styles.error}`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? <Loader2 className={styles.spin} size={20} /> : <Save size={20} />}
                        {loading ? t.updating : t.saveChanges}
                    </button>
                </form>
            </div>
        </div>
    );
}
