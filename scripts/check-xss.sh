#!/bin/bash
# XSS Security Check Script
# Scans for dangerous innerHTML usage patterns

echo "🔍 Scanning for potential XSS vulnerabilities..."
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

FOUND_ISSUES=0

# Check for innerHTML assignments with variables
echo "Checking for innerHTML assignments..."
while IFS= read -r line; do
    if [[ $line =~ innerHTML\s*=\s*.*\$ ]] || [[ $line =~ innerHTML\s*=\s*.*\+ ]]; then
        echo -e "${RED}⚠️  Potential XSS:${NC} $line"
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
    fi
done < <(grep -rn "\.innerHTML\s*=" src/js/ --include="*.js" 2>/dev/null)

# Check for innerHTML with template literals
echo ""
echo "Checking for innerHTML with template literals..."
while IFS= read -r line; do
    if [[ $line =~ innerHTML\s*=\s*\` ]]; then
        echo -e "${YELLOW}⚠️  Template literal with innerHTML:${NC} $line"
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
    fi
done < <(grep -rn "\.innerHTML\s*=\s*\`" src/js/ --include="*.js" 2>/dev/null)

# Summary
echo ""
if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No obvious XSS vulnerabilities found${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $FOUND_ISSUES potential XSS issues${NC}"
    echo ""
    echo "Please review and replace with:"
    echo "  - element.textContent = value (for plain text)"
    echo "  - window.Sanitize.setSafeHtml(element, html) (for HTML)"
    exit 1
fi

