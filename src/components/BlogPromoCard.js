
'use client';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import styles from './BlogPromoCard.module.css';

const BlogPromoCard = ({ platform, image, description }) => {
    // Map platform to a relevant article slug or generic behavior
    const platformSlugs = {
        tiktok: 'finding-tiktok-trends',
        pinterest: 'pinterest-long-trends',
        linkedin: 'linkedin-long-trends',
        instagram: 'instagram-reels-rising-types',
        youtube: 'youtube-shorts-trends',
        twitter: 'twitter-x-trend-analysis'
    };

    const slug = platformSlugs[platform] || 'rising-social-media-trends-2026';

    return (
        <div className={styles.container}>
            {image && (
                <div className={styles.imageBox}>
                    <img src={image} alt="Insight Thumbnail" className={styles.thumbnail} />
                </div>
            )}
            <div className={styles.content}>
                <div className={styles.headerRow}>
                    <div className={styles.iconCircle}>
                        <BookOpen size={16} />
                    </div>
                    <h4>Read Expert Insight</h4>
                </div>
                <p>{description || `Learn how to master ${platform.charAt(0).toUpperCase() + platform.slice(1)} algorithms.`}</p>
                <div className={styles.actions}>
                    <Link href={`/blog/${slug}?from=${platform}`} className={styles.link}>
                        Read Article <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPromoCard;
