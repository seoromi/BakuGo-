/**
 * Method Extraction Helper Script
 * 
 * This Node.js script helps extract methods from admin.js into separate modules.
 * 
 * Usage:
 *   node extract-methods.js [module-name] [method1] [method2] ...
 * 
 * Example:
 *   node extract-methods.js renderers renderToursTable renderBookingsTable
 * 
 * This will:
 * 1. Find the methods in admin.js
 * 2. Extract them to admin-renderers.js
 * 3. Convert them to prototype assignments
 */

const fs = require('fs');
const path = require('path');

const ADMIN_JS = path.join(__dirname, 'admin.js');

function extractMethods(moduleName, methodNames) {
    console.log(`Extracting methods to admin-${moduleName}.js...`);
    
    // Read admin.js
    const content = fs.readFileSync(ADMIN_JS, 'utf8');
    const lines = content.split('\n');
    
    // Find method boundaries
    const methods = {};
    let currentMethod = null;
    let currentStart = -1;
    let indentLevel = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this is a method we want to extract
        const methodMatch = line.match(/^    ([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/);
        if (methodMatch) {
            const methodName = methodMatch[1];
            
            if (methodNames.includes(methodName)) {
                currentMethod = methodName;
                currentStart = i;
                indentLevel = line.match(/^(\s*)/)[1].length;
                methods[methodName] = {
                    start: i,
                    end: -1,
                    lines: []
                };
            }
        }
        
        // Track current method
        if (currentMethod) {
            methods[currentMethod].lines.push(line);
            
            // Check for method end (next method or class end)
            const nextMethodMatch = line.match(/^    [a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/);
            const classEndMatch = line.match(/^}$/);
            const nextClassMatch = line.match(/^class /);
            
            if (i > currentStart && (
                (nextMethodMatch && line.match(/^(\s*)/)[1].length === indentLevel) ||
                classEndMatch ||
                nextClassMatch
            )) {
                // Remove last line (it's the start of next method)
                if (nextMethodMatch) {
                    methods[currentMethod].lines.pop();
                }
                methods[currentMethod].end = i - 1;
                currentMethod = null;
            }
        }
    }
    
    // Generate module file
    let moduleContent = `// Admin Panel ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module
// This module extends AdminPanel with ${moduleName} functionality

(function() {
    'use strict';
    
    if (typeof AdminPanel === 'undefined') {
        console.error('AdminPanel class must be loaded before admin-${moduleName}.js');
        return;
    }

`;
    
    // Convert methods to prototype assignments
    methodNames.forEach(methodName => {
        if (methods[methodName]) {
            const methodLines = methods[methodName].lines;
            
            // Remove the method name line and convert to prototype assignment
            const firstLine = methodLines[0];
            const methodSignature = firstLine.match(/^    ([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(\([^)]*\)\s*\{)/);
            
            if (methodSignature) {
                moduleContent += `    AdminPanel.prototype.${methodName} = function${methodSignature[2]}\n`;
                
                // Add remaining lines (adjust indentation)
                for (let i = 1; i < methodLines.length; i++) {
                    let line = methodLines[i];
                    // Remove 4 spaces of indentation (method level)
                    if (line.startsWith('        ')) {
                        line = line.substring(4);
                    }
                    moduleContent += line + '\n';
                }
                moduleContent += '\n';
            }
        } else {
            console.warn(`Method ${methodName} not found in admin.js`);
        }
    });
    
    moduleContent += `})();\n`;
    
    // Write module file
    const modulePath = path.join(__dirname, `admin-${moduleName}.js`);
    fs.writeFileSync(modulePath, moduleContent);
    console.log(`✅ Created ${modulePath}`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Review the extracted methods`);
    console.log(`   2. Remove them from admin.js`);
    console.log(`   3. Add script tag to HTML in correct order`);
    console.log(`   4. Test functionality`);
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node extract-methods.js [module-name] [method1] [method2] ...');
        console.log('Example: node extract-methods.js renderers renderToursTable renderBookingsTable');
        process.exit(1);
    }
    
    const moduleName = args[0];
    const methodNames = args.slice(1);
    extractMethods(moduleName, methodNames);
}

module.exports = { extractMethods };

