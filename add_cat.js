const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blogPosts.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// A function to try and guess a good category from hashtags or title
function guessCategory(post) {
    const text = (post.title + ' ' + (post.hashtags ? post.hashtags.join(' ') : '')).toLowerCase();
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('yapay zeka')) {
        return 'Yapay Zeka';
    }
    if (text.includes('instagram') || text.includes('tiktok') || text.includes('youtube') || text.includes('pinterest') || text.includes('social media') || text.includes('twitter')) {
        return 'Sosyal Medya';
    }
    if (text.includes('adsense') || text.includes('revenue') || text.includes('money') || text.includes('growth')) {
        return 'Gelir Modelleri';
    }
    if (text.includes('trend') || text.includes('analysis')) {
        return 'Trend Analizi';
    }
    if (text.includes('tech') || text.includes('technology')) {
        return 'Teknoloji';
    }
    
    return 'Genel'; // Default
}

// We need to carefully parse the exported array to add the category.
// Since it's just a JS file exporting a big array, let's use a regex or string replacement strategy that targets the `id` field which is the safest anchor for each object.

const lines = fileContent.split('\n');
let modifiedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    modifiedLines.push(line);
    
    // Look for lines like `"slug": "something",`
    if (line.includes('"slug":')) {
        // Extract the slug to map to a temporary post object to guess category (we don't strictly need to reconstruct the entire object, we can just look ahead a bit for hashtags, but that's complex without full AST).
        // Let's do something simpler:
        // We know the slug, we can extract it.
        const match = line.match(/"slug":\s*"([^"]+)"/);
        if (match) {
            const slug = match[1];
            // Guessing category based on slug and simple logic
            let category = 'Genel';
            if (slug.includes('ai') || slug.includes('artificial')) category = 'Yapay Zeka';
            else if (slug.includes('instagram') || slug.includes('tiktok') || slug.includes('youtube') || slug.includes('pinterest') || slug.includes('twitter')) category = 'Sosyal Medya';
            else if (slug.includes('adsense') || slug.includes('revenue') || slug.includes('money') || slug.includes('growth')) category = 'Gelir Modelleri';
            else if (slug.includes('trend') || slug.includes('viral')) category = 'Trend Analizi';
            else if (slug.includes('tech')) category = 'Teknoloji';
            
            // Push the new category field
            const indentation = line.substring(0, line.indexOf('"'));
            modifiedLines.push(`${indentation}"category": "${category}",`);
        }
    }
}

fs.writeFileSync(filePath, modifiedLines.join('\n'), 'utf8');
console.log('Categories added to blogPosts.js successfully.');
