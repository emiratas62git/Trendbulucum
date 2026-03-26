import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Home } from 'lucide-react';
import styles from './blog.module.css';
import { blogPosts } from '@/data/blogPosts';

// Client component for the search interaction
import BlogSearchInput from './BlogSearchInput';

export default function BlogList({ searchParams }) {
    const searchTerm = searchParams?.q || '';
    const selectedCategory = searchParams?.category || '';
    
    // Sort by views descending
    const sortedPosts = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0));

    // Filter by search and category
    const filteredPosts = sortedPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories dynamically
    const categories = ['All', ...new Set(blogPosts.map(post => post.category).filter(Boolean))];

    const getThemeClass = (index) => {
        // Keeping only a subtle highlight for the very top article when not searching and filtering.
        if (searchTerm === '' && selectedCategory === '' && index === 0) return styles.featuredCard;
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
                <h1>Trend Analyses and Useful Practical Suggestions</h1>
                <p>Expert guides and strategies for mastering social media and trends.</p>
            </div>

            <Suspense fallback={<div className={styles.searchBar}><Search size={20} className={styles.searchIcon} /><div className="skeleton-base" style={{ flex: 1, height: '24px' }}></div></div>}>
                <BlogSearchInput initialValue={searchTerm} />
            </Suspense>

            {/* Category Filters */}
            <div className={styles.categoryFilterContainer}>
                {categories.map(cat => {
                    const isActive = cat === 'All' ? !selectedCategory : cat === selectedCategory;
                    return (
                        <Link 
                            key={cat} 
                            href={`/blog?${searchTerm ? `q=${searchTerm}&` : ''}${cat !== 'All' ? `category=${encodeURIComponent(cat)}` : ''}`}
                            className={`${styles.categoryButton} ${isActive ? styles.activeCategoryButton : ''}`}
                        >
                            {cat}
                        </Link>
                    )
                })}
            </div>

            <div className={styles.grid}>
                {filteredPosts.map((post, index) => (
                    <Link
                        href={`/blog/${post.slug}?from=blog`}
                        key={post.id}
                        className={`${styles.card} ${getThemeClass(index)}`}
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
                            
                            {/* Updated Read More Section with Category Badge & Styled Button */}
                            <div className={styles.readMoreContainer}>
                                {post.category && <span className={styles.categoryBadge}>{post.category}</span>}
                                <span className={styles.readMoreBtn}>
                                    Read Article <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    <p>No articles found matching "{searchTerm}" {selectedCategory && `in "${selectedCategory}"`}</p>
                </div>
            )}
        </div>
    );
}
// force cache invalidation

