# 🧪 Tests Directory

This directory contains all test files, debug utilities, and testing configurations for the CodeCase Detective Academy project.

## 📁 Test Structure

### 🔥 Firebase Tests
- [`firebase-test.js`](./firebase-test.js) - Firebase integration testing
- [`firestore-test.js`](./firestore-test.js) - Firestore database testing
- [`test-firebase-auth.js`](./test-firebase-auth.js) - Firebase authentication testing

### 🔐 OAuth Testing
- [`oauth-test.html`](./oauth-test.html) - OAuth flow testing interface

### 🐛 Debug Utilities
- [`debug_referral_system.js`](./debug_referral_system.js) - Referral system debugging

## 🚀 Running Tests

### Firebase Tests
```bash
# Test Firebase connection
node tests/firebase-test.js

# Test Firestore operations
node tests/firestore-test.js

# Test Firebase authentication
node tests/test-firebase-auth.js
```

### OAuth Testing
```bash
# Open OAuth test interface
# Serve oauth-test.html through a local server
npx serve tests/
# Navigate to http://localhost:3000/oauth-test.html
```

### Debug Scripts
```bash
# Debug referral system
node tests/debug_referral_system.js
```

## 🔧 Test Configuration

### Environment Setup
Ensure the following environment variables are set for testing:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Test Data
- Use test user accounts for authentication testing
- Ensure test data doesn't interfere with production
- Clean up test data after running tests

## 📋 Test Categories

### ✅ Integration Tests
- Firebase connectivity
- Authentication flows
- Database operations
- API endpoints

### 🔍 Debug Tests
- System state validation
- Error reproduction
- Performance monitoring
- Data integrity checks

### 🌐 OAuth Tests
- Google OAuth flow
- Token validation
- User profile retrieval
- Session management

## 🛡️ Test Safety

### Production Safety
- Never run tests against production databases
- Use separate Firebase projects for testing
- Implement test data isolation
- Monitor test impact on quotas

### Data Privacy
- Use anonymized test data
- No real user information in tests
- Secure test credentials
- Regular cleanup of test artifacts

## 📊 Test Reports

### Coverage
- Aim for >80% test coverage
- Monitor critical path coverage
- Regular coverage reports

### Performance
- Database query performance
- Authentication speed
- UI responsiveness
- Memory usage

## 🔄 Continuous Integration

Tests are automatically run in CI/CD pipeline:

1. **Pre-commit**: Basic validation tests
2. **Pull Request**: Full test suite
3. **Deployment**: Smoke tests
4. **Post-deployment**: Integration tests

## 📞 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Check environment variables
   - Verify Firebase project configuration
   - Ensure network connectivity

2. **Authentication Failures**
   - Verify OAuth configuration
   - Check Firebase Auth settings
   - Validate test user accounts

3. **Database Access Issues**
   - Review Firestore rules
   - Check service account permissions
   - Verify database indexes

### Debug Tips

1. Enable verbose logging
2. Use Firebase emulators for local testing
3. Check browser console for client-side errors
4. Monitor Firebase console for server-side issues

---

**Important**: Always run tests in a safe environment and never against production data.
