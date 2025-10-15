# Deployment Guide

This guide covers how to deploy the Toddy landing page using SST with automatic GitHub integration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [SST Console Setup (Recommended)](#sst-console-setup-recommended)
- [Manual Deployment](#manual-deployment)
- [GitHub Actions Alternative](#github-actions-alternative)
- [Environment Management](#environment-management)
- [Troubleshooting](#troubleshooting)

## Overview

Toddy uses [SST (Serverless Stack)](https://sst.dev) to deploy the Astro landing page to AWS with CloudFront CDN and Cloudflare DNS. The application supports automatic deployments through the SST Console.

### Deployment Stages

- **Production** (`main` branch) → `toddy.creative-koda.com`
- **Development** (`dev` branch) → `toddy-dev.creative-koda.com`
- **PR Previews** (Pull Requests) → `toddy-pr-{number}.creative-koda.com`

## Prerequisites

1. **AWS Account** with appropriate permissions (CloudFront, S3, CloudFormation, IAM)
2. **Cloudflare Account** with DNS access for `creative-koda.com` domain
3. **Node.js** >= 18.0.0
4. **npm** >= 9.0.0
5. **SST CLI** installed globally: `npm install -g sst`

## SST Console Setup (Recommended)

The SST Console provides automatic deployments triggered by GitHub events without needing GitHub Actions or managing AWS credentials manually.

### Step 1: Create SST Console Account

1. Go to [console.sst.dev](https://console.sst.dev)
2. Sign up or log in with your GitHub account
3. Create a new workspace (or use an existing one)

### Step 2: Connect AWS Account

1. Navigate to **Workspace Settings** → **AWS Accounts**
2. Click **Add Account**
3. Follow the wizard to:
   - Deploy the SST Console connector CloudFormation stack
   - Grant necessary permissions
   - Verify the connection

### Step 3: Enable GitHub Integration

1. Go to **Workspace Settings** → **Integrations**
2. Click **Enable GitHub**
3. Authorize the SST app for your GitHub organization/account
4. Select `Creative-koda-lab/toddy` repository

### Step 4: Configure Autodeploy

1. Navigate to your app's **Settings** → **Autodeploy**
2. Click **Select Repository**
3. Choose `Creative-koda-lab/toddy`
4. Configure the environments:

   **Production Environment:**
   - Stage name: `production`
   - AWS Account: (select your connected account)
   - Region: `us-east-1` (or your preferred region)

   **Development Environment:**
   - Stage name: `dev`
   - AWS Account: (select your connected account)
   - Region: `us-east-1`

5. Save the configuration

### Step 5: Configure Cloudflare Provider

The SST config requires Cloudflare credentials for DNS management.

1. Get your Cloudflare API Token:
   - Log into Cloudflare Dashboard
   - Go to **Profile** → **API Tokens**
   - Create token with permissions: `Zone.DNS (Edit)` for the `creative-koda.com` zone

2. Add to SST Console:
   - Go to **App Settings** → **Environment Variables**
   - Add: `CLOUDFLARE_API_TOKEN` = `your-token-here`

### Step 6: Test Deployment

1. Push a commit to the `dev` branch
2. Go to **Autodeploy** tab in SST Console
3. Monitor the deployment progress
4. Once complete, visit your deployed URL

### What Happens on Deploy?

When you push to GitHub, the SST Console automatically:

1. **Detects the event** (push to branch or PR)
2. **Determines the stage** based on `sst.config.ts` autodeploy rules
3. **Runs the workflow:**
   ```bash
   npm install           # Install dependencies
   npm run build:landing # Build the Astro site
   npm run deploy        # Deploy to AWS with SST
   ```
4. **Deploys the infrastructure:**
   - Creates/updates S3 bucket for static assets
   - Configures CloudFront distribution
   - Sets up custom domain with Cloudflare DNS
   - Invalidates CloudFront cache
5. **Reports status** back to GitHub (check marks on commits)

## Manual Deployment

You can also deploy manually from your local machine:

### First-time Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Creative-koda-lab/toddy.git
   cd toddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure AWS credentials:**
   ```bash
   # Using AWS CLI
   aws configure

   # Or export environment variables
   export AWS_ACCESS_KEY_ID=your-key
   export AWS_SECRET_ACCESS_KEY=your-secret
   ```

4. **Configure Cloudflare:**
   ```bash
   export CLOUDFLARE_API_TOKEN=your-token
   ```

### Deploy Commands

```bash
# Deploy to production
npm run deploy

# Deploy to dev stage
npm run deploy:dev

# Deploy to preview stage
npm run deploy:preview

# Deploy to custom stage
sst deploy --stage my-stage
```

### Remove a Stage

```bash
# Remove dev stage
sst remove --stage dev

# Remove specific stage
sst remove --stage my-stage
```

## GitHub Actions Alternative

If you prefer GitHub Actions over SST Console, you can use the following workflow.

### Setup AWS Credentials

1. Create an IAM user or use OIDC (recommended)
2. Add secrets to your repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `CLOUDFLARE_API_TOKEN`

### Create Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main
      - dev
  pull_request:
    types: [opened, synchronize, reopened, closed]

permissions:
  contents: read
  pull-requests: write

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Determine stage
        id: stage
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            echo "stage=pr-${{ github.event.number }}" >> $GITHUB_OUTPUT
            echo "action=${{ github.event.action }}" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "stage=production" >> $GITHUB_OUTPUT
            echo "action=deploy" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" = "refs/heads/dev" ]; then
            echo "stage=dev" >> $GITHUB_OUTPUT
            echo "action=deploy" >> $GITHUB_OUTPUT
          fi

      - name: Build landing page
        run: npm run build:landing

      - name: Deploy to AWS
        if: steps.stage.outputs.action == 'deploy'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: sst deploy --stage ${{ steps.stage.outputs.stage }}

      - name: Remove PR stage
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: sst remove --stage ${{ steps.stage.outputs.stage }}

      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const stage = '${{ steps.stage.outputs.stage }}';
            const url = `https://toddy-${stage}.creative-koda.com`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed to: ${url}`
            })
```

## Environment Management

### Environment Variables

The following environment variables are available during build and runtime:

- `PUBLIC_SITE_URL` - Automatically set based on stage
- `CLOUDFLARE_API_TOKEN` - Required for DNS configuration (set in Console or GitHub Secrets)

### Stage Configuration

Stages are defined in `sst.config.ts`:

```typescript
environment: {
  PUBLIC_SITE_URL:
    $app.stage === "production"
      ? "https://toddy.creative-koda.com"
      : `https://toddy-${$app.stage}.creative-koda.com`,
}
```

### Custom Domains

Domains are automatically configured per stage:

- **Production**: `toddy.creative-koda.com`
- **Other stages**: `toddy-{stage}.creative-koda.com`

## Troubleshooting

### Common Issues

#### 1. Cloudflare DNS not updating

**Problem:** Domain isn't pointing to CloudFront distribution

**Solution:**
- Verify `CLOUDFLARE_API_TOKEN` has DNS edit permissions
- Check the zone ID in Cloudflare dashboard
- Manually verify DNS records in Cloudflare

#### 2. CloudFront not serving updated content

**Problem:** Old content is cached

**Solution:**
- The config has cache invalidation enabled (`invalidation: { paths: "all" }`)
- Wait for invalidation to complete (check SST Console or AWS Console)
- Manual invalidation: Go to CloudFront → Distributions → Invalidations

#### 3. Build fails on SST Console

**Problem:** Workflow step fails

**Solution:**
- Check build logs in SST Console → Autodeploy tab
- Verify all environment variables are set
- Test locally with `npm run build:landing`

#### 4. Permission errors during deployment

**Problem:** AWS permissions insufficient

**Solution:**
- Ensure IAM role/user has permissions for:
  - CloudFormation (full access)
  - S3 (create/delete buckets, upload objects)
  - CloudFront (create/update distributions)
  - IAM (create roles for resources)
  - SSM (parameter store for state)

### Viewing Logs

**SST Console:**
1. Go to your app
2. Click **Autodeploy** tab
3. Select the deployment
4. View detailed logs

**Local deployment:**
```bash
sst deploy --stage dev --verbose
```

### Getting Help

- [SST Documentation](https://sst.dev/docs)
- [SST Discord Community](https://discord.gg/sst)
- [GitHub Issues](https://github.com/Creative-koda-lab/toddy/issues)

## Additional Resources

- [SST Autodeploy Documentation](https://sst.dev/docs/console/autodeploy)
- [Astro on AWS Guide](https://sst.dev/docs/component/aws/astro)
- [Cloudflare DNS Provider](https://sst.dev/docs/component/cloudflare/dns)
- [SST Pricing](https://sst.dev/pricing)

---

**Note:** Starting February 1, 2025, SST Console pricing is based on active resources (free up to 350 resources).
