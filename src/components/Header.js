"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './Header.module.css';
import { TrendService } from '@/services/TrendService';
import { useDashboard } from '@/context/DashboardContext';
import TrendLifecycleModal from './TrendLifecycleModal';
import SearchAlertModal from './SearchAlertModal';

export default function Header({ title, onTimeframeChange }) {
    const pathname = usePathname();
    const { searchQuery, setSearchQuery } = useDashboard();
    const [query, setQuery] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTimeframe, setActiveTimeframe] = useState('monthly');

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

    const handleTimeframeChange = (timeframe) => {
        setActiveTimeframe(timeframe);
        if (onTimeframeChange) {
            onTimeframeChange(timeframe);
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
                    <h2 className={styles.title}>{title || 'Dashboard'}</h2>
                    {pathname !== '/' && onTimeframeChange && (
                        <div className={styles.timeframeSelector}>
                            {['hourly', 'daily', 'weekly', 'monthly'].map((tf) => (
                                <button
                                    key={tf}
                                    className={`${styles.timeframeBtn} ${activeTimeframe === tf ? styles.activeTimeframe : ''}`}
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
                            placeholder={pathname === '/' ? "Search all trends..." : `Search in ${pathname.replace('/', '').toUpperCase()}...`}
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
