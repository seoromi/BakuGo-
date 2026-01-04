// Script to add floating-booking.js to all tour pages
const fs = require('fs');
const path = require('path');

// Function to recursively find all HTML files in a directory
function findHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            results = results.concat(findHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    
    return results;
}

// Function to add script to HTML file
function addScriptToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if script is already added
        if (content.includes('floating-booking.js')) {
            
            return;
        }
        
        // Add script before closing body tag
        const scriptTag = '    <script src="../../js/floating-booking.js"></script>\n</body>';
        content = content.replace('</body>', scriptTag);
        
        fs.writeFileSync(filePath, content, 'utf8');
        
    } catch (error) {
        
    }
}

// Main execution
const pageDir = path.join(__dirname, 'page');
const htmlFiles = findHtmlFiles(pageDir);


htmlFiles.forEach(addScriptToFile);


