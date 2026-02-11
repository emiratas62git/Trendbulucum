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
                        <div
                            onClick={() => window.location.href = 'mailto:emircanatas62@gmail.com'}
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '50px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                display: 'inline-block',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Send Email
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <Linkedin size={40} className={styles.contactIcon} />
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>LinkedIn</h3>
                        <div
                            onClick={() => window.open('https://www.linkedin.com/in/emircanataş626210', '_blank')}
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '50px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                display: 'inline-block',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            View Profile
                        </div>
                    </div>
                </div>

                <p className={styles.text} style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem' }}>
                    Feel free to reach out for feedback and collaboration requests.
                </p>

            </div>
        </div>
    );
}
