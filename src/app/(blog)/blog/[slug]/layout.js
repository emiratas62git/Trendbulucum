import { blogPosts } from '@/data/blogPosts';

export async function generateMetadata({ params }) {
    const post = blogPosts.find(p => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    const url = `https://trendyfinder.com/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.excerpt || `Read about ${post.title} on TrendyFinder.`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: url,
            siteName: 'TrendyFinder',
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            locale: 'en_US',
            type: 'article',
            publishedTime: post.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    }
}

export default function BlogPostLayout({ children, params }) {
    const post = blogPosts.find(p => p.slug === params.slug);

    const jsonLd = post ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image,
        datePublished: post.date,
        description: post.excerpt,
        author: {
            '@type': 'Organization',
            name: 'TrendyFinder'
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
