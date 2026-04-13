const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Resend } = require('resend');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const resend = new Resend(process.env.RESEND_API_KEY);

async function generateReport() {
    let prompt = `You are an expert SEO content creator and senior AI analyst for "TrendyFinder Pro", a premium trend intelligence service.
Generate a comprehensive Weekly AI Trend Analysis report (800-1000 words) in English.

Your analysis must include:
1. Executive Summary: The "Big Picture" of this week.
2. Platform Winners: Which social platform saw the most growth.
3. Top 3 Trending Topics: Deep dive with actionable advice for creators.
4. Content Strategy: How to capitalize on these trends right now.
5. Future Outlook: What to expect next week.

CRITICAL: Since this is a premium service, you MUST include a professional "Upgrade to Pro" Call-to-Action (CTA) at the very end. The CTA should highlight that Pro members get daily updates, priority alerts, and deep-dive analytics.
ir specific topics, and whether they involve bot activity or human growth.
- Deep analysis of the metrics with high readibility.

Output the response strictly in JSON format matching this structure exactly (an array of content sections):
{
  "title": "string (SEO optimized catching title)",
  "excerpt": "string (short SEO meta description)",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "content": [
    { "subtitle": "string", "text": "string (detailed paragraph)" },
    { 
       "subtitle": "Bar Chart: Daily Virality Volume", 
       "type": "chart",
       "chartType": "bar",
       "chartData": [
          { "name": "Mon", "value": 1200 },
          { "name": "Tue", "value": 2300 }
          // Provide 7 days
       ]
    },
    { "subtitle": "string", "text": "string (detailed paragraph analyzing bar chart)" },
    { 
       "subtitle": "Pie Chart: Bot vs Human Interaction", 
       "type": "chart",
       "chartType": "pie",
       "chartData": [
          { "name": "Bot", "value": 30 },
          { "name": "Human", "value": 70 }
       ]
    },
    { "subtitle": "string", "text": "string (detailed paragraph analyzing pie chart)" },
    { 
       "subtitle": "Candlestick Simulation: Hourly Volatility", 
       "type": "chart",
       "chartType": "candlestick",
       "chartData": [
          { "name": "08:00", "range": 500, "close": 1200 },
          { "name": "12:00", "range": 800, "close": 1800 }
          // Provide ~5 time points
       ]
    },
    { "subtitle": "Conclusion", "text": "string (final thoughts)" }
  ]
}
Do not include markdown blocks like \`\`\`json, just pure JSON text.`;

    try {
        console.log(`Generating Weekly report via Gemini...`);
        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const aiData = JSON.parse(responseText);

        const dataPath = path.join(__dirname, '../src/data/blogPosts.js');
        let fileContent = fs.readFileSync(dataPath, 'utf8');

        const arrayStartIndex = fileContent.indexOf('[');
        const arrayEndIndex = fileContent.lastIndexOf(']');
        const jsonStr = fileContent.substring(arrayStartIndex, arrayEndIndex + 1);
        
        const posts = eval(jsonStr);

        const newId = Math.max(...posts.map(p => p.id)) + 1;
        
        const dateObj = new Date();
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const randomThumbnail = [
            "/blog-images/ai_trend_1.png",
            "/blog-images/ai_trend_2.png",
            "/blog-images/ai_trend_3.png"
        ][Math.floor(Math.random() * 3)];

        const newPost = {
            id: newId,
            slug: aiData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now(),
            category: "Latest AI Analysis",
            title: aiData.title,
            excerpt: aiData.excerpt,
            date: formattedDate,
            readTime: "6 min read",
            image: randomThumbnail,
            views: Math.floor(Math.random() * 500) + 100,
            hashtags: aiData.hashtags,
            content: aiData.content
        };

        posts.unshift(newPost); // Add to top

        const newFileContent = `export const blogPosts = ${JSON.stringify(posts, null, 4)};\n`;
        fs.writeFileSync(dataPath, newFileContent, 'utf8');

        console.log(`Successfully generated and added Weekly AI report.`);

        // --- Send Email to Admin ---
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
            console.log(`Sending AI report to admin...`);
            await resend.emails.send({
                from: 'TrendyFinder Pro <reports@trendyfinder.com>',
                to: process.env.ADMIN_EMAIL,
                subject: `[New AI Report] ${aiData.title}`,
                html: `
                    <div style="font-family: sans-serif; background-color: #0f172a; color: white; padding: 40px; border-radius: 20px;">
                        <h1 style="color: #6366f1;">New Weekly AI Analysis Generated</h1>
                        <p style="font-size: 18px;">${aiData.excerpt}</p>
                        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
                        <div style="margin-bottom: 30px;">
                            ${aiData.content.filter(c => c.text).slice(0, 2).map(c => `
                                <h3 style="color: #818cf8;">${c.subtitle}</h3>
                                <p style="line-height: 1.6; color: #cbd5e1;">${c.text}</p>
                            `).join('')}
                        </div>
                        <a href="${process.env.NEXTAUTH_URL}/blog" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold;">View Full Premium Report</a>
                        <p style="margin-top: 30px; font-size: 12px; color: #64748b;">This analysis was automatically generated and added to TrendyFinder Pro database.</p>
                    </div>
                `
            });
            console.log(`AI report email sent to ${process.env.ADMIN_EMAIL}.`);
        }
    } catch (e) {
        console.error("Failed to generate report:", e);
        process.exit(1);
    }
}

generateReport();
