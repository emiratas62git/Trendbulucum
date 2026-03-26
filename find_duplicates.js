const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blogPosts.js');
let content = fs.readFileSync(filePath, 'utf8');

const imageMap = {};
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*"?image"?\s*:\s*['"]([^'"]+)['"]/);
    if (match) {
        const imagePath = match[1];
        if (!imageMap[imagePath]) {
            imageMap[imagePath] = [];
        }
        imageMap[imagePath].push(i + 1); // store line number
    }
}

let foundDuplicates = false;
for (const [img, lines] of Object.entries(imageMap)) {
    if (lines.length > 1) {
        foundDuplicates = true;
        console.log(`Duplicate found: ${img} appears on lines ${lines.join(', ')}`);
    }
}

if (!foundDuplicates) {
    console.log("No duplicate images found.");
}
