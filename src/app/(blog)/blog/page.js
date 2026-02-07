
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Home } from 'lucide-react';
import styles from './blog.module.css';
import { blogPosts } from '@/data/blogPosts';

export default function BlogList() {
    const [searchTerm, setSearchTerm] = useState('');

    // Sort by views descending
    const sortedPosts = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0));

    // Filter by search
    const filteredPosts = sortedPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getThemeClass = (index, post) => {
        // We are moving away from loud platform colors back to a clean, uniform design.
        // Keeping only a subtle highlight for the very top article.
        if (searchTerm === '' && index === 0) return styles.featuredCard;
        return styles.standardCard;
    };

    return (
        <div className={styles.container}>
            <div className={styles.topNav}>
                <Link href="/" className={styles.backButton}>
                    <Home size={18} /> Back to Dashboard
                </Link>
            </div>
            <div className={styles.header}>
                <h1>Trend Insights</h1>
                <p>Expert guides and strategies for mastering social media.</p>
            </div>

            <div className={styles.searchBar}>
                <Search size={20} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search for trends, strategies, or keywords..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {filteredPosts.map((post, index) => (
                    <Link
                        href={`/blog/${post.slug}?from=blog`}
                        key={post.id}
                        className={`${styles.card} ${getThemeClass(index, post)}`}
                    >
                        <div className={styles.imageContainer}>
                            <img src={post.image} alt={post.title} className={styles.image} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.meta}>
                                <span>{post.date}</span>
                                <span className={styles.views}>
                                    <Eye size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    <span suppressHydrationWarning>
                                        {(post.views || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} views
                                    </span>
                                </span>
                            </div>
                            <h2 className={styles.title}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <span className={styles.readMore}>
                                Read Article <ArrowRight size={16} />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    <p>No articles found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}
