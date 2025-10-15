# Using SST Console for Deployments

This project is configured to use **SST Console** for automatic deployments, not GitHub Actions.

## Why is `deploy.yml.disabled`?

The GitHub Actions workflow (`deploy.yml.disabled`) has been disabled because:

1. ✅ **You're using SST Console** - which handles deployments automatically
2. ❌ **No AWS credentials in GitHub** - GitHub Actions would fail without them
3. 🚫 **Avoid conflicts** - Running both would cause duplicate deployments

## How Deployments Work with SST Console

When you push to GitHub, **SST Console automatically**:

1. Detects the push event
2. Determines the stage based on your `sst.config.ts`:
   - `main` branch → production
   - `dev` branch → dev
   - Pull requests → `pr-{number}`
3. Runs the workflow defined in `sst.config.ts`
4. Deploys to AWS
5. Reports status back to GitHub

**No GitHub Actions needed!** Everything is handled by SST Console.

## Verifying Your Setup

### Check SST Console Connection

1. Go to [console.sst.dev](https://console.sst.dev)
2. Navigate to your app
3. Go to **Settings** → **Autodeploy**
4. Verify:
   - ✅ GitHub repository is connected
   - ✅ AWS account is linked
   - ✅ `CLOUDFLARE_API_TOKEN` is set in environment variables

### Check Deployment Status

After pushing to GitHub:

1. Go to **Autodeploy** tab in SST Console
2. You'll see the deployment running with live logs
3. Wait for completion
4. Visit your deployed URL

### Deployment URLs

- **Production**: https://toddy.creative-koda.com (from `main` branch)
- **Dev**: https://toddy-dev.creative-koda.com (from `dev` branch)
- **PR Previews**: https://toddy-pr-{number}.creative-koda.com (from PRs)

## If You Want to Use GitHub Actions Instead

If you prefer GitHub Actions over SST Console:

1. **Rename the workflow back:**
   ```bash
   mv .github/workflows/deploy.yml.disabled .github/workflows/deploy.yml
   ```

2. **Set up AWS credentials** (choose one):

   **Option A: OIDC (Recommended)**
   - Create IAM OIDC provider
   - Create IAM role for GitHub
   - Add `AWS_ROLE_ARN` secret to GitHub

   **Option B: Access Keys**
   - Create IAM user
   - Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets to GitHub

3. **Add Cloudflare token:**
   - Add `CLOUDFLARE_API_TOKEN` secret to GitHub

4. **Disable SST Console autodeploy:**
   - Remove `console.autodeploy` section from `sst.config.ts`

**See [.github/workflows/README.md](.github/workflows/README.md) for detailed setup.**

## Troubleshooting

### "Credentials could not be loaded" Error

This error means GitHub Actions is trying to run but can't find AWS credentials. Since you're using SST Console, this is normal and expected.

**Solution:** The workflow is now disabled (`.yml.disabled` extension), so this error won't appear anymore.

### Deployments Not Triggering

If SST Console isn't deploying when you push:

1. **Check GitHub integration:**
   - SST Console → Workspace Settings → Integrations
   - Verify GitHub is connected

2. **Check repository selection:**
   - SST Console → App Settings → Autodeploy
   - Verify `Creative-koda-lab/toddy` is selected

3. **Check the autodeploy target:**
   - Your `sst.config.ts` has the autodeploy configuration
   - It should trigger on `main`, `dev` branches, and PRs

4. **Check SST Console logs:**
   - Autodeploy tab will show any errors
   - Common issue: Missing `CLOUDFLARE_API_TOKEN`

### Manual Deployment

You can always deploy manually from your local machine:

```bash
# Make sure you have AWS credentials configured locally
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export CLOUDFLARE_API_TOKEN=your-token

# Deploy
npm run deploy          # production
npm run deploy:dev      # dev stage
npm run deploy:preview  # preview stage
```

## Current Configuration

Your `sst.config.ts` is configured with:

```typescript
console: {
  autodeploy: {
    target(event) {
      // Production: main branch
      if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
        return { stage: "production" };
      }

      // Dev: dev branch
      if (event.type === "branch" && event.branch === "dev" && event.action === "pushed") {
        return { stage: "dev" };
      }

      // PR previews
      if (event.type === "pull_request") {
        return { stage: `pr-${event.number}` };
      }
    },

    // Custom build workflow
    async workflow({ $, event }) {
      await $`npm install`;
      await $`npm run build:landing`;

      if (event.action === "removed") {
        await $`npm run sst remove`;
      } else {
        await $`npm run deploy`;
      }
    }
  }
}
```

This means:
- ✅ Automatic deployments on push to `main` or `dev`
- ✅ Automatic PR preview environments
- ✅ Custom build workflow (install, build, deploy)
- ✅ Automatic cleanup when PRs are closed

## Documentation

- **Quick Start**: [docs/SST-SETUP-QUICKSTART.md](../../docs/SST-SETUP-QUICKSTART.md)
- **Full Guide**: [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md)
- **SST Docs**: https://sst.dev/docs/console
- **SST Autodeploy**: https://sst.dev/docs/console/autodeploy

## Summary

- ✅ **SST Console is handling all deployments**
- ✅ **GitHub Actions workflow is disabled** (no credentials needed)
- ✅ **Push to GitHub to trigger automatic deployments**
- ✅ **Monitor deployments in SST Console**

**Need help?** Check the [SST Console documentation](https://sst.dev/docs/console) or open an issue.
