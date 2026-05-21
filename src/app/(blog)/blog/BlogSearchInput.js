'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './blog.module.css';
import { getTranslation } from '@/lib/i18n';

export default function BlogSearchInput({ initialValue = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const router = useRouter();
    
    const [t, setT] = useState(getTranslation('en'));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setT(getTranslation(navigator.language));
        }
    }, []);

    // Update internal state if initialValue changes (from URL)
    useEffect(() => {
        setSearchTerm(initialValue);
    }, [initialValue]);

    // Handle search submission or debounced update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== initialValue) {
                if (searchTerm) {
                    router.push(`/blog?q=${encodeURIComponent(searchTerm)}`);
                } else {
                    router.push('/blog');
                }
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm, initialValue, router]);

    return (
        <form 
            className={styles.searchBar}
            onSubmit={(e) => {
                e.preventDefault();
                document.activeElement?.blur();
            }}
        >
            <Search size={20} className={styles.searchIcon} />
            <input
                type="text"
                placeholder={t.searchArticles}
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
    );
}
