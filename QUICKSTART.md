# Quick Start Guide

Get Toddy up and running in 5 minutes!

## 🚀 For Developers

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/toddy.git
cd toddy

# Install all dependencies
npm install
```

### 2. Run Locally

#### Desktop App
```bash
npm run dev:desktop
```
The Tauri app will open automatically with hot reload enabled.

#### Landing Page
```bash
npm run dev:landing
```
Visit [http://localhost:4321](http://localhost:4321)

#### Both Apps
```bash
npm run dev
```

## 🌐 Deploy to AWS (Landing Page)

### Prerequisites
- AWS account
- AWS credentials configured

### Deploy

```bash
# Deploy to production
npm run deploy

# Or deploy to development
npm run deploy:dev
```

That's it! SST will handle everything automatically.

**First deployment takes ~5 minutes. Subsequent deployments are faster.**

## 📦 Create a Desktop Release

### 1. Update Version

Update version in these files:
- `apps/desktop/package.json`
- `apps/desktop/src-tauri/Cargo.toml`
- `apps/desktop/src-tauri/tauri.conf.json`

### 2. Create Tag

```bash
git add .
git commit -m "chore: bump version to 1.0.0"
git tag v1.0.0
git push origin v1.0.0
```

### 3. Wait for GitHub Actions

GitHub Actions will automatically:
- ✅ Build for Windows, macOS, Linux
- ✅ Create installers
- ✅ Create GitHub release
- ✅ Upload installers

**Check the Actions tab to see progress!**

## 🔧 Common Commands

### Development
```bash
npm run dev:landing      # Start landing page dev server
npm run dev:desktop      # Start desktop app dev mode
npm run dev              # Start both
```

### Building
```bash
npm run build:landing    # Build landing page
npm run build:desktop    # Build desktop app (current platform)
```

### Deployment
```bash
npm run deploy           # Deploy to AWS production
npm run deploy:dev       # Deploy to AWS dev
npm run sst:dev          # SST development mode
```

### SST Management
```bash
npx sst deploy --stage production    # Deploy specific stage
npx sst url --stage production       # Get deployment URL
npx sst remove --stage dev            # Remove deployment
npx sst logs --stage production       # View logs
```

## 📚 Next Steps

1. **Read the full README**: [README.md](./README.md)
2. **Deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Configure AWS**: Set up custom domain, monitoring, etc.
4. **Set up GitHub**: Configure secrets for automated deployment

## ⚠️ Troubleshooting

### Desktop app won't start

**Problem**: Tauri dependencies missing

**Solution**:
- **macOS**: `xcode-select --install`
- **Linux**: Install webkit2gtk and build tools (see [DEPLOYMENT.md](./DEPLOYMENT.md))
- **Windows**: Install Visual C++ Build Tools and WebView2

### Deployment fails

**Problem**: AWS credentials not configured

**Solution**:
```bash
# Configure AWS credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### TypeScript errors

**Problem**: Type errors in IDE

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🆘 Need Help?

- 📖 [Full Documentation](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Report Issues](https://github.com/yourusername/toddy/issues)
- 💬 [Discussions](https://github.com/yourusername/toddy/discussions)

---

**Happy coding! 🎉**
