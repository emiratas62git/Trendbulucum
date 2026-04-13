"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import styles from '../auth.module.css';

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
            } else {
                setSuccess(true);
                setTimeout(() => router.push('/auth/signin'), 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.authCard}>
                    <div className={styles.successWrapper}>
                        <CheckCircle size={64} className={styles.successIcon} />
                        <h1>Account Created!</h1>
                        <p>Welcome to TrendyFinder. Redirecting you to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <Link href="/" className={styles.logoLink}>
                        <img src="/logo.png" alt="TrendyFinder Logo" className={styles.authLogo} />
                    </Link>
                    <h1>Create Account</h1>
                    <p>Join TrendyFinder and master social media trends.</p>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input 
                                type="password" 
                                placeholder="Min. 8 characters" 
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <p className={styles.termsText}>
                        By signing up, you agree to our <Link href="/terms-of-service">Terms</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
                    </p>

                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                        {loading ? <Loader2 className={styles.spin} /> : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account? <Link href="/auth/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
