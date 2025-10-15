# Installing Toddy on macOS (Unsigned Build)

Since Toddy is currently distributed as an unsigned application, macOS Gatekeeper will block it by default with a "damaged" error message. This is normal for unsigned apps and doesn't mean the app is actually damaged or contains malware.

## Why This Happens

Apple requires all apps to be code-signed and notarized (which requires a $99/year developer account). Since Toddy is open-source and free, we currently don't have code signing enabled. Your Mac is just being cautious about apps from unverified developers.

## How to Install (3 Methods)

### Method 1: Right-Click to Open (Easiest)

1. Download the `.dmg` file from the [latest release](https://github.com/Creative-koda-lab/toddy/releases/latest)
2. Open the `.dmg` file and drag Toddy to your Applications folder
3. **Don't double-click the app** - instead, **right-click** (or Control+click) on Toddy
4. Select **"Open"** from the menu
5. Click **"Open"** in the dialog that appears
6. The app will now launch, and macOS will remember your choice

After the first time, you can open Toddy normally by double-clicking.

### Method 2: Using System Settings

1. Download and try to open Toddy (you'll get the "damaged" error)
2. Go to **System Settings** → **Privacy & Security**
3. Scroll down to the **Security** section
4. You should see a message about Toddy being blocked
5. Click **"Open Anyway"**
6. Confirm by clicking **"Open"** in the dialog

### Method 3: Using Terminal (Advanced)

If the above methods don't work, you can remove the quarantine flag using Terminal:

1. Download the `.dmg` and install Toddy to Applications
2. Open **Terminal** (Applications → Utilities → Terminal)
3. Run this command:

```bash
xattr -cr /Applications/toddy.app
```

4. Press Enter
5. Now you can open Toddy normally

## Verifying the App is Safe

Toddy is completely open-source and built automatically by GitHub Actions. You can:

1. **Review the source code**: [github.com/Creative-koda-lab/toddy](https://github.com/Creative-koda-lab/toddy)
2. **Check the build process**: View the [GitHub Actions workflow](https://github.com/Creative-koda-lab/toddy/actions)
3. **Build it yourself**: Follow the instructions in the README to build from source

All releases are built transparently on GitHub's servers, so you can trust that the binaries match the source code.

## Why Not Just Sign It?

Code signing requires:
- An Apple Developer account ($99/year)
- Managing certificates and credentials
- Ongoing maintenance

For a free, open-source project, this cost may not be sustainable. However, if the project gets enough support, we may enable code signing in the future.

## Alternative: Build From Source

If you prefer, you can build Toddy yourself on your Mac:

```bash
# Clone the repository
git clone https://github.com/Creative-koda-lab/toddy.git
cd toddy

# Install dependencies
npm install

# Build the desktop app
npm run build:desktop
```

The app you build locally won't have this issue since macOS trusts apps you build yourself.

## Still Having Issues?

If none of these methods work:

1. Check your macOS version (Toddy requires macOS 10.13 or later)
2. Make sure you have full administrator privileges
3. Try restarting your Mac
4. [Open an issue](https://github.com/Creative-koda-lab/toddy/issues) on GitHub with details about the error

## For Other Platforms

- **Windows**: No code signing required for basic installation
- **Linux**: No code signing required (`.deb` and `.AppImage` available)

---

**Note**: This is a temporary limitation. If you'd like to support code signing for easier installation, consider [sponsoring the project](https://github.com/Creative-koda-lab/toddy) or contributing to help cover Apple Developer costs.
