"use client";
import Header from '@/components/Header';
import styles from '../static.module.css';

export default function AboutUs() {
    return (
        <div className={styles.content}>
            <Header title="About Us" />
            <div className={styles.content}>
                <div className={styles.card}>
                    <h1 className={styles.title}>About Us</h1>
                    <p className={styles.text}>
                        TrendFinder is an AI-powered analytics platform developed to show
                        content creators and digital marketers which topics are rising on social media.
                        <br /><br />
                        The founder of this website is Emir Can ATAŞ, a Turkish entrepreneur.
                        Our website helps creators produce more accurate and efficient content by
                        analyzing social media platforms, content trends, and user interactions.
                        <br /><br />
                        The information provided on TrendFinder is for guidance purposes only.
                        Our goal is to enable users to make more informed decisions while
                        creating their own content strategies.
                        <br /><br />
                        <strong>“Please remember that the information we provide here is for informational purposes only. Recommendations are for informational purposes.”</strong>
                    </p>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Our Vision</h2>
                        <p className={styles.text}>
                            To enable content creators and brands to easily adapt to the rapidly changing
                            dynamics of social media and reach their target audience with the most accurate content,
                            and to ensure users make more informed decisions while creating their own content strategies.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Why Trendfinder?</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Multi-platform support (YouTube, TikTok, Twitter, etc.)</li>
                            <li className={styles.listItem}>AI-powered content suggestions</li>
                            <li className={styles.listItem}>User-friendly interface and real-time data tracking</li>
                            <li className={styles.listItem}>sector-specific in-depth analysis</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
