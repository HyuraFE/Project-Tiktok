# Quick Deploy Script - Push to GitHub for Vercel Auto-Deploy

Write-Host "🚀 Preparing to Push to GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
$continue = Read-Host "Do you want to commit and push these changes? (y/n)"

if ($continue -eq "y" -or $continue -eq "Y") {
    Write-Host ""
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    Write-Host ""
    Write-Host "📦 Adding files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "$commitMessage"
    
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin master
    
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "If you have Vercel connected, it will auto-deploy now!" -ForegroundColor Cyan
    Write-Host "Check your Vercel dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "❌ Cancelled." -ForegroundColor Red
}
