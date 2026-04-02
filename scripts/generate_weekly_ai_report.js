const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function generateReport() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = `You are an expert SEO content creator and AI data analyst writing for a modern blog. 
Generate a comprehensive Weekly AI Trend Analysis report strictly between 800 and 1000 words in English.
Focus heavily on SEO-optimization, using strong headings, keywords, and engaging detailed paragraphs.
The report must include:
- Daily and hourly viral trends.
- When trends started, their specific topics, and whether they involve bot activity or human growth.
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
    } catch (e) {
        console.error("Failed to generate report:", e);
        process.exit(1);
    }
}

generateReport();
