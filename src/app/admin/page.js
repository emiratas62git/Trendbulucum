"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
    TrendingUp, TrendingDown, Users, DollarSign, Activity, 
    Eye, ShieldCheck, ArrowRightLeft, Home, Loader2, Info
} from 'lucide-react';
import styles from './admin.module.css';

// Import the user dashboard to render inside preview mode
import UserDashboard from '../(dashboard)/dashboard/page';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const [previewMode, setPreviewMode] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email === 'emircanatas62@gmail.com') {
            async function fetchStats() {
                try {
                    const res = await fetch('/api/admin/stats');
                    if (res.ok) {
                        const data = await res.json();
                        setStats(data);
                    }
                } catch (e) {
                    console.error("Failed to load admin stats:", e);
                } finally {
                    setLoading(false);
                }
            }
            fetchStats();
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status, session]);

    if (status === 'loading' || loading) {
        return (
            <div className={styles.loaderContainer}>
                <Loader2 className={styles.spinner} size={48} />
                <p>Securing Control Center...</p>
            </div>
        );
    }

    // Server-side security emulation on client component
    if (!session || session.user.email !== 'emircanatas62@gmail.com') {
        return (
            <div className={styles.deniedContainer}>
                <div className={styles.deniedCard}>
                    <ShieldCheck size={64} className={styles.errorIcon} />
                    <h2>Access Denied</h2>
                    <p>This control center is strictly reserved for the site administrator.</p>
                    <a href="/" className={styles.returnBtn}>
                        <Home size={18} /> Return to Home
                    </a>
                </div>
            </div>
        );
    }

    // Toggle Preview Mode yields the actual site layout!
    if (previewMode) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="layout-body">
                    <main className="layout-main">
                        <Header />
                        <div className={styles.previewModeBar}>
                            <div className={styles.previewModeIndicator}>
                                <Info size={16} />
                                <span>You are currently previewing the website as a **Regular User**.</span>
                            </div>
                            <button onClick={() => setPreviewMode(false)} className={styles.togglePreviewBtn}>
                                <ArrowRightLeft size={16} /> Return to Admin Panel
                            </button>
                        </div>
                        <div className="app-container">
                            <UserDashboard />
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const { metrics, dailyTrendData, auditLogs, topCountries, trafficSources } = stats || {
        metrics: { visitors: { value: 0, growth: 0 }, signups: { value: 0, growth: 0 }, revenue: { value: 0, growth: 0 } },
        dailyTrendData: [],
        auditLogs: [],
        topCountries: [],
        trafficSources: []
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="layout-body">
                <main className="layout-main">
                    <Header />
                    
                    <div className="app-container">
                        <div className={styles.adminHeader}>
                            <div>
                                <span className={styles.badge}>System Administrator</span>
                                <h1>Admin Control Center</h1>
                                <p className={styles.subtitle}>Real-time growth metrics, transaction auditing, and system logs.</p>
                            </div>
                            <button onClick={() => setPreviewMode(true)} className={styles.togglePreviewBtn}>
                                <ArrowRightLeft size={16} /> Switch to User View
                            </button>
                        </div>

                        {/* Top Performance metrics */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.iconBox} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                                    <Eye size={24} />
                                </div>
                                <div>
                                    <h4>Weekly Page Views</h4>
                                    <p className={styles.statValue}>{metrics.visitors.value.toLocaleString()}</p>
                                    <div className={metrics.visitors.growth >= 0 ? styles.trendUp : styles.trendDown}>
                                        {metrics.visitors.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span>{metrics.visitors.growth >= 0 ? '+' : ''}{metrics.visitors.growth}% vs last week</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.iconBox} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4>Weekly New Signups</h4>
                                    <p className={styles.statValue}>{metrics.signups.value.toLocaleString()}</p>
                                    <div className={metrics.signups.growth >= 0 ? styles.trendUp : styles.trendDown}>
                                        {metrics.signups.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span>{metrics.signups.growth >= 0 ? '+' : ''}{metrics.signups.growth}% vs last week</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.iconBox} style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <h4>Weekly Ciro (Net)</h4>
                                    <p className={styles.statValue}>${metrics.revenue.value.toLocaleString()}</p>
                                    <div className={metrics.revenue.growth >= 0 ? styles.trendUp : styles.trendDown}>
                                        {metrics.revenue.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span>{metrics.revenue.growth >= 0 ? '+' : ''}{metrics.revenue.growth}% vs last week</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Growth Charts */}
                        <div className={styles.chartsGrid}>
                            <div className={styles.chartCard}>
                                <div className={styles.chartHeader}>
                                    <h3>📈 Weekly Traffic & Signups Volatility</h3>
                                    <p>Visualizing page interaction volume and user acquisition rates daily.</p>
                                </div>
                                <div className={styles.chartWrapper}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={dailyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSu" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
                                            <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
                                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                                            <Legend />
                                            <Area type="monotone" dataKey="Page Views" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                                            <Area type="monotone" dataKey="New Signups" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorSu)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <div className={styles.chartHeader}>
                                    <h3>📊 Daily Store Checkout Sales Conversion</h3>
                                    <p>Detailed daily transaction count monitoring Lemon Squeezy variants.</p>
                                </div>
                                <div className={styles.chartWrapper}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dailyTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
                                            <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
                                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                                            <Legend />
                                            <Bar dataKey="Sales" fill="#f472b6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Top Countries & Sources */}
                        <div className={styles.demographicsGrid}>
                            <div className={styles.demographicCard}>
                                <h3>🌍 Visitor Top Countries</h3>
                                <ul className={styles.demographicList}>
                                    {topCountries.map((c, idx) => (
                                        <li key={idx} className={styles.demographicItem}>
                                            <span>📍 {c.name}</span>
                                            <strong>%{c.percentage}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.demographicCard}>
                                <h3>🔗 Top Referral Traffic Sources</h3>
                                <ul className={styles.demographicList}>
                                    {trafficSources.map((s, idx) => (
                                        <li key={idx} className={styles.demographicItem}>
                                            <span>🔗 {s.source}</span>
                                            <strong>{s.users} sessions</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Live audit logs */}
                        <div className={styles.logsSection}>
                            <div className={styles.logsHeader}>
                                <h3>👤 Live Auditor User Activities & Session Tracking</h3>
                                <p>Comprehensive security activity record containing IP logs, registration timelines, and checkouts.</p>
                            </div>
                            <div className={styles.tableWrapper}>
                                <table className={styles.logsTable}>
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Email Context</th>
                                            <th>Action Type</th>
                                            <th>Remote IP Address</th>
                                            <th>Action Detail Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map((log) => (
                                            <tr key={log.id}>
                                                <td className={styles.logTime}>{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className={styles.logEmail}>{log.email}</td>
                                                <td>
                                                    <span className={`${styles.logBadge} ${styles[log.action]}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className={styles.logIp}>{log.ip}</td>
                                                <td className={styles.logDetails}>{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
