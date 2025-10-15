# Deployment Guide

This guide covers deploying the Toddy landing page to AWS using SST and creating GitHub releases for the desktop application.

## Table of Contents

- [AWS Deployment (Landing Page)](#aws-deployment-landing-page)
- [GitHub Releases (Desktop App)](#github-releases-desktop-app)
- [CI/CD Workflows](#cicd-workflows)
- [Environment Setup](#environment-setup)

## AWS Deployment (Landing Page)

The Astro landing page is deployed to AWS using [SST (Serverless Stack)](https://sst.dev/), which provides a modern infrastructure-as-code framework.

### Prerequisites

1. **AWS Account**
   - Sign up at [aws.amazon.com](https://aws.amazon.com)
   - Have AWS credentials ready (Access Key ID and Secret Access Key)

2. **AWS CLI** (optional but recommended)
   ```bash
   # Install AWS CLI
   brew install awscli  # macOS
   # or download from https://aws.amazon.com/cli/

   # Configure credentials
   aws configure
   ```

3. **Node.js 18+** and **npm 9+**

### Local Development with SST

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Deploy to your AWS account**
   ```bash
   # Deploy to development stage
   npx sst deploy

   # Deploy to production
   npx sst deploy --stage production
   ```

3. **Start local development**
   ```bash
   npx sst dev
   ```
   This starts the SST development environment with live Lambda function reloading.

### SST Configuration

The SST configuration is in [`sst.config.ts`](./sst.config.ts):

```typescript
export default $config({
  app(input) {
    return {
      name: "toddy",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const landing = new sst.aws.Astro("ToddyLanding", {
      path: "apps/landing",
      buildCommand: "npm run build",
      environment: {
        PUBLIC_SITE_URL: $app.stage === "production"
          ? "https://toddy.app"
          : `https://${$app.stage}.toddy.app`,
      },
    });

    return { url: landing.url };
  },
});
```

### Custom Domain Setup

To use a custom domain:

1. **Purchase/configure domain in Route 53** (or use existing domain)

2. **Update `sst.config.ts`**:
   ```typescript
   const landing = new sst.aws.Astro("ToddyLanding", {
     // ... other config
     domain: {
       name: $app.stage === "production" ? "toddy.app" : `${$app.stage}.toddy.app`,
       redirects: $app.stage === "production" ? ["www.toddy.app"] : [],
     },
   });
   ```

3. **Deploy**:
   ```bash
   npx sst deploy --stage production
   ```

### GitHub Actions Deployment

Automatic deployment is configured in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

#### Setup GitHub Secrets

Navigate to your repository **Settings → Secrets and variables → Actions** and add:

##### Option 1: AWS OIDC (Recommended - More Secure)

1. Create an IAM role with trust policy for GitHub OIDC
2. Add secret:
   - `AWS_ROLE_ARN`: ARN of the IAM role (e.g., `arn:aws:iam::123456789012:role/GitHubActionsRole`)

##### Option 2: AWS Access Keys (Simpler but less secure)

Add secrets:
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

#### Deployment Triggers

- **Production deployment**: Automatically deploys on push to `main` branch
- **Preview deployment**: Automatically creates preview environments for pull requests
- **Manual deployment**: Use workflow dispatch to deploy manually

### SST Commands

```bash
# Deploy to a specific stage
npx sst deploy --stage production
npx sst deploy --stage staging
npx sst deploy --stage dev

# Get deployment info
npx sst url --stage production

# Remove a deployment
npx sst remove --stage dev

# View logs
npx sst logs --stage production

# Connect to your app
npx sst dev --stage production
```

### AWS Resources Created

SST automatically creates and manages:

- **S3 Bucket**: Stores static assets
- **CloudFront Distribution**: CDN for global content delivery
- **Lambda@Edge**: Server-side rendering
- **Route 53 Records**: DNS configuration (if custom domain configured)
- **ACM Certificate**: SSL/TLS certificate (if custom domain configured)

### Cost Estimation

Typical monthly costs for a low-traffic site:

- **CloudFront**: $0.085 per GB + $0.01 per 10,000 requests
- **S3**: $0.023 per GB storage
- **Lambda**: Free tier covers most small sites (1M requests/month)
- **Route 53**: $0.50 per hosted zone + $0.40 per million queries

**Estimated total**: $1-5/month for small sites

## GitHub Releases (Desktop App)

GitHub releases are automatically created when you push a version tag.

### Creating a Release

1. **Update version in `apps/desktop/package.json`**
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Update version in `apps/desktop/src-tauri/Cargo.toml`**
   ```toml
   [package]
   version = "1.0.0"
   ```

3. **Update version in `apps/desktop/src-tauri/tauri.conf.json`**
   ```json
   {
     "package": {
       "version": "1.0.0"
     }
   }
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.0"
   ```

5. **Create and push tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

6. **GitHub Actions will automatically**:
   - Build for Windows, macOS, and Linux
   - Create installers (`.msi`, `.dmg`, `.deb`, `.AppImage`)
   - Create a GitHub release
   - Upload installers as release assets
   - Generate release notes from commits

### Release Workflow

The release workflow is in [`.github/workflows/release.yml`](./.github/workflows/release.yml).

#### Features

- **Multi-platform builds**: Windows, macOS, Linux
- **Automatic installers**: Platform-specific installers
- **Auto-generated release notes**: Based on git commits
- **Asset uploads**: Binaries attached to release

### Manual Release Creation

You can also create releases manually:

1. Go to **Releases** in your GitHub repository
2. Click **Draft a new release**
3. Choose a tag or create a new one
4. Fill in release notes
5. Upload binaries manually
6. Publish release

## CI/CD Workflows

### Continuous Integration ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))

Runs on every push and pull request:

- ✅ Build landing page
- ✅ Build desktop app
- ✅ TypeScript type checking
- ✅ Run tests (when configured)

### Deployment ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml))

- **Production**: Deploys on push to `main`
- **Preview**: Creates preview environment for PRs

### Release ([`.github/workflows/release.yml`](./.github/workflows/release.yml))

- Triggered by version tags (e.g., `v1.0.0`)
- Builds desktop apps for all platforms
- Creates GitHub release with installers

## Environment Setup

### Local Environment Variables

Create a `.env` file in the project root (not committed to git):

```env
# AWS Credentials (for local SST development)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1

# SST Configuration
SST_STAGE=dev
```

### GitHub Actions Environment Variables

Set these in **Settings → Environments**:

#### Production Environment

Variables:
- `AWS_REGION`: `us-east-1` (or your preferred region)

Secrets:
- `AWS_ROLE_ARN` or `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`

#### Preview Environment

Variables:
- `AWS_REGION`: `us-east-1`

Secrets:
- Same as production (can use same credentials)

## Monitoring and Logs

### View CloudFront Logs

```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### View Lambda Logs

```bash
npx sst logs --stage production
```

### CloudWatch

Access logs via AWS Console → CloudWatch → Log Groups

## Troubleshooting

### SST Deployment Fails

**Problem**: `Error: Cannot find module 'aws-cdk-lib'`

**Solution**:
```bash
npm install --save-dev sst aws-cdk-lib constructs
```

### GitHub Actions Release Fails

**Problem**: "Permission denied" or "Resource not accessible"

**Solution**:
- Ensure `GITHUB_TOKEN` has write permissions
- Check repository settings → Actions → General → Workflow permissions
- Set to "Read and write permissions"

### Custom Domain Not Working

**Problem**: Domain doesn't resolve

**Solution**:
1. Verify DNS records in Route 53
2. Check ACM certificate validation
3. Wait 24-48 hours for DNS propagation
4. Verify CloudFront distribution status

### Build Fails on Windows

**Problem**: Tauri build fails on Windows

**Solution**:
- Install Microsoft C++ Build Tools
- Install WebView2 Runtime
- See [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

## Security Best Practices

1. **Use AWS OIDC** instead of access keys for GitHub Actions
2. **Enable MFA** on AWS account
3. **Use least privilege** IAM policies
4. **Rotate credentials** regularly
5. **Never commit** `.env` files or secrets
6. **Use GitHub Environments** for deployment approvals
7. **Enable branch protection** on `main` branch

## Cost Optimization

1. **Use CloudFront caching** aggressively
2. **Enable compression** for assets
3. **Use S3 Intelligent-Tiering** for storage
4. **Remove old preview deployments**:
   ```bash
   npx sst remove --stage preview-123
   ```
5. **Monitor AWS costs** in Billing Dashboard

## Next Steps

- [ ] Configure custom domain
- [ ] Set up monitoring alerts
- [ ] Add automated tests
- [ ] Configure staging environment
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add analytics tracking
- [ ] Configure backup strategy

## Resources

- [SST Documentation](https://sst.dev/docs)
- [Astro Documentation](https://docs.astro.build)
- [Tauri Documentation](https://tauri.app)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [AWS Documentation](https://docs.aws.amazon.com)

## Support

For issues or questions:
- Open an issue in the [GitHub repository](https://github.com/yourusername/toddy/issues)
- Check [SST Discord](https://discord.gg/sst)
- Review [Tauri Discord](https://discord.com/invite/tauri)
