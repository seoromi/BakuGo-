# XSS Security Check Script (PowerShell)
# Scans for dangerous innerHTML usage patterns

Write-Host "🔍 Scanning for potential XSS vulnerabilities..." -ForegroundColor Cyan
Write-Host ""

$foundIssues = 0

# Check for innerHTML assignments with variables
Write-Host "Checking for innerHTML assignments..." -ForegroundColor Yellow
$innerHtmlMatches = Get-ChildItem -Path "src\js" -Filter "*.js" -Recurse | 
    Select-String -Pattern "\.innerHTML\s*=" | 
    Where-Object { $_.Line -match '\$|`|\+' }

foreach ($match in $innerHtmlMatches) {
    Write-Host "⚠️  Potential XSS: $($match.Filename):$($match.LineNumber)" -ForegroundColor Red
    Write-Host "   $($match.Line.Trim())" -ForegroundColor Gray
    $foundIssues++
}

# Summary
Write-Host ""
if ($foundIssues -eq 0) {
    Write-Host "✅ No obvious XSS vulnerabilities found" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Found $foundIssues potential XSS issues" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review and replace with:" -ForegroundColor Yellow
    Write-Host "  - element.textContent = value (for plain text)" -ForegroundColor White
    Write-Host "  - window.Sanitize.setSafeHtml(element, html) (for HTML)" -ForegroundColor White
    exit 1
}

