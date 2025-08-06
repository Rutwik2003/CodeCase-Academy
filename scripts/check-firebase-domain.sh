#!/bin/bash

# Firebase Domain Configuration Checker
# This script helps verify your Firebase auth domain setup

echo "🔍 Firebase Auth Domain Configuration Checker"
echo "=============================================="

# Check current environment variables
echo ""
echo "📋 Current Environment Configuration:"
echo "Auth Domain: $VITE_FIREBASE_AUTH_DOMAIN"
echo "App URL: $VITE_APP_URL"
echo "Domain: $VITE_DOMAIN"

echo ""
echo "✅ Required Steps to Fix Google OAuth Domain:"
echo ""
echo "1. 🌐 Firebase Console Setup:"
echo "   → Go to: https://console.firebase.google.com/project/codebuster-82940/authentication/settings"
echo "   → Under 'Authorized domains', add: codecase.rutwikdev.com"
echo ""
echo "2. 🔐 Google Cloud Console Setup:"
echo "   → Go to: https://console.cloud.google.com/apis/credentials"
echo "   → Select your OAuth 2.0 Client ID"
echo "   → Add to 'Authorized redirect URIs':"
echo "     - https://codecase.rutwikdev.com/__/auth/handler"
echo "     - https://codecase.rutwikdev.com"
echo ""
echo "3. 🔄 Restart Development Server:"
echo "   → Stop current dev server (Ctrl+C)"
echo "   → Run: npm run dev"
echo ""
echo "4. 🧪 Test the Configuration:"
echo "   → Visit: http://localhost:5173"
echo "   → Click 'Continue with Google'"
echo "   → Should now show: 'to continue to codecase.rutwikdev.com'"
echo ""

# Check if running in development
if [ "$NODE_ENV" = "development" ]; then
    echo "⚠️  Development Mode Detected:"
    echo "   → Also add 'localhost:5173' to authorized domains for local testing"
fi

echo ""
echo "💡 Note: Changes may take 5-10 minutes to propagate globally"
echo "🔗 Useful Links:"
echo "   → Firebase Console: https://console.firebase.google.com/project/codebuster-82940"
echo "   → Google Cloud Console: https://console.cloud.google.com/apis/credentials"
