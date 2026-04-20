"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../auth.module.css";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    let errorMessage = "An unknown error occurred during authentication.";
    
    if (error === "Configuration") {
        errorMessage = "There is a problem with the server configuration. (e.g. Missing Google Client ID or Secret). Please check environment variables.";
    } else if (error === "AccessDenied") {
        errorMessage = "Access was denied. Your account might not have the required permissions.";
    } else if (error === "Verification") {
        errorMessage = "The verification link was invalid or has expired.";
    } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount" || error === "EmailCreateAccount" || error === "Callback" || error === "OAuthAccountNotLinked" || error === "EmailSignin" || error === "CredentialsSignin") {
        errorMessage = "Sign in failed. Please check your credentials or try again.";
    } else if (error === "Default") {
        errorMessage = "A generic error occurred.";
    }

    return (
        <div className={styles.container}>
            <div className={styles.authCard} style={{ textAlign: 'center' }}>
                <AlertCircle size={64} style={{ color: '#ef4444', margin: '0 auto 1.5rem auto' }} />
                <h1 style={{ marginBottom: '1rem' }}>Authentication Error</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {errorMessage}
                </p>
                <Link href="/auth/signin" className={styles.primaryButton} style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
