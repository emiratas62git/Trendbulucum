import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        // 1. Extreme Security Check (Server-Side)
        const session = await getServerSession(authOptions);
        if (!session || session.user.email !== "emircanatas62@gmail.com") {
            return NextResponse.json({ error: "Forbidden: Unauthorized access to Admin API." }, { status: 403 });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // --- A. Gather Statistics & WoW Growth ---

        // 1. Ziyaretçiler (Page Views)
        const pageViewsThisWeek = await prisma.auditLog.count({
            where: {
                action: "PAGE_VIEW",
                createdAt: { gte: sevenDaysAgo }
            }
        });
        const pageViewsLastWeek = await prisma.auditLog.count({
            where: {
                action: "PAGE_VIEW",
                createdAt: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo
                }
            }
        });

        // 2. Yeni Kayıtlar (Signups)
        const signupsThisWeek = await prisma.user.count({
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        });
        const signupsLastWeek = await prisma.user.count({
            where: {
                createdAt: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo
                }
            }
        });

        // 3. Satın Alımlar & Ciro (Purchases & Revenue)
        const purchasesThisWeek = await prisma.purchase.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        });
        const purchasesLastWeek = await prisma.purchase.findMany({
            where: {
                createdAt: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo
                }
            }
        });

        const revenueThisWeek = purchasesThisWeek.reduce((sum, p) => sum + p.amount, 0);
        const revenueLastWeek = purchasesLastWeek.reduce((sum, p) => sum + p.amount, 0);

        // Helper to calculate growth percentage safely
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        // --- B. Generate Daily Chart Trend Data (for Recharts) ---
        const dailyTrendData = [];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const pageViews = await prisma.auditLog.count({
                where: {
                    action: "PAGE_VIEW",
                    createdAt: { gte: dayStart, lte: dayEnd }
                }
            });

            const signups = await prisma.user.count({
                where: {
                    createdAt: { gte: dayStart, lte: dayEnd }
                }
            });

            const sales = await prisma.purchase.count({
                where: {
                    createdAt: { gte: dayStart, lte: dayEnd }
                }
            });

            dailyTrendData.push({
                name: days[dayStart.getDay()],
                "Page Views": pageViews,
                "New Signups": signups,
                "Sales": sales
            });
        }

        // --- C. Fetch Recent Live Audit Logs ---
        const rawLogs = await prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        const auditLogs = rawLogs.map(log => ({
            id: log.id,
            timestamp: log.createdAt,
            email: log.user?.email || "Anonymous Visitor",
            action: log.action,
            ip: log.ipAddress || "Unknown",
            details: log.details || ""
        }));

        // --- D. Top Countries & Sources Calculation ---
        // NOTE: Real geographic/referral data requires a dedicated analytics integration
        // (e.g., Google Analytics API, Plausible, or middleware IP geolocation tracking).
        // Returning empty arrays to avoid showing fake static data as real metrics.
        const topCountries = [];
        const trafficSources = [];

        // --- E. Confirmed Subscriptions (Active) ---
        const activeSubscriptions = await prisma.subscription.count({
            where: { status: { in: ['active', 'on_trial', 'trialling'] } }
        });

        return NextResponse.json({
            metrics: {
                visitors: {
                    value: pageViewsThisWeek,
                    growth: calculateGrowth(pageViewsThisWeek, pageViewsLastWeek)
                },
                signups: {
                    value: signupsThisWeek,
                    growth: calculateGrowth(signupsThisWeek, signupsLastWeek)
                },
                revenue: {
                    value: parseFloat(revenueThisWeek.toFixed(2)),
                    growth: calculateGrowth(revenueThisWeek, revenueLastWeek)
                },
                activeSubscriptions
            },
            dailyTrendData,
            auditLogs,
            topCountries,
            trafficSources
        }, { status: 200 });

    } catch (e) {
        console.error("Critical stats API error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
