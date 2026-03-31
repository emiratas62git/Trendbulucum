import { Suspense, Fragment } from 'react';
import { notFound } from 'next/navigation';
import { Eye } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import BlogPageClient from './BlogPageClient';
import AdSlot from '@/components/AdSlot';
import styles from '../blog.module.css';

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

export default function BlogPost({ params }) {
    const post = blogPosts.find(p => p.slug === params.slug);

    if (!post) {
        notFound();
    }

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
                    {post.content.map((section, index) => (
                        <div key={index} className={styles.section}>
                            {section.subtitle && (
                                <h2 className={styles.subtitle}>{section.subtitle}</h2>
                            )}
                            {section.text?.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => (
                                <Fragment key={pIndex}>
                                    <p className={styles.text} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                        {paragraph.trim()}
                                    </p>
                                    <div style={{ margin: '2.5rem 0', display: 'flex', justifyContent: 'center' }}>
                                        <AdSlot type="horizontal" />
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    ))}

                    {/* Author Section */}
                    <div className={styles.authorSection}>
                        <h3 className={styles.authorName}>
                            Author: <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer">Emir Can ATAŞ</a>
                        </h3>
                        <p className={styles.authorBio}>
                            Emir Can ATAŞ is both the founder and the author of this website. He has been researching websites and technologies since 2017. He is the author of an AI analysis book and a coloring book for children. As of 2026, he is 27 years old and still deeply enjoys technology and websites.
                        </p>
                    </div>
                </div>
            </article>
        </BlogPageClient>
    );
}


