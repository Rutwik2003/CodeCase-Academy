# 🛠️ Tools Directory

This directory contains utility scripts, build tools, and helper utilities for the CodeCase Detective Academy project.

## 📁 Directory Structure

### [`scripts/`](./scripts/)
PowerShell and shell scripts for automation
- [`deploy.ps1`](./scripts/deploy.ps1) - Deployment automation script
- [`update-case.ps1`](./scripts/update-case.ps1) - Case update utilities
- [`update-case-fixed.ps1`](./scripts/update-case-fixed.ps1) - Fixed case update script
- [`check-firebase-domain.ps1`](./scripts/check-firebase-domain.ps1) - Firebase domain verification
- [`oauth-help.ps1`](./scripts/oauth-help.ps1) - OAuth configuration helper
- [`optimize-images.ps1`](./scripts/optimize-images.ps1) - Image optimization automation
- [`test-oauth-config.ps1`](./scripts/test-oauth-config.ps1) - OAuth testing utilities

### [`utilities/`](./utilities/)
JavaScript/Node.js utility scripts
- [`comment-console-logs.mjs`](./utilities/comment-console-logs.mjs) - Comment out console.log statements
- [`fix-logger.mjs`](./utilities/fix-logger.mjs) - Logger system fixes
- [`fix-unused-params.mjs`](./utilities/fix-unused-params.mjs) - Remove unused parameters
- [`replace-console-logs.mjs`](./utilities/replace-console-logs.mjs) - Replace console statements
- [`test-formatting.mjs`](./utilities/test-formatting.mjs) - Code formatting utilities
- [`validate-env.mjs`](./utilities/validate-env.mjs) - Environment validation

### [`debug/`](./debug/)
Debug scripts and utilities (from existing tools directory)

### [`testing/`](./testing/)
Testing utilities and scripts (from existing tools directory)

## 🚀 Usage

### Environment Validation
```bash
node tools/utilities/validate-env.mjs
```

### Code Cleanup
```bash
# Comment out console.log statements
node tools/utilities/comment-console-logs.mjs

# Fix unused parameters
node tools/utilities/fix-unused-params.mjs

# Fix logger issues
node tools/utilities/fix-logger.mjs
```

### Deployment
```powershell
# Deploy to production
.\tools\scripts\deploy.ps1

# Update case content
.\tools\scripts\update-case.ps1
```

### OAuth Configuration
```powershell
# Test OAuth configuration
.\tools\scripts\test-oauth-config.ps1

# Get OAuth help
.\tools\scripts\oauth-help.ps1
```

## 📋 Prerequisites

### For JavaScript/Node.js scripts:
- Node.js 18+
- npm dependencies installed

### For PowerShell scripts:
- PowerShell 5.1+ (Windows)
- PowerShell Core 7+ (Cross-platform)
- Required modules as specified in individual scripts

## 🔧 Development

When adding new tools:

1. **Scripts**: Add to `scripts/` directory with appropriate file extension
2. **Utilities**: Add to `utilities/` directory for Node.js utilities
3. **Documentation**: Update this README with usage instructions
4. **Testing**: Ensure tools work in both development and CI environments

## 📞 Support

For issues with tools and utilities:

1. Check the tool's inline documentation
2. Verify prerequisites are met
3. Test in a clean environment
4. Report issues with detailed error messages

---

**Note**: All tools are designed to work from the project root directory. Run them using relative paths from the project root.
