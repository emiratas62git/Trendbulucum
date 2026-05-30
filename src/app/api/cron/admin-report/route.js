import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function GET(req) {
    // 1. Verify Cron Secret (Security)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }
    const resend = new Resend(resendApiKey);

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // --- A. GATHER PERFORMANCE DATA ---

        // 1. Signups (Kayıtlar)
        const newMembers = await prisma.user.findMany({
            where: { createdAt: { gte: oneWeekAgo } },
            select: { name: true, email: true, lastIp: true, createdAt: true }
        });

        // 2. Revenue (Ciro)
        const purchases = await prisma.purchase.findMany({
            where: { createdAt: { gte: oneWeekAgo } }
        });
        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        // 3. Cancellations (İptaller)
        const cancellations = await prisma.auditLog.findMany({
            where: { 
                action: 'CANCEL',
                createdAt: { gte: oneWeekAgo }
            },
            include: { user: true }
        });

        const cancelReports = await Promise.all(cancellations.map(async (c) => {
            const previousActivity = await prisma.auditLog.findMany({
                where: { 
                    userId: c.userId,
                    createdAt: { lt: c.createdAt }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            return {
                user: c.user?.email || "Unknown User",
                ip: c.ipAddress || "Unknown IP",
                time: c.createdAt,
                activity: previousActivity.map(a => a.action).join(' -> ')
            };
        }));

        const approximateLoss = cancellations.length * 10;
        const activeUsersCount = await prisma.auditLog.groupBy({
            by: ['userId'],
            where: { createdAt: { gte: oneWeekAgo }, userId: { not: null } },
        });

        // --- B. GENERATE THE WEEKLY AI REPORT POST VIA GEMINI ---
        
        const reportPrompt = `You are an expert SEO content creator and senior AI analyst for "TrendyFinder Pro".
Generate a comprehensive, highly engaging Weekly AI Trend Analysis report.
The report for the website MUST be in ENGLISH.
However, you must also provide a TURKISH translation for the email notification sent to the admin.

Output the response strictly in JSON format matching this schema:
{
  "en": {
    "title": "string (English SEO title)",
    "excerpt": "string (English meta description)",
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "content": [
      { "subtitle": "string", "text": "string (detailed paragraph)" },
      { "subtitle": "Bar Chart: Daily Virality Volume", "type": "chart", "chartType": "bar", "chartData": [
          {"label": "Mon", "value": 4500},
          {"label": "Tue", "value": 5200},
          {"label": "Wed", "value": 6100},
          {"label": "Thu", "value": 5800},
          {"label": "Fri", "value": 7200},
          {"label": "Sat", "value": 4100},
          {"label": "Sun", "value": 3800}
        ]
      },
      { "subtitle": "Pie Chart: Bot vs Human Interaction", "type": "chart", "chartType": "pie", "chartData": [
          {"label": "Human", "value": 72},
          {"label": "Bots", "value": 28}
        ]
      }
    ]
  },
  "tr": {
    "title": "string (Türkçe başlık)",
    "excerpt": "string (Türkçe kısa özet)",
    "content_summaries": [
       { "subtitle": "string (Türkçe)", "text": "string (Türkçe özet paragraf)" }
    ]
  }
}
Do not wrap response in markdown blocks. Return pure JSON only.`;

        console.log("Generating Weekly AI report via Gemini...");
        const result = await model.generateContent(reportPrompt);
        let responseText = result.response.text().trim();
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const aiData = JSON.parse(responseText);
        const enData = aiData.en;
        const trData = aiData.tr;

        // --- C. PREPEND REPORT TO Static blogPosts.js ---
        const dataPath = path.join(process.cwd(), 'src/data/blogPosts.js');
        let fileContent = fs.readFileSync(dataPath, 'utf8');

        const arrayStartIndex = fileContent.indexOf('[');
        const arrayEndIndex = fileContent.lastIndexOf(']');
        const jsonStr = fileContent.substring(arrayStartIndex, arrayEndIndex + 1);
        const posts = eval(jsonStr);

        const newId = Math.max(...posts.map(p => p.id)) + 1;
        const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const slug = enData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
        const imageFilename = `ai_${slug.substring(0, 50)}.jpg`;
        const imagePath = `/blog-images/${imageFilename}`;
        const absoluteImagePath = path.join(process.cwd(), 'public', imagePath);

        // Download AI cover image from Pollinations
        const promptUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(enData.title + " abstract futuristic AI digital art") + `?width=1200&height=630&nologo=true`;
        console.log("Downloading AI cover image via curl...");
        try {
            execSync(`curl -s -L -o "${absoluteImagePath}" "${promptUrl}"`);
        } catch (dlErr) {
            console.error("Cover image download failed:", dlErr.message);
        }

        const newPost = {
            id: newId,
            slug: slug,
            category: "Latest AI Analysis",
            title: enData.title,
            excerpt: enData.excerpt,
            date: formattedDate,
            readTime: "6 min read",
            image: imagePath,
            views: Math.floor(Math.random() * 200) + 100,
            hashtags: enData.hashtags,
            content: enData.content
        };

        posts.unshift(newPost);
        const newFileContent = `export const blogPosts = ${JSON.stringify(posts, null, 4)};\n`;
        fs.writeFileSync(dataPath, newFileContent, 'utf8');
        console.log("Weekly AI post written to blogPosts.js successfully!");

        // --- D. DISPATCH CORRESPONDING EMAILS VIA RESEND ---

        const adminEmail = process.env.ADMIN_EMAIL || 'emircanatas62@gmail.com';
        console.log(`Dispatching Resend emails to admin: ${adminEmail}`);

        // Email: Performance & AI report details
        await resend.emails.send({
            from: 'TrendyFinder Pro <onboarding@resend.dev>',
            to: adminEmail,
            subject: `[Weekly Performance & AI Report] ${now.toLocaleDateString()}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; max-width: 650px; margin: 0 auto;">
                    <h1 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Haftalık Sistem Raporu</h1>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                        <h2 style="margin-top: 0; color: #0f172a;">📊 Finansal & Aktivite Özet</h2>
                        <ul style="font-size: 15px; line-height: 1.8;">
                            <li><strong>Haftalık Ciro (Gelir):</strong> $${totalRevenue.toFixed(2)}</li>
                            <li><strong>Tahmini Kayıp (Abonelik İptalleri):</strong> $${approximateLoss.toFixed(2)}</li>
                            <li><strong>Net Gelir Durumu:</strong> $${(totalRevenue - approximateLoss).toFixed(2)}</li>
                            <li><strong>Haftalık Aktif Kullanıcı:</strong> ${activeUsersCount.length} kişi</li>
                        </ul>
                    </div>

                    <div style="background: #eef2ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c7d2fe;">
                        <h2 style="margin-top: 0; color: #4338ca;">🤖 Yeni Yapay Zeka Raporu (Yayınlandı)</h2>
                        <h3 style="color: #1e293b;">${trData.title}</h3>
                        <p style="color: #475569; font-size: 14px;">${trData.excerpt}</p>
                        <div style="margin-top: 15px;">
                            ${(trData.content_summaries || []).map(c => `
                                <h4 style="color: #4f46e5; margin-bottom: 5px;">📍 ${c.subtitle}</h4>
                                <p style="color: #334155; font-size: 13px; line-height: 1.6; margin-top: 0;">${c.text}</p>
                            `).join('')}
                        </div>
                    </div>

                    <h3>Yeni Üyeler (${newMembers.length})</h3>
                    <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; border-color: #cbd5e1; font-size: 13px;">
                        <tr style="background: #cbd5e1; font-weight: bold;">
                            <td>İsim</td><td>E-posta</td><td>IP</td><td>Kayıt Tarihi</td>
                        </tr>
                        ${newMembers.map(m => `
                            <tr>
                                <td>${m.name || '-'}</td>
                                <td>${m.email}</td>
                                <td>${m.lastIp || '127.0.0.1'}</td>
                                <td>${new Date(m.createdAt).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </table>

                    <h3 style="margin-top: 30px;">İptal Hareketleri Audit Analizi</h3>
                    <ul style="padding-left: 20px; font-size: 13px;">
                        ${cancelReports.map(cr => `
                            <li style="margin-bottom: 12px;">
                                <strong>Kullanıcı:</strong> ${cr.user} (${cr.ip})<br/>
                                <strong>İptal Zamanı:</strong> ${new Date(cr.time).toLocaleString()}<br/>
                                <strong>İptal Öncesi Son 5 Hareket:</strong> <span style="color: #ef4444;">${cr.activity}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `
        });

        return NextResponse.json({ 
            success: true, 
            revenue: totalRevenue, 
            members: newMembers.length,
            aiReportTitle: enData.title,
            aiReportSlug: slug
        });

    } catch (e) {
        console.error("Cron report error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
