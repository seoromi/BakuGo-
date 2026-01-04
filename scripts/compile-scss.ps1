# =====================================================
# SCSS Compilation Script
# Compiles all SCSS entry files to css/ folder
# =====================================================

Write-Output "=== Compiling SCSS to CSS ==="
Write-Output ""

$entryFiles = @(
    'main', 'search', 'nav', 'slider', 'booking-modal', 
    'footer', 'responsive', 'explore', 'admin', 
    'all-tours', 'alltours-nav', 'page', 'destination'
)

$successCount = 0
$failCount = 0

foreach ($file in $entryFiles) {
    $scssPath = "src\scss\entry-points\$file.scss"
    $cssPath = "dist\css\$file.css"
    
    if (Test-Path $scssPath) {
        Write-Output "Compiling: $file.scss -> $cssPath"
        
        # Compile with compressed output, no source map
        sass $scssPath $cssPath --style=compressed --no-source-map 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            $size = (Get-Item $cssPath).Length
            Write-Output "  [OK] $([math]::Round($size/1KB, 1))KB" -ForegroundColor Green
            $successCount++
        } else {
            Write-Output "  [ERROR] Failed to compile" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Output "  [WARNING] $scssPath not found" -ForegroundColor Yellow
    }
}

Write-Output ""
Write-Output "=== Summary ==="
Write-Output "Success: $successCount"
Write-Output "Failed: $failCount"
Write-Output ""
Write-Output "All CSS files are in dist/css/ folder"

