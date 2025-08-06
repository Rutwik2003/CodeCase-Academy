# 🚀 Quick Vercel Deployment Script
# Run this script to deploy CodeCase Detective Academy to Vercel

Write-Host "🔍 CodeCase Detective Academy - Vercel Deployment" -ForegroundColor Cyan
Write-Host "=" * 50

# Check if Vercel CLI is installed
Write-Host "🔧 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
}

# Security check
Write-Host "`n🔒 Running security scan..." -ForegroundColor Yellow
npm run security-check

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Security scan failed! Please fix issues before deployment." -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "`n🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix build errors." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!" -ForegroundColor Green

# Prompt for deployment type
Write-Host "`n🚀 Ready to deploy!" -ForegroundColor Cyan
$deployType = Read-Host "Choose deployment type: [P]roduction or [p]review? (P/p)"

if ($deployType -eq "P" -or $deployType -eq "p" -or $deployType -eq "") {
    Write-Host "`n🌐 Deploying to production..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "`n🧪 Deploying preview..." -ForegroundColor Yellow
    vercel
}

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Don't forget to set environment variables in Vercel dashboard!" -ForegroundColor Cyan
