import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET(req) {
    // 1. Verify Cron Secret (Security)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // --- Data Gathering ---

        // A. New Members
        const newMembers = await prisma.user.findMany({
            where: { createdAt: { gte: oneWeekAgo } },
            select: { name: true, email: true, lastIp: true, createdAt: true }
        });

        // B. Revenue (Purchases this week)
        const purchases = await prisma.purchase.findMany({
            where: { createdAt: { gte: oneWeekAgo } }
        });
        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        // C. Cancellations & Activity Before Cancellation
        const cancellations = await prisma.auditLog.findMany({
            where: { 
                action: 'CANCEL',
                createdAt: { gte: oneWeekAgo }
            },
            include: { user: true }
        });

        const cancelReports = await Promise.all(cancellations.map(async (c) => {
            // Get last 5 actions before cancellation
            const previousActivity = await prisma.auditLog.findMany({
                where: { 
                    userId: c.userId,
                    createdAt: { lt: c.createdAt }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            return {
                user: c.user.email,
                ip: c.ipAddress,
                time: c.createdAt,
                activity: previousActivity.map(a => a.action).join(' -> ')
            };
        }));

        // D. Losses (Estimate based on cancellations or refunds if tracked)
        const approximateLoss = cancellations.length * 10; // Simple estimate: each cancellation is a $10 loss

        // --- Email 1: Performance Summary ---
        await resend.emails.send({
            from: 'TrendyFinder Admin <admin@trendyfinder.com>',
            to: process.env.ADMIN_EMAIL,
            subject: `[Weekly Admin Report] ${now.toLocaleDateString()}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                    <h1 style="color: #6366f1;">Haftalık Performans Raporu</h1>
                    <p>Haftalık TrendyFinder durum özeti:</p>
                    
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="margin-top: 0;">Finansal Özet</h2>
                        <ul style="font-size: 16px;">
                            <li><strong>Bu Haftaki Gelir:</strong> $${totalRevenue.toFixed(2)}</li>
                            <li><strong>Tahmini Kayıp (İptal):</strong> $${approximateLoss.toFixed(2)}</li>
                            <li><strong>Net Durum:</strong> $${(totalRevenue - approximateLoss).toFixed(2)}</li>
                        </ul>
                    </div>

                    <h3>Yeni Üyeler (${newMembers.length})</h3>
                    <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; border-color: #e2e8f0;">
                        <tr style="background: #f1f5f9;">
                            <th>İsim</th><th>E-posta</th><th>IP Adresi</th><th>Tarih</th>
                        </tr>
                        ${newMembers.map(m => `
                            <tr>
                                <td>${m.name || '-'}</td>
                                <td>${m.email}</td>
                                <td>${m.lastIp}</td>
                                <td>${m.createdAt.toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </table>

                    <h3 style="margin-top: 30px;">İptal İşlemleri ve Kullanıcı Hareketleri</h3>
                    <ul style="padding-left: 20px;">
                        ${cancelReports.map(cr => `
                            <li style="margin-bottom: 15px;">
                                <strong>Kullanıcı:</strong> ${cr.user} (${cr.ip})<br/>
                                <strong>Zaman:</strong> ${cr.time.toLocaleString()}<br/>
                                <strong>İptal Öncesi Son 5 Hareket:</strong> <span style="color: #ef4444;">${cr.activity}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `
        });

        // --- Email 2: Latest AI Report ---
        // Fetch the newest blog post that is an AI Report
        // This is a placeholder logic depending on how reports are stored
        await resend.emails.send({
            from: 'TrendyFinder AI <reports@trendyfinder.com>',
            to: process.env.ADMIN_EMAIL,
            subject: `[Weekly AI Analysis] Copy for Admin`,
            html: `
                <div style="font-family: sans-serif; gap: 20px;">
                    <h2>Haftalık Yapay Zeka Raporu</h2>
                    <p>Bu haftaki trend analizi raporu başarıyla oluşturuldu ve siteye eklendi.</p>
                    <a href="${process.env.NEXTAUTH_URL}/blog" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Raporu Sitede Gör</a>
                </div>
            `
        });

        return NextResponse.json({ success: true, revenue: totalRevenue, members: newMembers.length });

    } catch (e) {
        console.error("Cron report error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
