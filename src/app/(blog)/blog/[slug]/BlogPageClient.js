"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Eye, Search, Home, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../blog.module.css';
import AdSlot from '@/components/AdSlot';
import BlogPromoCard from '@/components/BlogPromoCard';
import BlogPoll from './BlogPoll';

export default function BlogPageClient({ post, relatedPosts }) {
    const searchParams = useSearchParams();
    const from = searchParams.get('from'); // 'blog' or 'tiktok', 'pinterest', etc.
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const searchRef = useRef(null);

    // Reset current index when search term changes
    useEffect(() => {
        setCurrentMatchIndex(0);
    }, [searchTerm]);

    // Handle clicking outside to clear search
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchTerm('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Better implementation of highlighting that supports stable indexing
    const renderContentWithHighlights = useMemo(() => {
        if (!searchTerm.trim()) {
            return {
                title: post.title,
                content: post.content.map(s => ({ ...s, textParts: s.text?.split('\n') })),
                matches: []
            };
        }

        const term = searchTerm.toLowerCase();
        let globalMatchIndex = 0;
        const matches = [];

        const processText = (text, type, sectionIndex = -1, pIndex = -1) => {
            if (!text) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const parts = text.split(regex);
            return parts.map((part, i) => {
                if (regex.test(part)) {
                    const index = globalMatchIndex++;
                    matches.push({ index, type, sectionIndex, pIndex });
                    const isActive = index === currentMatchIndex;
                    return (
                        <mark
                            key={i}
                            id={`match-${index}`}
                            className={`${styles.highlight} ${isActive ? styles.activeHighlight : ''}`}
                        >
                            {part}
                        </mark>
                    );
                }
                return part;
            });
        };

        const highlightedTitle = processText(post.title, 'title');
        const highlightedContent = post.content.map((section, sIdx) => ({
            ...section,
            highlightedSubtitle: processText(section.subtitle, 'subtitle', sIdx),
            highlightedTextParts: section.text?.split('\n').filter(p => p.trim() !== '').map((p, pIdx) =>
                processText(p.trim(), 'text', sIdx, pIdx)
            )
        }));

        return {
            title: highlightedTitle,
            content: highlightedContent,
            matches
        };
    }, [searchTerm, currentMatchIndex, post]);

    const matchCount = renderContentWithHighlights.matches.length;

    const handleNext = () => {
        if (matchCount > 0) {
            setCurrentMatchIndex((prev) => (prev + 1) % matchCount);
        }
    };

    const handlePrev = () => {
        if (matchCount > 0) {
            setCurrentMatchIndex((prev) => (prev - 1 + matchCount) % matchCount);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && matchCount > 0) {
            handleNext();
        }
    };

    // Scroll to active match
    useEffect(() => {
        if (matchCount > 0) {
            const element = document.getElementById(`match-${currentMatchIndex}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentMatchIndex, matchCount]);

    // Determine Back Link destination and Icon
    const isFromBlogList = from === 'blog';
    const backUrl = isFromBlogList ? '/blog' : '/';
    const BackIcon = isFromBlogList ? ArrowLeft : Home;

    return (
        <div style={{ padding: '2rem' }}>
            {/* Top Navigation Bar - Sticky */}
            <header className={styles.stickyHeader}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
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
                    <div ref={searchRef} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {searchTerm && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: matchCount > 0 ? 'var(--primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {matchCount > 0 ? `${currentMatchIndex + 1} / ${matchCount} matches` : '0 matches found'}
                                </span>
                                {matchCount > 0 && (
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        <button onClick={handlePrev} className={styles.navButton} title="Previous">
                                            <ChevronUp size={16} />
                                        </button>
                                        <button onClick={handleNext} className={styles.navButton} title="Next">
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.searchBar} style={{ margin: 0, padding: '0.25rem 1rem', width: '250px' }}>
                            <Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search in article..."
                                className={styles.searchInput}
                                style={{ fontSize: '0.9rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>
            </header>

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
                            <h1 className={styles.articleTitle}>{renderContentWithHighlights.title}</h1>
                        </header>

                        <img src={post.image} alt={post.title} className={styles.articleImage} />

                        <div className={styles.articleTextContent}>
                            {/* Intro Ad */}
                            <div style={{ marginBottom: '2rem' }}>
                                <AdSlot type="horizontal" />
                            </div>

                            {renderContentWithHighlights.content.map((section, index) => (
                                <div key={index} className={styles.section}>
                                    {section.subtitle && (
                                        <h2 className={styles.subtitle}>
                                            {searchTerm.trim() ? section.highlightedSubtitle : section.subtitle}
                                        </h2>
                                    )}

                                    {searchTerm.trim() ? (
                                        section.highlightedTextParts?.map((p, pIdx) => (
                                            <p key={pIdx} className={styles.text} style={{ marginBottom: '1.5rem' }}>
                                                {p}
                                            </p>
                                        ))
                                    ) : (
                                        section.text?.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => (
                                            <p key={pIndex} className={styles.text} style={{ marginBottom: '1.5rem' }}>
                                                {paragraph.trim()}
                                            </p>
                                        ))
                                    )}

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

                            {/* Feedback Poll */}
                            <BlogPoll postId={post.id} />

                            {/* Related Posts */}
                            {relatedPosts && relatedPosts.length > 0 && (
                                <div className={styles.relatedPostsSection}>
                                    <h3 className={styles.relatedPostsTitle}>Related Posts</h3>
                                    <div className={styles.relatedGrid}>
                                        {relatedPosts.map((rPost) => (
                                            <Link href={`/blog/${rPost.slug}?from=blog`} key={rPost.id} className={`${styles.card} ${styles.standardCard}`}>
                                                <div className={styles.imageContainer} style={{ height: '140px' }}>
                                                    <img src={rPost.image} alt={rPost.title} className={styles.image} />
                                                </div>
                                                <div className={styles.content} style={{ padding: '1rem' }}>
                                                    <div className={styles.meta} style={{ marginBottom: '0.5rem' }}>
                                                        <span className={styles.views}>
                                                            <Eye size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                            <span suppressHydrationWarning>
                                                                {(rPost.views || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} views
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <h4 className={styles.title} style={{ fontSize: '1rem', marginBottom: '0' }}>{rPost.title}</h4>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
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
