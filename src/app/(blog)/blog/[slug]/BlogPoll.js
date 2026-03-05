'use client';
import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, SkipForward } from 'lucide-react';
import styles from '../blog.module.css';

export default function BlogPoll({ postId }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState({ likes: 0, dislikes: 0, skips: 0 });
    const [userChoice, setUserChoice] = useState(null);

    // Generate deterministic mock initial votes based on postId
    useEffect(() => {
        // Simple pseudo-random formula based on postId snippet
        const base = (postId * 73) % 1000;
        setVotes({
            likes: base + 120, // Guarantee at least some likes
            dislikes: Math.floor(base / 10) + 5,
            skips: Math.floor(base / 5) + 15
        });
    }, [postId]);

    const handleVote = (choice) => {
        if (hasVoted) return;

        setVotes(prev => ({
            ...prev,
            [choice]: prev[choice] + 1
        }));
        setUserChoice(choice);
        setHasVoted(true);
    };

    const totalVotes = votes.likes + votes.dislikes + votes.skips;
    const likePercent = totalVotes > 0 ? Math.round((votes.likes / totalVotes) * 100) : 0;
    const dislikePercent = totalVotes > 0 ? Math.round((votes.dislikes / totalVotes) * 100) : 0;
    const skipPercent = totalVotes > 0 ? Math.round((votes.skips / totalVotes) * 100) : 0;

    return (
        <div className={styles.pollContainer}>
            <h3 className={styles.pollTitle}>Did you like this article?</h3>

            {!hasVoted ? (
                <div className={styles.pollButtons}>
                    <button
                        onClick={() => handleVote('likes')}
                        className={`${styles.pollButton} ${styles.likeButton}`}
                    >
                        <ThumbsUp size={20} />
                        <span>I Liked It</span>
                    </button>
                    <button
                        onClick={() => handleVote('dislikes')}
                        className={`${styles.pollButton} ${styles.dislikeButton}`}
                    >
                        <ThumbsDown size={20} />
                        <span>I Didn't Like It</span>
                    </button>
                    <button
                        onClick={() => handleVote('skips')}
                        className={`${styles.pollButton} ${styles.skipButton}`}
                    >
                        <SkipForward size={20} />
                        <span>I Don't Want to Participate</span>
                    </button>
                </div>
            ) : (
                <div className={styles.pollResultsDisplay}>
                    <p className={styles.thankYouText}>Thank you for your feedback!</p>
                    <div className={styles.resultRows}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultLabel}>
                                <ThumbsUp size={16} /> Liked {userChoice === 'likes' && '(You)'}
                            </div>
                            <div className={styles.resultBarContainer}>
                                <div className={styles.resultBar} style={{ width: `${likePercent}%`, backgroundColor: 'var(--success-color, #10b981)' }}></div>
                            </div>
                            <div className={styles.resultCount}>{votes.likes} ({likePercent}%)</div>
                        </div>

                        <div className={styles.resultRow}>
                            <div className={styles.resultLabel}>
                                <ThumbsDown size={16} /> Didn't Like {userChoice === 'dislikes' && '(You)'}
                            </div>
                            <div className={styles.resultBarContainer}>
                                <div className={styles.resultBar} style={{ width: `${dislikePercent}%`, backgroundColor: 'var(--danger-color, #ef4444)' }}></div>
                            </div>
                            <div className={styles.resultCount}>{votes.dislikes} ({dislikePercent}%)</div>
                        </div>

                        <div className={styles.resultRow}>
                            <div className={styles.resultLabel}>
                                <SkipForward size={16} /> Skipped {userChoice === 'skips' && '(You)'}
                            </div>
                            <div className={styles.resultBarContainer}>
                                <div className={styles.resultBar} style={{ width: `${skipPercent}%`, backgroundColor: 'var(--text-muted)' }}></div>
                            </div>
                            <div className={styles.resultCount}>{votes.skips} ({skipPercent}%)</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
