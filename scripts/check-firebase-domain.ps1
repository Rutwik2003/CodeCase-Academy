# Firebase Domain Configuration Checker
# This script helps verify your Firebase auth domain setup

Write-Host "🔍 Firebase Auth Domain Configuration Checker" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check current environment variables
Write-Host ""
Write-Host "📋 Current Environment Configuration:" -ForegroundColor Yellow
Write-Host "Auth Domain: $env:VITE_FIREBASE_AUTH_DOMAIN" -ForegroundColor White
Write-Host "App URL: $env:VITE_APP_URL" -ForegroundColor White
Write-Host "Domain: $env:VITE_DOMAIN" -ForegroundColor White

Write-Host ""
Write-Host "✅ Required Steps to Fix Google OAuth Domain:" -ForegroundColor Green
Write-Host ""
Write-Host "1. 🌐 Firebase Console Setup:" -ForegroundColor Blue
Write-Host "   → Go to: https://console.firebase.google.com/project/codebuster-82940/authentication/settings" -ForegroundColor Gray
Write-Host "   → Under 'Authorized domains', add: codecase.rutwikdev.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔐 Google Cloud Console Setup:" -ForegroundColor Blue  
Write-Host "   → Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor Gray
Write-Host "   → Select your OAuth 2.0 Client ID" -ForegroundColor Gray
Write-Host "   → Add to 'Authorized redirect URIs':" -ForegroundColor Gray
Write-Host "     - https://codecase.rutwikdev.com/__/auth/handler" -ForegroundColor Gray
Write-Host "     - https://codecase.rutwikdev.com" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🔄 Restart Development Server:" -ForegroundColor Blue
Write-Host "   → Stop current dev server (Ctrl+C)" -ForegroundColor Gray
Write-Host "   → Run: npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🧪 Test the Configuration:" -ForegroundColor Blue
Write-Host "   → Visit: http://localhost:5173" -ForegroundColor Gray
Write-Host "   → Click 'Continue with Google'" -ForegroundColor Gray
Write-Host "   → Should now show: 'to continue to codecase.rutwikdev.com'" -ForegroundColor Gray
Write-Host ""

# Check if running in development
if ($env:NODE_ENV -eq "development") {
    Write-Host "⚠️  Development Mode Detected:" -ForegroundColor Yellow
    Write-Host "   → Also add 'localhost:5173' to authorized domains for local testing" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 Note: Changes may take 5-10 minutes to propagate globally" -ForegroundColor Magenta
Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "   → Firebase Console: https://console.firebase.google.com/project/codebuster-82940" -ForegroundColor Gray
Write-Host "   → Google Cloud Console: https://console.cloud.google.com/apis/credentials" -ForegroundColor Gray
