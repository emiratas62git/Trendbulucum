import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Home, Instagram, Twitter, Youtube, Pin } from 'lucide-react';
import styles from './blog.module.css';
import { blogPosts } from '@/data/blogPosts';

// Client component for the search interaction
import BlogSearchInput from './BlogSearchInput';

export default function BlogList({ searchParams }) {
    const searchTerm = searchParams?.q || '';
    const selectedCategory = searchParams?.category || '';
    
    // Get unique categories dynamically
    const dynamicCats = new Set(blogPosts.map(post => post.category).filter(Boolean));
    dynamicCats.delete('Latest AI Analysis'); // Ensure it's not duplicated
    const categories = ['Latest', 'All', 'Latest AI Analysis', ...dynamicCats];

    // Sorting logic
    const sortedPosts = [...blogPosts];

    if (selectedCategory === 'Latest') {
        // Sort by date descending, then by views descending for same-date posts
        sortedPosts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateB - dateA !== 0) return dateB - dateA;
            return (b.views || 0) - (a.views || 0);
        });
    } else {
        sortedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    // Filter by search and category
    const filteredPosts = sortedPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesCategory = true;
        if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'Latest') {
            matchesCategory = post.category === selectedCategory;
        }
        
        return matchesSearch && matchesCategory;
    });

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
                <Link href="/instagram" className={styles.backButton}>
                    <Instagram size={18} /> Instagram
                </Link>
                <Link href="/twitter" className={styles.backButton}>
                    <Twitter size={18} /> Twitter
                </Link>
                <Link href="/youtube" className={styles.backButton}>
                    <Youtube size={18} /> YouTube
                </Link>
                <Link href="/pinterest" className={styles.backButton}>
                    <Pin size={18} /> Pinterest
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

