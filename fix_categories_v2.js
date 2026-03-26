const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blogPosts.js');
let content = fs.readFileSync(filePath, 'utf8');

// The tricky part is some objects are formatted:
// {
//     id: 24,
//     slug: '...',
//     title: '...',
// }
// without quotes.

// Let's use string replacement to inject `category: '...',` right after `slug:` for all objects missing it.

let lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if the line has `slug:` or `"slug":`
    if (line.match(/^\s*"?slug"?\s*:/)) {
        // Check if the previous or next few lines have a category
        let hasCategory = false;
        // scan from i-2 to i+2
        for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 3); j++) {
            if (lines[j].includes('category:')) {
                hasCategory = true;
                break;
            }
        }
        
        if (!hasCategory) {
            // we found a slug but no category. Let's analyze the slug to assign a category.
            const match = line.match(/^\s*"?slug"?\s*:\s*['"]([^'"]+)['"]/);
            if (match) {
                const slug = match[1];
                let category = 'General';
                
                if (slug.includes('ai') || slug.includes('artificial')) category = 'AI';
                else if (slug.includes('instagram') || slug.includes('tiktok') || slug.includes('youtube') || slug.includes('pinterest') || slug.includes('twitter') || slug.includes('viral') || slug.includes('algorithm')) category = 'Social Media';
                else if (slug.includes('adsense') || slug.includes('revenue') || slug.includes('money') || slug.includes('monetize') || slug.includes('monetization') || slug.includes('growth')) category = 'Monetization';
                else if (slug.includes('trend') || slug.includes('discovery')) category = 'Trends';
                else if (slug.includes('tech')) category = 'Technology';
                
                // Get indentation of the slug line
                const indent = line.match(/^\s*/)[0];
                lines.splice(i + 1, 0, `${indent}category: '${category}',`);
                modified = true;
                i++; // skip the newly inserted line
                console.log(`Inserted category '${category}' for slug '${slug}'`);
            }
        }
    }
}

if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    // Run an additional translation to be 100% sure we don't have Turkish categories left
    let newContent = fs.readFileSync(filePath, 'utf8');
    newContent = newContent
        .replace(/category:\s*['"]Yapay Zeka['"]/g, "category: 'AI'")
        .replace(/category:\s*['"]Sosyal Medya['"]/g, "category: 'Social Media'")
        .replace(/category:\s*['"]Gelir Modelleri['"]/g, "category: 'Monetization'")
        .replace(/category:\s*['"]Trend Analizi['"]/g, "category: 'Trends'")
        .replace(/category:\s*['"]Teknoloji['"]/g, "category: 'Technology'")
        .replace(/category:\s*['"]Genel['"]/g, "category: 'General'");
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Finished updating missing categories.');
} else {
    console.log('No missing categories found.');
}
