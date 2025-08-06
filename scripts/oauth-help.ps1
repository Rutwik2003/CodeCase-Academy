# Google OAuth Configuration Tester
Write-Host "Google OAuth Configuration Tester" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Current Configuration:" -ForegroundColor Yellow
Write-Host "Auth Domain: codebuster-82940.firebaseapp.com" -ForegroundColor White
Write-Host "Local Dev: http://localhost:5173" -ForegroundColor White

Write-Host ""
Write-Host "Required Google Cloud Console OAuth Setup:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor Blue
Write-Host "2. Select project: codebuster-82940" -ForegroundColor Blue
Write-Host "3. Find your OAuth 2.0 Client ID" -ForegroundColor Blue
Write-Host "4. Add these Authorized redirect URIs:" -ForegroundColor Blue
Write-Host ""
Write-Host "   Development URIs:" -ForegroundColor Magenta
Write-Host "   -> https://codebuster-82940.firebaseapp.com/__/auth/handler" -ForegroundColor Gray
Write-Host "   -> http://localhost:5173" -ForegroundColor Gray
Write-Host "   -> http://localhost:5173/__/auth/handler" -ForegroundColor Gray
Write-Host "   -> http://127.0.0.1:5173" -ForegroundColor Gray

Write-Host ""
Write-Host "Testing Steps:" -ForegroundColor Green
Write-Host "1. Clear browser cache or use incognito mode" -ForegroundColor Gray
Write-Host "2. Visit: http://localhost:5173" -ForegroundColor Gray
Write-Host "3. Click Continue with Google" -ForegroundColor Gray
Write-Host "4. Should redirect to Google login without 404" -ForegroundColor Gray

Write-Host ""
Write-Host "Quick Links:" -ForegroundColor Cyan
Write-Host "Google Cloud Console: https://console.cloud.google.com/apis/credentials" -ForegroundColor Gray
Write-Host "Firebase Console: https://console.firebase.google.com/project/codebuster-82940/authentication/settings" -ForegroundColor Gray
