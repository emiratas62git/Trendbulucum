'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './blog.module.css';

export default function BlogSearchInput({ initialValue = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const router = useRouter();

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
                placeholder="Search for trends, strategies, or keywords..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
    );
}
