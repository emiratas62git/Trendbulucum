import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Home, Instagram, Twitter, Youtube, Pin } from 'lucide-react';
import styles from './blog.module.css';
import { blogPosts } from '@/data/blogPosts';
import { headers } from 'next/headers';
import { getTranslation } from '@/lib/i18n';

// Client component for the search interaction
import BlogSearchInput from './BlogSearchInput';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function BlogList({ searchParams }) {
    const session = await getServerSession(authOptions);
    const isPremium = session?.user?.isPremium;
    
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language') || 'en';
    const t = getTranslation(acceptLanguage);
    const isTurkish = t.membershipType === 'Üyelik Tipi';

    const searchTerm = searchParams?.q || '';
    const selectedCategory = searchParams?.category || '';
    
    // Get unique categories dynamically
    const dynamicCats = new Set(blogPosts.map(post => post.category).filter(Boolean));
    dynamicCats.delete('Latest AI Analysis'); // Ensure it's not duplicated
    const categories = ['Latest', 'All', 'Latest AI Analysis', ...dynamicCats];

    // Sorting logic
    const sortedPosts = [...blogPosts];

    // Helper to parse dates like "18 Nis 2026" or "May 10, 2026" safely
    const parseDateSafe = (dateStr) => {
        if (!dateStr) return 0;
        const turkishMonths = {
            'Oca': 'Jan', 'Şub': 'Feb', 'Mar': 'Mar', 'Nis': 'Apr', 'May': 'May', 'Haz': 'Jun',
            'Tem': 'Jul', 'Ağu': 'Aug', 'Eyl': 'Sep', 'Eki': 'Oct', 'Kas': 'Nov', 'Ara': 'Dec',
            'Ocak': 'Jan', 'Şubat': 'Feb', 'Mart': 'Mar', 'Nisan': 'Apr', 'Mayıs': 'May', 'Haziran': 'Jun',
            'Temmuz': 'Jul', 'Ağustos': 'Aug', 'Eylül': 'Sep', 'Ekim': 'Oct', 'Kasım': 'Nov', 'Aralık': 'Dec'
        };
        let englishDateStr = dateStr;
        for (const [tr, en] of Object.entries(turkishMonths)) {
            if (englishDateStr.includes(tr)) {
                englishDateStr = englishDateStr.replace(tr, en);
                break;
            }
        }
        const time = new Date(englishDateStr).getTime();
        return isNaN(time) ? 0 : time;
    };

    // Always sort by date descending, then by views descending for same-date posts
    sortedPosts.sort((a, b) => {
        const timeA = parseDateSafe(a.date);
        const timeB = parseDateSafe(b.date);
        if (timeB - timeA !== 0) return timeB - timeA;
        return (b.views || 0) - (a.views || 0);
    });

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

    const getCategoryTranslation = (category) => {
        if (category === 'Latest') return t.categoryLatest;
        if (category === 'All') return t.categoryAll;
        if (category === 'Latest AI Analysis') return t.categoryLatestAI;
        if (category === 'Trends') return t.categoryTrends;
        return category;
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className={styles.topNav} style={{ marginBottom: 0, justifyContent: 'flex-start', flex: 1 }}>
                    <Link href={!isPremium ? "/" : "/dashboard"} className={styles.backButton}>
                        <Home size={18} /> {t.backToDashboard}
                    </Link>
                    <Link href={!isPremium ? "/" : "/instagram"} className={styles.backButton}>
                        <Instagram size={18} /> Instagram
                    </Link>
                    <Link href={!isPremium ? "/" : "/twitter"} className={styles.backButton}>
                        <Twitter size={18} /> Twitter
                    </Link>
                    <Link href={!isPremium ? "/" : "/youtube"} className={styles.backButton}>
                        <Youtube size={18} /> YouTube
                    </Link>
                    <Link href={!isPremium ? "/" : "/pinterest"} className={styles.backButton}>
                        <Pin size={18} /> Pinterest
                    </Link>
                </div>
                <div>
                    {isPremium ? (
                        <Link href="/dashboard" className={styles.backButton} style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)', fontWeight: 'bold' }}>
                            {session.user.name || (session.user.email ? session.user.email.split('@')[0] : t.dashboard)}
                        </Link>
                    ) : (
                        <Link href="/" className={styles.backButton} style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)', fontWeight: 'bold' }}>
                            {t.upgradeToPremium}
                        </Link>
                    )}
                </div>
            </div>
            <div className={styles.header}>
                <h1>{t.blogTitle}</h1>
                <p>{t.blogSubtitle}</p>
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
                            {getCategoryTranslation(cat)}
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
                                        {(post.views || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {isTurkish ? 'görüntülenme' : 'views'}
                                    </span>
                                </span>
                            </div>
                            <h2 className={styles.title}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            
                            {/* Updated Read More Section with Category Badge & Styled Button */}
                            <div className={styles.readMoreContainer}>
                                {post.category && <span className={styles.categoryBadge}>{getCategoryTranslation(post.category)}</span>}
                                <span className={styles.readMoreBtn}>
                                    {isTurkish ? 'Makaleyi Oku' : 'Read Article'} <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    <p suppressHydrationWarning>
                        {isTurkish 
                            ? `"${searchTerm}" aramasıyla eşleşen ${selectedCategory ? `"${getCategoryTranslation(selectedCategory)}" kategorisinde ` : ''}makale bulunamadı.` 
                            : `No articles found matching "${searchTerm}" ${selectedCategory ? `in "${getCategoryTranslation(selectedCategory)}"` : ''}`}
                    </p>
                </div>
            )}
        </div>
    );
}
// force cache invalidation

