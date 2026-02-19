
"use client";
import { useState } from 'react';
import { ArrowLeft, Eye, Search, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import styles from '../blog.module.css';
import { blogPosts } from '@/data/blogPosts';
import AdSlot from '@/components/AdSlot';
import BlogPromoCard from '@/components/BlogPromoCard';

export default function BlogPost({ params }) {
    const post = blogPosts.find(p => p.slug === params.slug);
    const searchParams = useSearchParams();
    const from = searchParams.get('from'); // 'blog' or 'tiktok', 'pinterest', etc.
    const [searchTerm, setSearchTerm] = useState('');

    if (!post) {
        notFound();
    }

    // Determine Back Link destination and Icon
    const isFromBlogList = from === 'blog';
    const backUrl = isFromBlogList ? '/blog' : '/';
    const BackIcon = isFromBlogList ? ArrowLeft : Home;

    return (
        <div style={{ padding: '2rem' }}>
            {/* Top Navigation Bar */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <Link href={backUrl} className={styles.backLink}>
                    <BackIcon size={20} />
                    {isFromBlogList ? 'Back to Insights' : 'Back to Platform'}
                </Link>

                {/* Article Internal Search */}
                <div className={styles.searchBar} style={{ margin: 0, padding: '0.25rem 1rem', width: '300px' }}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search in article..."
                        className={styles.searchInput}
                        style={{ fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            <div className={styles.articleLayout}>
                {/* Left Ad Column */}
                <aside className={styles.sideAd}>
                    <AdSlot type="vertical" />
                    <div style={{ marginTop: '2rem' }}>
                        <AdSlot type="vertical" />
                    </div>
                </aside>

                {/* Main Content Column */}
                <div className={styles.mainContent}>
                    <article>
                        <header className={styles.articleHeader}>
                            <div className={styles.articleMeta}>
                                <span>{post.date} • {post.readTime}</span>
                                <span style={{ marginLeft: '1rem', color: 'var(--primary)' }}>
                                    <Eye size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    <span suppressHydrationWarning>
                                        {(post.views || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} views
                                    </span>
                                </span>
                            </div>
                            <h1 className={styles.articleTitle}>{post.title}</h1>
                        </header>

                        <img src={post.image} alt={post.title} className={styles.articleImage} />

                        <div className={styles.articleTextContent}>
                            {/* Intro Ad */}
                            <div style={{ marginBottom: '2rem' }}>
                                <AdSlot type="horizontal" />
                            </div>

                            {post.content.map((section, index) => (
                                <div key={index} className={styles.section}>
                                    {/* Render section subtitle if it exists */}
                                    {section.subtitle && <h2 className={styles.subtitle}>{section.subtitle}</h2>}

                                    {/* Render section text if it exists, splitting by newlines for paragraphs */}
                                    {section.text && section.text.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => (
                                        <p key={pIndex} className={styles.text} style={{ marginBottom: '1.5rem' }}>
                                            {paragraph.trim()}
                                        </p>
                                    ))}


                                    {/* Insert Small Horizontal Ad between paragraphs (sections) */}
                                    {(index + 1) % 1 === 0 && index !== post.content.length - 1 && (
                                        <div style={{ margin: '2rem 0', opacity: 0.8 }}>
                                            <AdSlot type="horizontal" height="100px" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Hashtags Section */}
                            {post.hashtags && post.hashtags.length > 0 && (
                                <div className={styles.hashtagSection}>
                                    <h3>Related Topics</h3>
                                    <div className={styles.tags}>
                                        {post.hashtags.map((tag, i) => (
                                            <span key={i} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bottom Ad */}
                            <div style={{ marginTop: '3rem' }}>
                                <AdSlot type="horizontal" />
                            </div>
                        </div>
                    </article>
                </div>

                {/* Right Ad Column */}
                <aside className={styles.sideAd}>
                    <AdSlot type="vertical" />
                    <div style={{ marginTop: '2rem' }}>
                        <AdSlot type="vertical" />
                    </div>
                </aside>
            </div>
        </div>
    );
}
