"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Loader2, TrendingUp, TrendingDown, Menu } from 'lucide-react';
import styles from './Header.module.css';
import { TrendService } from '@/services/TrendService';
import { useDashboard } from '@/context/DashboardContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Sparkles } from 'lucide-react';
import TrendLifecycleModal from './TrendLifecycleModal';
import SearchAlertModal from './SearchAlertModal';

import { getTranslation } from '@/lib/i18n';

export default function Header({ title: propTitle, onTimeframeChange: propOnTimeframeChange }) {
    const pathname = usePathname();
    const { searchQuery, setSearchQuery, timeframe, setTimeframe, toggleSidebar } = useDashboard();
    const [query, setQuery] = useState(searchQuery);
    const { data: session } = useSession();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    // Detection for browser language
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    // Derive title if not provided
    const getDerivedTitle = () => {
        if (propTitle) return propTitle;
        const path = pathname.split('/')[1];
        if (!path || path === '') return 'TrendyFinder Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1) + ' Trends';
    };

    const title = getDerivedTitle();

    // Alert state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [searchedTerm, setSearchedTerm] = useState('');

    // Suggestions state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                const pathSegment = pathname.split('/')[1];
                const context = (!pathSegment || pathSegment === '') ? null : pathSegment;

                try {
                    const results = await TrendService.searchTrends(query, context);
                    // Sort heavily by validity score (mock trendiness)
                    const sorted = results.sort((a, b) => b.lifecycle.validityScore - a.lifecycle.validityScore).slice(0, 5);
                    setSuggestions(sorted);
                    setShowSuggestions(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, pathname]);

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsSearching(true);
            setShowSuggestions(false); // Hide on enter
            try {
                // Determine context based on URL
                const pathSegment = pathname.split('/')[1];
                const context = (!pathSegment || pathSegment === '') ? null : pathSegment;

                const results = await TrendService.searchTrends(query, context);

                if (results && results.length > 0) {
                    setSearchResult(results[0]);
                    setIsModalOpen(true);
                    setIsAlertOpen(false);
                } else {
                    setSearchedTerm(query);
                    setIsAlertOpen(true);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }
    };

    const handleSuggestionClick = (item) => {
        setSearchResult(item);
        setQuery(item.title || item.topic || item.hashtag);
        setShowSuggestions(false);
        setIsModalOpen(true);
    };

    const handleTimeframeChange = (newTf) => {
        setTimeframe(newTf);
        if (propOnTimeframeChange) {
            propOnTimeframeChange(newTf);
        }
    };

    // Derived context for color coding
    const pathSegment = pathname.split('/')[1];
    const currentContext = (!pathSegment || pathSegment === '') ? 'default' : pathSegment;

    const PLATFORM_COLORS = {
        youtube: '#ef4444',
        tiktok: '#d946ef',
        twitter: '#1d9bf0',
        instagram: '#d62976',
        linkedin: '#0a66c2',
        pinterest: '#bd081c',
        default: '#6366f1'
    };
    const activeColor = PLATFORM_COLORS[currentContext] || PLATFORM_COLORS.default;

    return (
        <>
            <header
                className={styles.header}
                style={{
                    '--theme-color': activeColor,
                    '--theme-glow': activeColor + '40' // 25% opacity
                }}
            >
                <div className={styles.headerLeft}>
                    <button
                        className={styles.menuToggle}
                        onClick={toggleSidebar}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className={styles.title}>{title}</h2>
                    {['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest', ''].includes(pathname.split('/')[1]) && (
                        <div className={styles.timeframeSelector}>
                            {['hourly', 'daily', 'weekly', 'monthly'].map((tf) => (
                                <button
                                    key={tf}
                                    className={`${styles.timeframeBtn} ${timeframe === tf ? styles.activeTimeframe : ''}`}
                                    onClick={() => handleTimeframeChange(tf)}
                                >
                                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <div className={styles.searchContainer}>
                        {isSearching ? (
                            <Loader2 size={18} className={`${styles.searchIcon} ${styles.spin}`} />
                        ) : (
                            <Search size={18} className={styles.searchIcon} />
                        )}
                        <input
                            type="text"
                            placeholder={(pathname === '/' || pathname === '/dashboard') ? "Search all trends..." : `Search in ${pathname.replace('/', '').toUpperCase()}...`}
                            className={styles.searchInput}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSearchQuery(e.target.value);
                            }}
                            onKeyDown={handleSearch}
                            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                            // Delay blur to allow click event on suggestion to fire
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            disabled={isSearching}
                        />

                        {/* Live Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className={styles.suggestionsDropdown}>
                                {suggestions.map((item, index) => {
                                    const isPositive = item.lifecycle.status !== 'Falling';
                                    return (
                                        <div
                                            key={index}
                                            className={styles.suggestionItem}
                                            onClick={() => handleSuggestionClick(item)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <div className={styles.suggestionLeft}>
                                                <span className={`${styles.rankBadge} ${styles['rank' + (index + 1)]}`}>
                                                    {index + 1}
                                                </span>
                                                <span className={styles.suggestionTitle}>
                                                    {item.title || item.topic || item.hashtag}
                                                </span>
                                            </div>

                                            <div className={styles.suggestionRight}>
                                                <span>{item.lifecycle.validityScore} Score</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pro / Auth Actions */}
                    <div className={styles.authActions}>
                        {!session ? (
                            <Link href="/auth/signin" className={styles.loginBtn}>
                                Sign In
                            </Link>
                        ) : (
                            <div className={styles.userProfile}>
                                {!session.user.isPremium && (
                                    <Link href="/" className={styles.proBtn}>
                                        <Sparkles size={16} />
                                        <span>{t.upgradePro}</span>
                                    </Link>
                                )}
                                    <div className={styles.userNameDisplay}>
                                        <p className={styles.headerUserName}>
                                            {session.user.name || 'User'}
                                        </p>
                                        {session.user.isPremium && (
                                            <span className={styles.remainingDays}>
                                                {session.user.subscriptionEnd === 'unlimited' ? (
                                                    t.unlimitedPro
                                                ) : (
                                                    (() => {
                                                        const end = new Date(session.user.subscriptionEnd);
                                                        const now = new Date();
                                                        const diffTime = Math.abs(end - now);
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                        return `${diffDays} ${t.daysLeft}`;
                                                    })()
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.avatarWrapper} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="User" className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <User size={20} />
                                        </div>
                                    )}
                                    
                                    {isUserMenuOpen && (
                                        <>
                                            <div className={styles.dropdownOverlay} onClick={() => setIsUserMenuOpen(false)} />
                                            <div className={styles.userDropdown}>
                                                <div className={styles.userInfo}>
                                                    <p className={styles.userName}>{session.user.name || 'User'}</p>
                                                    <p className={styles.userEmail}>{session.user.email}</p>
                                                    {session.user.isPremium && (
                                                        <div className={styles.dropdownSubscription}>
                                                            {session.user.subscriptionEnd === 'unlimited' ? (
                                                                t.unlimitedPro
                                                            ) : (
                                                                (() => {
                                                                    const end = new Date(session.user.subscriptionEnd);
                                                                    const now = new Date();
                                                                    const diffTime = Math.abs(end - now);
                                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                    return `${diffDays} ${t.daysLeft}`;
                                                                })()
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={styles.dropdownDivider} />
                                                {session.user.role === 'ADMIN' && (
                                                    <Link href="/admin" className={styles.dropdownItem}>Admin Panel</Link>
                                                )}
                                                <Link href="/profile" className={styles.dropdownItem}>{t.accountSettings}</Link>
                                                <button onClick={() => signOut()} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                                                    <LogOut size={16} />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <TrendLifecycleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trend={searchResult}
            />

            <SearchAlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                platformContext={currentContext}
                searchTerm={searchedTerm}
            />
        </>
    );
}
