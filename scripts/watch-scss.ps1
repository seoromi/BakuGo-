# =====================================================
# SCSS Watch Script
# Watches SCSS entry files and automatically compiles on save
# Run this script to keep watching for changes
# Press Ctrl+C to stop
# =====================================================

Write-Output "=== Starting SCSS Watch Mode ==="
Write-Output "Watching for changes in src/scss/entry-points/ folder..."
Write-Output "Press Ctrl+C to stop"
Write-Output ""

# Start watching each entry file
$entryFiles = @(
    'main', 'search', 'nav', 'slider', 'booking-modal', 
    'footer', 'responsive', 'explore', 'admin', 
    'all-tours', 'alltours-nav', 'page'
)

$jobs = @()

foreach ($file in $entryFiles) {
    $scssPath = "src\scss\entry-points\$file.scss"
    $cssPath = "dist\css\$file.css"
    
    if (Test-Path $scssPath) {
        Write-Output "Watching: $file.scss -> $file.css"
        
        # Start sass watch in background job
        $job = Start-Job -ScriptBlock {
            param($scss, $css)
            sass --watch $scss:$css --style=expanded --no-source-map
        } -ArgumentList (Resolve-Path $scssPath), (Resolve-Path $cssPath)
        
        $jobs += $job
    }
}

Write-Output ""
Write-Output "=== Watching for changes... ==="
Write-Output "All entry files are being watched. Save any SCSS file to compile."
Write-Output ""

# Wait for user interrupt
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Output ""
    Write-Output "Stopping watch mode..."
    $jobs | Stop-Job
    $jobs | Remove-Job
    Write-Output "Watch stopped."
}

