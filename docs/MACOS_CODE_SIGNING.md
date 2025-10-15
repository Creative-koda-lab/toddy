# macOS Code Signing Setup for GitHub Releases

This guide will help you set up Apple code signing and notarization for your Toddy app releases on GitHub Actions.

## Prerequisites

You need an **Apple Developer Account** ($99/year) to code sign and notarize macOS apps.

## Steps to Set Up Code Signing

### 1. Get Your Apple Developer Credentials

You'll need the following information:

- **Apple ID**: Your Apple Developer account email
- **Apple Team ID**: Found in [Apple Developer Membership](https://developer.apple.com/account/#/membership)
- **App-Specific Password**: For notarization

### 2. Create an App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Go to **Security** → **App-Specific Passwords**
4. Click **Generate an app-specific password**
5. Name it "Toddy GitHub Actions" or similar
6. **Save this password** - you'll need it later as `APPLE_PASSWORD`

### 3. Create a Code Signing Certificate

#### Option A: Using Xcode (Easiest)

1. Open **Xcode**
2. Go to **Xcode** → **Preferences** → **Accounts**
3. Add your Apple ID if not already added
4. Select your team
5. Click **Manage Certificates**
6. Click the **+** button
7. Select **Developer ID Application**
8. This creates and installs the certificate

#### Option B: Using Apple Developer Portal

1. Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** to create a new certificate
3. Select **Developer ID Application**
4. Follow the prompts to create a Certificate Signing Request (CSR)
5. Download the certificate and install it in Keychain Access

### 4. Export the Certificate

1. Open **Keychain Access** app
2. Select **My Certificates** or **login** keychain
3. Find your **Developer ID Application** certificate
4. Right-click and select **Export "Developer ID Application..."**
5. Save as a `.p12` file
6. **Set a strong password** - you'll need this as `APPLE_CERTIFICATE_PASSWORD`

### 5. Convert Certificate to Base64

Run this command in Terminal (replace the path with your certificate path):

```bash
base64 -i /path/to/certificate.p12 | pbcopy
```

This copies the base64-encoded certificate to your clipboard. You'll use this as `APPLE_CERTIFICATE`.

### 6. Get Your Signing Identity

Run this command to find your signing identity:

```bash
security find-identity -v -p codesigning
```

Look for a line like:
```
1) XXXXXXXXXXXXXX "Developer ID Application: Your Name (TEAM_ID)"
```

The part in quotes is your `APPLE_SIGNING_IDENTITY`. Example: `"Developer ID Application: John Doe (ABC123XYZ)"`

### 7. Add Secrets to GitHub

Go to your GitHub repository:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `APPLE_CERTIFICATE` | Base64 certificate | The base64-encoded `.p12` file from step 5 |
| `APPLE_CERTIFICATE_PASSWORD` | Your password | The password you set when exporting the certificate |
| `APPLE_SIGNING_IDENTITY` | Identity string | From step 6, e.g., `"Developer ID Application: John Doe (ABC123XYZ)"` |
| `APPLE_ID` | Your email | Your Apple Developer account email |
| `APPLE_PASSWORD` | App-specific password | From step 2 |
| `APPLE_TEAM_ID` | Your Team ID | 10-character Team ID from Apple Developer |

## Testing the Release

### Create a Test Release

```bash
# Update version in package.json if needed
cd apps/desktop
npm version patch  # or minor, or major

# Commit the version bump
git add package.json
git commit -m "chore: bump version to $(node -p "require('./package.json').version")"

# Create and push a tag
git tag v$(node -p "require('./package.json').version")
git push origin main
git push origin --tags
```

### Monitor the Workflow

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Watch the **Release Desktop App** workflow
4. Check for any errors in the macOS build jobs

### Verify the Release

Once the workflow completes:

1. Go to **Releases** in your GitHub repository
2. Download the `.dmg` file for macOS
3. Test installing it on a Mac
4. The app should open without the "damaged" error

## Troubleshooting

### Certificate not found

**Error**: `No signing identity found`

**Solution**: Make sure you exported the **private key** with the certificate. In Keychain Access, expand the certificate to see the private key underneath, and export the certificate (which includes the private key).

### Invalid certificate password

**Error**: `Could not decrypt certificate`

**Solution**: Double-check the `APPLE_CERTIFICATE_PASSWORD` secret matches the password you set when exporting the `.p12` file.

### Notarization fails

**Error**: `Notarization failed`

**Solution**:
- Ensure your `APPLE_ID` and `APPLE_PASSWORD` (app-specific password) are correct
- Check that your Apple Developer account is in good standing
- Make sure you're using an **app-specific password**, not your regular Apple ID password

### Wrong team ID

**Error**: `Team ID mismatch`

**Solution**: Verify your `APPLE_TEAM_ID` matches the Team ID in your signing identity and in the tauri.conf.json identifier.

## Alternative: Skip Code Signing (Not Recommended)

If you don't want to set up code signing, you can temporarily work around this by:

1. **For testers**: Provide instructions to right-click the app and select "Open" instead of double-clicking
2. **Or** instruct users to run: `xattr -cr /path/to/toddy.app` before opening

However, this is **not recommended** for public releases as it creates a poor user experience.

## Additional Resources

- [Apple Developer Documentation - Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Tauri Code Signing Guide](https://tauri.app/v1/guides/distribution/sign-macos)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Cost

- **Apple Developer Program**: $99/year (required for code signing and notarization)
- **GitHub Actions**: Free for public repositories (macOS runners included)

---

**Note**: Code signing and notarization are **required** for a professional macOS app distribution. Without it, macOS Gatekeeper will block your app with the "damaged" error message.
