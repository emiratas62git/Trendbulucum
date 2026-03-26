const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blogPosts.js');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Array of unique high-quality Unsplash photo IDs related to tech, business, social media
const uniqueIds = [
    '1518770660439-4636190af475', // Circuit tech
    '1451187580459-43490279c0fa', // Global data
    '1526374965328-7f61d4dc18c5', // Code / data
    '1488590528505-98d2b5aba04b', // Laptop code
    '1504384308090-c894fdcc538d', // Analytics
    '1460925895917-afdab827c52f', // Phone connection
    '1611162617474-5b21e879e113', // Social Media Icons style
    '1563986768609-322da13575f3', // Analytics tracking
];

let nextIdIndex = 0;

const getNewImageUrl = () => {
    const id = uniqueIds[nextIdIndex % uniqueIds.length];
    nextIdIndex++;
    return `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=60`;
};

// Based on our previous analysis, we know the exact line numbers (1-indexed) of duplicates
// However, the file might have shifted slightly due to insertions/deletions. 
// A safer way: scan and remember seen images.
const seenImages = new Set();
let replacements = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\s*"?image"?\s*:\s*['"])([^'"]+)(['"].*)$/);
    if (match) {
        const prefix = match[1];
        const imagePath = match[2];
        const suffix = match[3];

        if (seenImages.has(imagePath)) {
            // It's a duplicate. Replace with a new one.
            const newUrl = getNewImageUrl();
            lines[i] = `${prefix}${newUrl}${suffix}`;
            replacements++;
            console.log(`Replaced duplicate image at line ${i + 1} with ${newUrl}`);
        } else {
            // First time seeing this image
            seenImages.add(imagePath);
        }
    }
}

if (replacements > 0) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Successfully replaced ${replacements} duplicate images.`);
} else {
    console.log('No duplicates found or replaced.');
}
