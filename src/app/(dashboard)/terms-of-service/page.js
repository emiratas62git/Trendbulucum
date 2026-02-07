"use client";
import styles from '../../static.module.css';

export default function TermsOfService() {
    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <h1 className={styles.title}>Terms of Service</h1>
                <p className={styles.text}>
                    Anyone using the TrendFinder website is deemed to have accepted
                    that the content provided is for informational purposes only.
                    <br /><br />
                    Users use the analyses and suggestions provided on the site at
                    their own responsibility. TrendFinder cannot be held responsible
                    for any consequences that may arise.
                </p>
            </div>
        </div>
    );
}
