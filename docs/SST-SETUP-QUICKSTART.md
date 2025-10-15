# SST Auto-Deploy Quick Start Guide

This is a condensed guide to get your SST auto-deployment set up with GitHub in 5 minutes.

## Prerequisites

- AWS account with admin access
- Cloudflare account with DNS access to `creative-koda.com`
- GitHub repository at `Creative-koda-lab/toddy`

## Option 1: SST Console (5 Minutes Setup)

### Step 1: Sign Up (1 min)
1. Go to [console.sst.dev](https://console.sst.dev)
2. Sign in with GitHub
3. Create a workspace

### Step 2: Connect AWS (2 min)
1. **Workspace Settings** → **AWS Accounts** → **Add Account**
2. Follow wizard to deploy CloudFormation stack
3. Wait for stack creation (~1 minute)

### Step 3: Connect GitHub (1 min)
1. **Workspace Settings** → **Integrations** → **Enable GitHub**
2. Authorize SST app
3. Select `Creative-koda-lab/toddy` repository

### Step 4: Configure Autodeploy (1 min)
1. **App Settings** → **Autodeploy** → **Select Repository**
2. Choose `Creative-koda-lab/toddy`
3. Add environment variable:
   - Key: `CLOUDFLARE_API_TOKEN`
   - Value: [Get from Cloudflare Profile → API Tokens]

### Step 5: Deploy!
```bash
git push origin dev  # Test deployment to dev stage
```

**That's it!** Your deployments are now automatic:
- Push to `main` → production (`toddy.creative-koda.com`)
- Push to `dev` → dev environment (`toddy-dev.creative-koda.com`)
- Open PR → preview deployment (`toddy-pr-{number}.creative-koda.com`)

## Option 2: GitHub Actions (15 Minutes Setup)

If you prefer GitHub Actions over SST Console:

### Step 1: Create IAM OIDC Provider
```bash
# In AWS Console → IAM → Identity Providers
Provider URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com
```

### Step 2: Create IAM Role
```bash
# In AWS Console → IAM → Roles
Name: GitHubActionsDeployRole
Trust: GitHub OIDC provider
Policies: PowerUserAccess (or custom policy)
```

### Step 3: Add GitHub Secrets
```bash
# In GitHub → Settings → Secrets and variables → Actions
AWS_ROLE_ARN: arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsDeployRole
CLOUDFLARE_API_TOKEN: your-cloudflare-token
```

### Step 4: Enable Workflow
The workflow is already in `.github/workflows/deploy.yml` - just push!

```bash
git push origin dev  # Triggers deployment
```

## Getting Your Cloudflare API Token

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Profile** (top right) → **API Tokens**
3. Click **Create Token**
4. Use **Edit zone DNS** template
5. Configure:
   - **Zone Resources**: Include → Specific zone → `creative-koda.com`
   - **Permissions**: Zone → DNS → Edit
6. Click **Continue to summary** → **Create Token**
7. Copy the token (you won't see it again!)

## Verify Deployment

After pushing:

### SST Console
1. Go to your app in Console
2. Click **Autodeploy** tab
3. Watch build logs in real-time

### GitHub Actions
1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Expand steps to see logs

### Check Your Site
- Production: https://toddy.creative-koda.com
- Dev: https://toddy-dev.creative-koda.com
- PR previews: https://toddy-pr-{number}.creative-koda.com

## What Happens on Deploy?

The `sst.config.ts` autodeploy workflow:

```typescript
async workflow({ $, event }) {
  await $`npm install`;           // Install dependencies
  await $`npm run build:landing`; // Build Astro site
  await $`npm run deploy`;        // Deploy to AWS
}
```

This creates/updates:
- ✅ S3 bucket for static files
- ✅ CloudFront CDN distribution
- ✅ Custom domain with SSL certificate
- ✅ Cloudflare DNS records
- ✅ CloudFront cache invalidation

## Troubleshooting

### "failed to get shared config profile, AdministratorAccess-XXXXX"

**Quick Fix:**
```bash
# Unset AWS environment variables
unset AWS_PROFILE
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
```

SST Console manages AWS credentials automatically - you don't need local profiles!

**See [SST-TROUBLESHOOTING.md](./SST-TROUBLESHOOTING.md) for detailed solutions.**

### "Cloudflare API token is invalid"
- Verify token has DNS edit permissions
- Check it's for the correct zone (`creative-koda.com`)
- Token may have expired - create a new one

### "Could not assume role" (GitHub Actions)
- Verify `AWS_ROLE_ARN` secret is correct
- Check IAM role trust policy includes GitHub OIDC
- Ensure role has necessary permissions

### "Build failed"
- Check build logs in SST Console or GitHub Actions
- Verify all environment variables are set
- Test locally: `npm run build:landing`

### Domain not working after deployment
- Wait 5-10 minutes for DNS propagation
- Check Cloudflare DNS records manually
- Verify CloudFront distribution is deployed in AWS Console

### More Help

**Comprehensive troubleshooting:** [SST-TROUBLESHOOTING.md](./SST-TROUBLESHOOTING.md)

This guide covers:
- All common SST Console errors
- Step-by-step fixes
- AWS credential issues
- DNS and domain problems
- Build failures

## Cost Estimate

**SST Console:**
- Free tier: Up to 350 active resources
- After Feb 1, 2025: Based on resource count
- [Pricing details](https://sst.dev/pricing)

**AWS Resources:**
- CloudFront: ~$0.085/GB transfer (free tier: 1TB/month for 12 months)
- S3: ~$0.023/GB storage (free tier: 5GB for 12 months)
- Route 53: Not used (using Cloudflare DNS)
- Estimated: $0-5/month for typical landing page traffic

**GitHub Actions:**
- Free for public repos (2,000 minutes/month for private repos)

## Next Steps

1. ✅ Set up auto-deployment (you're here!)
2. 📝 Customize `sst.config.ts` for your needs
3. 🎨 Update landing page content
4. 🔄 Push changes and watch them deploy automatically!

## Full Documentation

- **Complete guide**: [docs/DEPLOYMENT.md](./DEPLOYMENT.md)
- **GitHub Actions setup**: [.github/workflows/README.md](../.github/workflows/README.md)
- **SST docs**: https://sst.dev/docs
- **Cloudflare DNS provider**: https://sst.dev/docs/component/cloudflare/dns

---

**Questions?** Open an issue at https://github.com/Creative-koda-lab/toddy/issues
