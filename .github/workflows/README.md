# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated deployments.

## Available Workflows

### `deploy.yml` - Landing Page Deployment

Automatically deploys the Astro landing page to AWS when changes are pushed.

**Triggers:**
- Push to `main` branch → Deploys to production
- Push to `dev` branch → Deploys to dev environment
- Pull requests → Creates preview deployments
- PR closed → Removes preview environment

## Setup Instructions

To use GitHub Actions instead of SST Console, you need to configure AWS credentials and Cloudflare tokens.

### Option 1: OIDC Authentication (Recommended)

OIDC (OpenID Connect) is more secure than access keys and doesn't require credential rotation.

#### Step 1: Create IAM OIDC Provider

1. Go to AWS Console → IAM → Identity Providers
2. Click **Add provider**
3. Configure:
   - **Provider type:** OpenID Connect
   - **Provider URL:** `https://token.actions.githubusercontent.com`
   - **Audience:** `sts.amazonaws.com`
4. Click **Add provider**

#### Step 2: Create IAM Role

1. Go to IAM → Roles → Create role
2. Select **Web identity**
3. Configure:
   - **Identity provider:** `token.actions.githubusercontent.com`
   - **Audience:** `sts.amazonaws.com`
   - **GitHub organization:** `Creative-koda-lab`
   - **GitHub repository:** `toddy`
4. Click **Next**
5. Attach policies:
   - `PowerUserAccess` (or create a custom policy with minimal permissions)
   - Ensure it includes: CloudFormation, S3, CloudFront, IAM, SSM
6. Name the role: `GitHubActionsDeployRole`
7. Click **Create role**

#### Step 3: Update Trust Policy

Edit the role's trust policy to restrict to specific branches:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": [
            "repo:Creative-koda-lab/toddy:ref:refs/heads/main",
            "repo:Creative-koda-lab/toddy:ref:refs/heads/dev",
            "repo:Creative-koda-lab/toddy:pull_request"
          ]
        }
      }
    }
  ]
}
```

#### Step 4: Add GitHub Secret

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Add:
   - **Name:** `AWS_ROLE_ARN`
   - **Value:** `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsDeployRole`

### Option 2: Access Keys (Alternative)

If you can't use OIDC, you can use IAM user access keys.

#### Step 1: Create IAM User

1. Go to AWS Console → IAM → Users
2. Click **Add users**
3. Username: `github-actions-toddy`
4. Select **Access key - Programmatic access**
5. Attach same policies as OIDC option
6. Save the access key ID and secret access key

#### Step 2: Add GitHub Secrets

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add two secrets:
   - **Name:** `AWS_ACCESS_KEY_ID`, **Value:** Your access key ID
   - **Name:** `AWS_SECRET_ACCESS_KEY`, **Value:** Your secret access key

#### Step 3: Update Workflow

In `.github/workflows/deploy.yml`, uncomment the access key lines and comment out the OIDC line:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    # Option 1: Use OIDC (recommended)
    # role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

    # Option 2: Use access keys
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
```

### Cloudflare Token (Required for Both Options)

1. Log into Cloudflare Dashboard
2. Go to **Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit zone DNS** template
5. Configure:
   - **Zone Resources:** Include → Specific zone → `creative-koda.com`
   - **Permissions:** Zone → DNS → Edit
6. Click **Continue to summary** → **Create Token**
7. Copy the token

**Add to GitHub:**
1. Go to repository → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Add:
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Value:** Your Cloudflare token

## Testing the Workflow

### Test on Dev Branch

1. Create a test change:
   ```bash
   git checkout dev
   echo "# Test" >> apps/landing/README.md
   git add .
   git commit -m "test: workflow"
   git push origin dev
   ```

2. Check Actions tab in GitHub
3. Monitor the deployment
4. Visit `https://toddy-dev.creative-koda.com`

### Test PR Preview

1. Create a new branch:
   ```bash
   git checkout -b test-preview
   echo "# Preview test" >> apps/landing/README.md
   git add .
   git commit -m "test: pr preview"
   git push origin test-preview
   ```

2. Open a PR on GitHub
3. Check Actions tab for deployment
4. Look for the bot comment with preview URL

## Workflow Customization

### Change Deployment Triggers

Edit `on:` section in `deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - dev
      - feature/*  # Add more branches
```

### Add Build Checks

Add steps before deployment:

```yaml
- name: Run tests
  run: npm test

- name: Run linting
  run: npm run lint

- name: Type check
  run: npm run type-check
```

### Customize PR Comments

Edit the `script:` section in the "Comment on PR" step.

## Comparing to SST Console

| Feature | SST Console | GitHub Actions |
|---------|-------------|----------------|
| Setup Complexity | Low (GUI-based) | Medium (YAML config) |
| AWS Credentials | Managed by Console | Manual setup required |
| Cost | Based on resources (free tier) | Free (included with GitHub) |
| Flexibility | Limited to SST workflow | Full CI/CD control |
| Build Environment | Your AWS account | GitHub runners |
| PR Previews | Built-in | Manual configuration |
| Logs | Console UI | GitHub Actions UI |

## Troubleshooting

### "Error: Could not assume role"

**Cause:** OIDC configuration issue

**Fix:**
1. Verify IAM provider URL is exactly: `https://token.actions.githubusercontent.com`
2. Check audience is: `sts.amazonaws.com`
3. Review trust policy conditions
4. Ensure `AWS_ROLE_ARN` secret is correct

### "Error: The security token included in the request is invalid"

**Cause:** Invalid or expired access keys

**Fix:**
1. Regenerate access keys in IAM
2. Update GitHub secrets with new values
3. Ensure IAM user has necessary permissions

### "Error: Missing CLOUDFLARE_API_TOKEN"

**Cause:** Cloudflare token not configured

**Fix:**
1. Create API token in Cloudflare (see setup above)
2. Add to GitHub secrets as `CLOUDFLARE_API_TOKEN`
3. Verify token has DNS edit permissions

### Deployment succeeds but domain doesn't work

**Cause:** DNS not updating or CloudFront not configured

**Fix:**
1. Check Cloudflare DNS records manually
2. Verify CloudFront distribution exists
3. Wait for DNS propagation (up to 24 hours, usually 5-10 minutes)
4. Check CloudFront distribution status in AWS Console

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS OIDC Configuration](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [SST Deployment Guide](https://sst.dev/docs)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
