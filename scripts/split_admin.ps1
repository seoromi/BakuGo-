$content = Get-Content 'scss/pages/_admin.scss' -Raw
$lines = $content -split "`r?`n"

# Extract base.scss (lines 36-699, 0-indexed: 35-698)
($lines[35..698] -join "`n") | Out-File -FilePath 'scss/admin/_base.scss' -Encoding UTF8 -NoNewline

# Extract components.scss (lines 700-2024, 0-indexed: 699-2023)
($lines[699..2023] -join "`n") | Out-File -FilePath 'scss/admin/_components.scss' -Encoding UTF8 -NoNewline

# Extract utilities.scss (lines 2027-2152, 0-indexed: 2026-2151)
($lines[2026..2151] -join "`n") | Out-File -FilePath 'scss/admin/_utilities.scss' -Encoding UTF8 -NoNewline

# Extract pages.scss (lines 2177-3469, 0-indexed: 2176-3468)
($lines[2176..3468] -join "`n") | Out-File -FilePath 'scss/admin/_pages.scss' -Encoding UTF8 -NoNewline

Write-Host "Files extracted successfully"

