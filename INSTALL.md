# Installation Guide

## macOS Installation

### Option 1: Quick Fix (Recommended for unsigned builds)

If you see the error **"Toddy.app" is damaged and can't be opened**, run this command in Terminal:

```bash
xattr -cr /Applications/Toddy.app
```

Or if the app is in your Downloads folder:

```bash
xattr -cr ~/Downloads/Toddy.app
```

Then try opening the app again.

### Option 2: Right-Click to Open

1. Download the `.dmg` file
2. Open the `.dmg` and drag Toddy to Applications
3. **Right-click** on Toddy.app and select **Open**
4. Click **Open** in the dialog that appears

### Why does this happen?

macOS Gatekeeper blocks apps from unidentified developers. Since this app is not yet code-signed with an Apple Developer certificate, you need to explicitly allow it to run.

**Note**: Code signing requires an Apple Developer account ($99/year). We're working on getting proper code signing for future releases.

---

## Windows Installation

1. Download the `.exe` or `.msi` installer
2. If Windows SmartScreen appears, click "More info" then "Run anyway"
3. Follow the installation wizard

---

## Linux Installation

### Debian/Ubuntu (.deb)

```bash
sudo dpkg -i toddy_*.deb
```

### AppImage

```bash
chmod +x Toddy_*.AppImage
./Toddy_*.AppImage
```

Or double-click the AppImage file if your file manager supports it.

---

## Security Note

All releases are built automatically via GitHub Actions. You can verify the build process by checking the [workflows](.github/workflows/release-desktop.yml) and the [GitHub Actions runs](https://github.com/Creative-koda-lab/toddy/actions).

For maximum security, you can also build the app locally:

```bash
npm install
npm run build:desktop
```
