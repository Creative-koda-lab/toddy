# SST Console Troubleshooting Guide

Quick fixes for common SST Console deployment errors.

## Quick Diagnosis

Run this command to check your environment:

```bash
# Check AWS environment variables
env | grep AWS

# Check if you're in the right directory
pwd

# Check SST version
npx sst version
```

---

## Error: "failed to get shared config profile, AdministratorAccess-XXXXX"

### The Problem
SST Console can't deploy because it's trying to use local AWS credentials instead of Console-managed credentials.

### Quick Fix (5 seconds)

```bash
# Unset AWS environment variables
unset AWS_PROFILE
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
```

### Permanent Fix

**For macOS/Linux (zsh):**
```bash
# Edit your shell config
nano ~/.zshrc

# Remove or comment out lines like:
# export AWS_PROFILE=AdministratorAccess-654654162389

# Save and reload
source ~/.zshrc
```

**For macOS/Linux (bash):**
```bash
nano ~/.bashrc
# (same as above)
source ~/.bashrc
```

### Why This Happens
- You configured AWS CLI with SSO (AWS IAM Identity Center)
- Your shell automatically sets `AWS_PROFILE` on startup
- SST Console uses its own AWS credentials (IAM roles in CodeBuild)
- Local `AWS_PROFILE` conflicts with Console's credentials

### Verify the Fix
```bash
# Should return empty
env | grep AWS_PROFILE

# Now push to GitHub - SST Console should deploy successfully
git push origin dev
```

---

## Error: "It looks like the Pulumi SDK has not been installed"

### The Problem
SST Console build fails with "Pulumi SDK has not been installed" or "Have you run pulumi install?"

### Root Cause
This happens when your custom workflow in `sst.config.ts` calls npm scripts that try to use SST before it's properly installed in the Console environment.

### Quick Fix

**Add a workflow that runs `sst install`** - This is required for provider initialization:

Your `sst.config.ts` needs:
```typescript
console: {
  autodeploy: {
    target(event) {
      if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
        return { stage: "production" };
      }
      if (event.type === "branch" && event.branch === "dev" && event.action === "pushed") {
        return { stage: "dev" };
      }
      if (event.type === "pull_request") {
        return { stage: `pr-${event.number}` };
      }
    },

    // Required workflow to install SST providers
    async workflow({ $ }) {
      await $`npm install`;      // Install npm dependencies
      await $`npx sst install`;  // Install SST provider dependencies (Pulumi)
      // SST Console will automatically run 'sst deploy' after this
    }
  }
}
```

### Why `sst install` is Required

SST Console's default workflow only runs:
```bash
npm install     # ✅ Installs npm packages
sst deploy      # ❌ Fails because providers aren't installed
```

You need to add `sst install` to install provider packages:
```bash
npm install     # Install npm packages
sst install     # Install SST/Pulumi provider packages
sst deploy      # Now works!
```

### When to Use Custom Workflow

You MUST add a workflow if:
- ✅ Using any providers (AWS, Cloudflare, etc.) - ALWAYS needed
- Using custom provider versions
- Running tests before deployment
- Custom build steps

**Example with tests:**
```typescript
async workflow({ $ }) {
  await $`npm install`;
  await $`npx sst install`;  // Required for providers
  await $`npm test`;         // Optional: run tests first
}
```

### Why This Happens
- **Custom workflow issue:** Called `npm run deploy` which calls `sst deploy` before dependencies were ready
- **Provider version pinning:** When you specify a provider version (like `cloudflare: "6.10.0"`), you must run `sst install` first
- **SST Console limitation:** Console doesn't automatically run `sst install` before deploying
- **Solution:** Use default provider versions or add a workflow that runs `sst install`

### Alternative Fix: Use Default Provider Version

Instead of specifying a version:
```typescript
providers: {
  cloudflare: "6.10.0",  // ❌ Requires 'sst install'
}
```

Use the default:
```typescript
providers: {
  cloudflare: true,  // ✅ No 'sst install' needed
}
```

This lets SST use its built-in Cloudflare provider version.

### After the Fix

1. **Commit the change:**
   ```bash
   git add sst.config.ts
   git commit -m "fix: remove custom workflow, use SST Console default"
   git push origin dev
   ```

2. **Watch it deploy:**
   - Go to SST Console → Autodeploy tab
   - Should see successful deployment now

---

## Error: "Credentials could not be loaded"

### The Problem
GitHub Actions workflow is trying to run but can't find AWS credentials.

### Quick Fix
The GitHub Actions workflow should be disabled if you're using SST Console.

**Check if workflow is disabled:**
```bash
ls .github/workflows/*.yml.disabled
# Should see: deploy.yml.disabled
```

**If not disabled:**
```bash
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
git add .github/workflows/
git commit -m "fix: disable GitHub Actions workflow (using SST Console)"
git push
```

### Why This Happens
- GitHub Actions and SST Console both try to deploy
- GitHub Actions needs AWS credentials in GitHub Secrets
- SST Console handles everything automatically
- You should use one or the other, not both

---

## Error: "The config profile could not be found"

### The Problem
SST is looking for a specific AWS CLI profile that doesn't exist.

### Quick Fix

**Check your AWS profiles:**
```bash
# List all configured profiles
aws configure list-profiles

# If you see your profile:
AWS_PROFILE=your-profile-name sst deploy --stage dev

# If using SSO:
aws sso login --profile your-profile-name
AWS_PROFILE=your-profile-name sst deploy --stage dev
```

### For SST Console Users
You don't need local AWS profiles! Unset `AWS_PROFILE`:
```bash
unset AWS_PROFILE
```

SST Console manages AWS credentials automatically.

---

## Error: "Resource handler returned message: Specified ReservedConcurrentExecutions..."

### The Problem
New AWS accounts have lower Lambda concurrency limits.

### Quick Fix

**Request quota increase:**
1. Go to [AWS Service Quotas Console](https://console.aws.amazon.com/servicequotas/)
2. Select **AWS Lambda**
3. Search for **Concurrent executions**
4. Click **Request quota increase**
5. Request increase to **1000**
6. Submit request

**Speed up approval:**
1. After submitting, click **Quota request history**
2. Open the AWS Support Case
3. Click **Reply** and select **Chat**
4. Talk to AWS support (usually approved in minutes)

### Why This Happens
- New AWS accounts start with lower Lambda limits
- SST Console creates Lambda functions for deployments
- Default limit may be too low

---

## Error: "CLOUDFLARE_API_TOKEN is not set"

### The Problem
Missing Cloudflare API token for DNS management.

### Quick Fix

**Get Cloudflare API Token:**
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Profile** (top right) → **API Tokens**
3. Click **Create Token**
4. Use **Edit zone DNS** template
5. Select zone: `creative-koda.com`
6. Create and copy the token

**Add to SST Console:**
1. Go to [SST Console](https://console.sst.dev)
2. Navigate to your app
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `CLOUDFLARE_API_TOKEN`
   - **Value:** (paste your token)
5. Save

**For local deployment:**
```bash
export CLOUDFLARE_API_TOKEN=your-token-here
sst deploy --stage dev
```

---

## Error: "Build failed" in SST Console

### The Problem
Your build is failing during the workflow steps.

### Quick Fix

**1. Check the logs:**
- Go to SST Console → Autodeploy tab
- Click on the failed deployment
- Expand the log sections to find the error

**2. Common causes:**

**Missing dependency:**
```bash
# Solution: Ensure package.json has all dependencies
npm install
npm run build:landing
```

**Environment variable missing:**
- Check SST Console → Settings → Environment Variables
- Ensure `CLOUDFLARE_API_TOKEN` is set

**Build command fails:**
```bash
# Test locally
npm run build:landing

# If it fails locally, fix the issue first
```

**Out of memory:**
- Increase build memory in SST Console settings
- Or optimize your build process

---

## Error: "Domain not working after deployment"

### The Problem
Deployment succeeded but the domain isn't accessible.

### Quick Fix

**1. Wait for DNS propagation:**
```bash
# Check DNS records (usually 5-10 minutes)
nslookup toddy.creative-koda.com

# Or use:
dig toddy.creative-koda.com
```

**2. Check Cloudflare DNS:**
1. Log into Cloudflare
2. Select `creative-koda.com` zone
3. Go to **DNS** → **Records**
4. Verify CNAME record exists pointing to CloudFront

**3. Check CloudFront distribution:**
1. Go to [AWS Console](https://console.aws.amazon.com/cloudfront/)
2. Find your distribution
3. Check status is **Deployed** (not "In Progress")
4. Copy the distribution domain name

**4. Test CloudFront directly:**
```bash
# Use the CloudFront domain (not custom domain)
curl https://d111111abcdef8.cloudfront.net
```

### Why This Happens
- DNS changes take time to propagate (up to 48 hours, usually 5-10 minutes)
- CloudFront distributions take time to deploy (5-15 minutes)
- Cloudflare proxy might be caching old records

---

## Error: "GitHub repository not connected"

### The Problem
SST Console can't access your GitHub repository.

### Quick Fix

**1. Reconnect GitHub:**
1. Go to SST Console → **Workspace Settings** → **Integrations**
2. Click **Disconnect GitHub** (if connected)
3. Click **Enable GitHub**
4. Authorize the SST app
5. Select `Creative-koda-lab` organization

**2. Select repository:**
1. Go to **App Settings** → **Autodeploy**
2. Click **Select Repository**
3. Choose `Creative-koda-lab/toddy`
4. Save

**3. Check permissions:**
- Ensure SST Console has access to your GitHub organization
- You might need organization admin to approve the app

---

## Still Having Issues?

### Debug Checklist

Run through this checklist:

- [ ] AWS account connected in SST Console?
- [ ] GitHub repository selected in Autodeploy settings?
- [ ] `CLOUDFLARE_API_TOKEN` set in environment variables?
- [ ] No `AWS_PROFILE` environment variable set locally?
- [ ] GitHub Actions workflow is disabled (`.yml.disabled`)?
- [ ] Pushing to the correct branch (`main`, `dev`, or PR)?
- [ ] Check SST Console logs for specific error messages?

### Get Help

1. **Check SST Console logs** - Most specific error details
2. **SST Documentation** - https://sst.dev/docs
3. **SST Discord** - https://discord.gg/sst (very active community)
4. **GitHub Issues** - https://github.com/Creative-koda-lab/toddy/issues
5. **AWS Support** - For AWS-specific quota or permission issues

### Local Testing

Test your build locally before debugging Console issues:

```bash
# Install dependencies
npm install

# Build the landing page
npm run build:landing

# If using SST locally (requires AWS credentials)
export CLOUDFLARE_API_TOKEN=your-token
AWS_PROFILE=your-profile sst deploy --stage dev
```

If it works locally but fails in Console, the issue is likely:
- Environment variables not set in Console
- AWS account permissions
- GitHub integration

---

## Prevention Tips

**1. Don't mix local and Console deployments:**
- Use SST Console for automatic deployments
- Only deploy locally for testing

**2. Keep environment variables in Console:**
- Don't rely on local `.env` files for production
- Set all required variables in SST Console settings

**3. Test changes on `dev` branch first:**
```bash
git checkout dev
# Make changes
git push origin dev
# Watch deployment in SST Console
# If successful, merge to main
```

**4. Monitor deployments:**
- Check SST Console after each push
- Don't assume "no error in GitHub" = "deployed successfully"

**5. Document your setup:**
- Keep track of environment variables needed
- Document any custom configuration

---

## Related Documentation

- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **SST Console Setup:** [SST-SETUP-QUICKSTART.md](./SST-SETUP-QUICKSTART.md)
- **Using SST Console:** [../.github/workflows/USING-SST-CONSOLE.md](../.github/workflows/USING-SST-CONSOLE.md)

---

**Last Updated:** October 2025
