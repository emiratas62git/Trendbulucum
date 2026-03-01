import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogPosts';
import BlogPageClient from './BlogPageClient';

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

    return (
        <Suspense fallback={<div style={{ padding: '2rem' }}>Loading blog post...</div>}>
            <BlogPageClient post={post} />
        </Suspense>
    );
}
