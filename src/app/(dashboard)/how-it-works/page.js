"use client";
import Header from '@/components/Header';
import styles from '../../static.module.css';

export default function HowItWorks() {
    return (
        <div className={styles.content}>
            <Header title="How It Works?" />
            <div className={styles.content}>
                <div className={styles.card}>
                    <h1 className={styles.title}>How It Works?</h1>
                    <p className={styles.text}>
                        TrendFinder uses an AI-powered system that analyzes content
                        movements and interaction data on social media platforms.
                        <br /><br />
                        Our platform:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Identifies rising content topics.</li>
                        <li className={styles.listItem}>Provides content suggestions to creators.</li>
                        <li className={styles.listItem}>Shows platforms where trends are most effective.</li>
                        <li className={styles.listItem}>Determines 12-month trend cycles.</li>
                        <li className={styles.listItem}>Displays popular hashtags.</li>
                    </ul>
                    <p className={styles.text}>
                        <br />
                        The data and analyses provided are prepared to help users
                        develop their own content strategies.
                    </p>
                </div>
            </div>
        </div>
    );
}
