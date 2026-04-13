import { Suspense, Fragment } from 'react';
import { notFound } from 'next/navigation';
import { Eye } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import BlogPageClient from './BlogPageClient';
import AdSlot from '@/components/AdSlot';
import AIChartRenderer from '@/components/AIChartRenderer';
import styles from '../blog.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ... (existing generateMetadata remains same, let's keep it consistent)


export async function generateMetadata({ params }) {
    const post = blogPosts.find(p => p.slug === params.slug);

    if (!post) {
        return {
            title: 'Post Not Found | TrendFinder',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: `${post.title} | TrendFinder Blog`,
        description: post.excerpt,
        keywords: post.hashtags ? post.hashtags.map(tag => tag.replace('#', '')).join(', ') : '',
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPost({ params }) {
    const session = await getServerSession(authOptions);
    const post = blogPosts.find(p => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const isAIReport = post.category === "Latest AI Analysis";
    const isPremium = session?.user?.isPremium;
    const isLocked = isAIReport && !isPremium;

    // Calculate related posts based on shared hashtags, sorted by views as a tiebreaker
    const relatedPosts = blogPosts
        .filter(p => p.id !== post.id)
        .map(p => {
            const sharedHashtags = (p.hashtags || []).filter(tag => (post.hashtags || []).includes(tag)).length;
            return { ...p, sharedHashtags };
        })
        .sort((a, b) => b.sharedHashtags - a.sharedHashtags || (b.views || 0) - (a.views || 0))
        .slice(0, 4); // Take top 4 related posts

    return (
        <BlogPageClient post={post} relatedPosts={relatedPosts}>
            <article style={{ padding: 0 }}>
                {/* SEO & SSR Content */}
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
                    {isLocked ? (
                        <div className={styles.premiumOverlay}>
                            <div className={styles.blurContent}>
                                <p>{post.excerpt}</p>
                                <p>{post.content[0].text.substring(0, 100)}...</p>
                            </div>
                            <div className={styles.lockCard}>
                                <div className={styles.lockIconWrapper}>
                                    <Lock size={32} />
                                </div>
                                <Sparkles size={24} className={styles.sparkleIcon} />
                                <h2>Premium Analysis Locked</h2>
                                <p>Unlock full weekly trend reports, deep-dive data, and actionable content strategies.</p>
                                <Link href="/pricing" className={styles.unlockBtn}>
                                    <span>Get Unlimited Access</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <p className={styles.trialText}>Start your 7-day free trial today.</p>
                            </div>
                        </div>
                    ) : (
                        post.content.map((section, index) => (
                            <div key={index} className={styles.section}>
                                {section.subtitle && (
                                    <h2 className={styles.subtitle}>{section.subtitle}</h2>
                                )}
                                {section.type === 'chart' && (
                                    <AIChartRenderer chartData={section.chartData} chartType={section.chartType} />
                                )}
                                {section.text?.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => (
                                    <Fragment key={pIndex}>
                                        <p className={styles.text} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                            {paragraph.trim()}
                                        </p>
                                    </Fragment>
                                ))}
                            </div>
                        ))
                    )}

                    {!isLocked && (
                        <div className={styles.authorSection}>
                            <h3 className={styles.authorName}>
                                Author: <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer">Emir Can ATAŞ</a>
                            </h3>
                            <p className={styles.authorBio}>
                                Emir Can ATAŞ is both the founder and the author of this website. He has been researching websites and technologies since 2017. He is the author of an AI analysis book and a coloring book for children. As of 2026, he is 27 years old and still deeply enjoys technology and websites.
                            </p>
                        </div>
                    )}
                </div>
            </article>
        </BlogPageClient>
    );
}


