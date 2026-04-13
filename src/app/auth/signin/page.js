"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, Chrome, ArrowRight, Loader2 } from 'lucide-react';
import styles from '../auth.module.css';

export default function SignInPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (res.error) {
                setError(res.error);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <Link href="/" className={styles.logoLink}>
                        <img src="/logo.png" alt="TrendyFinder Logo" className={styles.authLogo} />
                    </Link>
                    <h1>Welcome Back</h1>
                    <p>Log in to access your premium trend analysis.</p>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
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
                                placeholder="••••••••" 
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                        {loading ? <Loader2 className={styles.spin} /> : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                <button onClick={handleGoogleSignIn} className={styles.googleButton}>
                    <Chrome size={18} />
                    <span>Google</span>
                </button>

                <p className={styles.footerText}>
                    Don't have an account? <Link href="/auth/signup">Sign Up Free</Link>
                </p>
            </div>
        </div>
    );
}
