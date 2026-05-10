"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Search, Home, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../blog.module.css';
import BlogPromoCard from '@/components/BlogPromoCard';
import BlogPoll from './BlogPoll';

export default function BlogPageClient({ post, relatedPosts, isLoggedIn, isLocked, children }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from'); // 'blog' or 'tiktok', 'pinterest', etc.
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const searchRef = useRef(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isPostingComment, setIsPostingComment] = useState(false);
    
    // Fetch comments on load
    useEffect(() => {
        fetch(`/api/comments?postId=${post.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setComments(data);
            })
            .catch(e => console.error("Error fetching comments:", e));
    }, [post.id]);

    // Translation state
    const [showingTranslated, setShowingTranslated] = useState(new Set());
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(new Set());

    const toggleTranslation = async (id, text) => {
        if (showingTranslated.has(id)) {
            setShowingTranslated(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            return;
        }

        if (translations[id]) {
            setShowingTranslated(prev => new Set(prev).add(id));
            return;
        }

        setIsTranslating(prev => new Set(prev).add(id));
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            const translatedText = data[0].map(item => item[0]).join('');
            setTranslations(prev => ({ ...prev, [id]: translatedText }));
            setShowingTranslated(prev => new Set(prev).add(id));
        } catch (error) {
            console.error("Translation error", error);
        } finally {
            setIsTranslating(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

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
        <>
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

            {/* If there is a search term, we show an overlay or highlight version? 
                Actually, for now, let's just render the interactive parts like poll and related posts here.
                The main content is now handled by the server for 100% SEO.
            */}

            <div className={styles.articleLayout} style={{ marginTop: '2rem', display: 'block', width: '100%', maxWidth: '1000px', padding: '0 1rem', margin: '2rem auto' }}>
                <div className={styles.mainContent} style={{ border: 'none', padding: 0 }}>
                    {children}
                    <div className={styles.articleTextContent}>
                        {/* Feedback Poll */}
                        <BlogPoll postId={post.id} />

                        {/* Comments Section */}
                        {!isLocked && (
                            <div className={styles.commentsSection} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)', textAlign: 'center' }}>Comments</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <textarea 
                                        placeholder="Write your comment..."
                                        style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit' }}
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                router.push('/pricing');
                                            }
                                        }}
                                        onChange={(e) => {
                                            if (isLoggedIn) {
                                                setCommentText(e.target.value);
                                            }
                                        }}
                                        value={commentText}
                                        readOnly={!isLoggedIn}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <button 
                                            onClick={async () => {
                                                if (!isLoggedIn) {
                                                    router.push('/pricing');
                                                    return;
                                                }
                                                if (commentText.trim()) {
                                                    setIsPostingComment(true);
                                                    try {
                                                        const res = await fetch('/api/comments', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ postId: post.id, text: commentText.trim() })
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            setComments([...comments, data.comment]);
                                                            setCommentText('');
                                                        } else {
                                                            alert(data.error || "Failed to post comment");
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert("An error occurred");
                                                    } finally {
                                                        setIsPostingComment(false);
                                                    }
                                                }
                                            }}
                                            className={`${styles.pollButton} ${styles.dislikeButton}`}
                                            style={{ margin: 0, opacity: isPostingComment ? 0.5 : 1 }}
                                            disabled={isPostingComment}
                                        >
                                            {isPostingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {comments.map(c => {
                                            const isTranslated = showingTranslated.has(c.id);
                                            const isLoading = isTranslating.has(c.id);
                                            const displayText = isTranslated ? translations[c.id] : c.text;
                                            
                                            return (
                                                <div key={c.id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <strong>{c.author}</strong>
                                                        <span>{c.date}</span>
                                                    </div>
                                                    <div style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                                                        {displayText}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <button 
                                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: isLoading ? 'wait' : 'pointer', padding: 0, opacity: isLoading ? 0.5 : 1 }} 
                                                            onClick={() => toggleTranslation(c.id, c.text)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? 'Translating...' : (isTranslated ? 'Show Original' : 'Translate to Turkish')}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {comments.length === 0 && (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
                                                Be the first to comment.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

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
                </div>
            </div>
        </>
    );
}

