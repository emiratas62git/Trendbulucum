const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blogPosts.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find missing categories and translate existing ones
// Since blogPosts is an exported array, we can use a regex to replace the category strings.

const translations = {
    '"Yapay Zeka"': '"AI"',
    '"Sosyal Medya"': '"Social Media"',
    '"Gelir Modelleri"': '"Monetization"',
    '"Trend Analizi"': '"Trends"',
    '"Teknoloji"': '"Technology"',
    '"Genel"': '"General"'
};

for (const [tr, en] of Object.entries(translations)) {
    content = content.replace(new RegExp(`"category":\\s*${tr}`, 'g'), `"category": ${en}`);
}

// Now we need to find if any blog post is MISSING a category property entirely.
// A safe way is to regex search for each object block { ... id: ... } 
// If it has no category, we inject `"category": "General",` after id.
// We can do this with a somewhat complex regex or manual parsing.
const lines = content.split('\n');
let insideObject = false;
let currentObjectId = null;
let hasCategory = false;
let objectStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Naive block detection
    if (line.match(/^\s*\{\s*$/)) {
        insideObject = true;
        hasCategory = false;
        objectStartIndex = i;
    }
    
    if (insideObject) {
        if (line.includes('"id":') || line.includes('id:')) {
            const match = line.match(/id:\s*(\d+)/i) || line.match(/"id":\s*(\d+)/i);
            if (match) currentObjectId = match[1];
        }
        if (line.includes('"category":') || line.includes('category:')) {
            hasCategory = true;
        }
        
        if (line.match(/^\s*\},?\s*$/)) {
            if (!hasCategory && currentObjectId) {
                console.log(`Found post ID ${currentObjectId} missing a category. Fixing...`);
                // Insert category right after the id line
                for (let j = objectStartIndex; j <= i; j++) {
                    if (lines[j].includes('"id":') || lines[j].includes('id:')) {
                        lines.splice(j + 1, 0, `        "category": "General",`);
                        i++; // adjust for the added line
                        break;
                    }
                }
            }
            insideObject = false;
            currentObjectId = null;
            hasCategory = false;
        }
    }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Finished updating categories.');
