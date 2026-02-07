"use client";
import { Mail, Linkedin } from 'lucide-react';
import styles from '../../static.module.css';

export default function Contact() {
    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <h1 className={styles.title}>Contact</h1>
                <p className={styles.text} style={{ textAlign: 'center' }}>
                    You can contact us via the following channels.
                </p>

                <div className={styles.contactGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    <div className={styles.contactItem}>
                        <Mail size={40} className={styles.contactIcon} />
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Email</h3>
                        <a
                            href="mailto:emircanatas62@gmail.com"
                            style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', wordBreak: 'break-all', textDecoration: 'none' }}
                        >
                            emircanatas62@gmail.com
                        </a>
                    </div>
                    <div className={styles.contactItem}>
                        <Linkedin size={40} className={styles.contactIcon} />
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>LinkedIn</h3>
                        <a
                            href="https://www.linkedin.com/in/emircanataş626210"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', wordBreak: 'break-all' }}
                        >
                            View Profile
                        </a>
                    </div>
                </div>

                <p className={styles.text} style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem' }}>
                    Feel free to reach out for feedback and collaboration requests.
                </p>

            </div>
            );
}
