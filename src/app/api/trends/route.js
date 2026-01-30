import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic'; // Ensure it's not cached statically

export async function GET() {
    try {
        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
            },
            customFields: {
                item: [
                    ['ht:approx_traffic', 'traffic'],
                    ['ht:picture', 'picture'],
                    ['ht:news_item', 'newsItem'],
                ]
            }
        });

        // Google Trends World (US as proxy for global) RSS
        // Verified updated URL for 2026: https://trends.google.com/trending/rss?geo=US
        const feed = await parser.parseURL('https://trends.google.com/trending/rss?geo=US');

        const trends = feed.items.map((item, index) => {
            return {
                id: `real-${index}`,
                title: item.title,
                traffic: item.traffic,
                link: item.link,
                pubDate: item.pubDate,
                picture: item.picture,
                news: item.newsItem
            };
        });

        return NextResponse.json({ success: true, data: trends });

    } catch (error) {
        console.error('Trend API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch trends' }, { status: 500 });
    }
}
