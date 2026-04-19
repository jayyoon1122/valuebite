# ValueBite — Android TWA

This directory holds the Bubblewrap-generated Trusted Web Activity (TWA) wrapper for the ValueBite PWA at https://truevaluebite.com.

---

## ⚠ Critical Files (NOT in git)

These files are excluded from git for security/size reasons but are essential.
**Back them up to a secure location (1Password / encrypted USB / etc.):**

| File | Purpose | If lost |
|---|---|---|
| `android.keystore` | Signing key for Play Store | **Cannot publish updates ever again** — Google has no recovery |
| `app-release-bundle.aab` | Latest signed bundle | Re-buildable via `bubblewrap build` |
| `app-release-signed.apk` | Latest signed APK | Re-buildable via `bubblewrap build` |

### Keystore credentials (BACK THESE UP NOW)

```
Path:       /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/android-twa/android.keystore
Alias:      valuebite
Store pwd:  valuebite2026
Key pwd:    valuebite2026
SHA-256:    F8:17:65:71:45:64:C9:93:93:42:F1:AA:F6:74:CA:19:4B:F2:FC:CC:21:76:FE:00:91:01:51:E0:72:71:FD:CD
Validity:   100 years (until ~2126)
DName:      CN=ValueBite, OU=Mobile, O=ValueBite, L=Seoul, ST=Seoul, C=KR
```

The SHA-256 above is hard-coded into `apps/web/public/.well-known/assetlinks.json`. If you ever rotate the keystore, you MUST update assetlinks.json + redeploy the website BEFORE publishing the new build.

---

## What's in the box

| Field | Value |
|---|---|
| Package name | `app.valuebite.twa` |
| Display name | ValueBite |
| Host | truevaluebite.com |
| Min SDK | 23 (Android 6.0+) |
| Version name | 1.0.1 |
| Version code | 2 |
| Theme color | `#22C55E` (green) |
| Background color | `#0A0A0A` (near-black) |
| Orientation | portrait |
| Display | standalone (full-screen, no Chrome chrome) |
| Location delegation | enabled (TWA can request location on PWA's behalf) |
| Notifications | enabled (web push, when implemented) |

Shortcuts (long-press app icon):
- Search restaurants → `/search`
- Browse by purpose → `/purpose`
- Community → `/community`
- My budget → `/profile`

---

## Rebuild from scratch

```bash
cd /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/android-twa

# 1. After editing twa-manifest.json, regenerate Android project
bubblewrap update --appVersionName=<new-version> --appVersionCode=<new-code> --skipPwaValidation

# 2. Build (passwords MUST be passed via env to avoid interactive prompt failure)
BUBBLEWRAP_KEYSTORE_PASSWORD=valuebite2026 \
BUBBLEWRAP_KEY_PASSWORD=valuebite2026 \
bubblewrap build --skipPwaValidation

# 3. Output:
#    app-release-bundle.aab    — Upload this to Play Console
#    app-release-signed.apk    — Direct install on phone for testing
```

**For each new release, bump both `appVersionName` (e.g. 1.0.1 → 1.0.2) and `appVersionCode` (must increment integer: 2 → 3).** Play Console rejects uploads with the same versionCode.

---

## Install APK directly on Android phone (testing)

```bash
# Option A: USB cable + adb
adb install app-release-signed.apk

# Option B: Send to phone via Google Drive / email / AirDroid, then tap to install
#          (you may need to enable "Install from unknown sources" in Android settings)
```

---

## Upload AAB to Play Console

1. Go to https://play.google.com/console → ValueBite app
2. **Testing → Internal testing → Create new release**
3. **Upload** → drag `app-release-bundle.aab`
4. Add release notes (Korean OK)
5. **Save → Review release → Start rollout**
6. Add yourself as tester (Settings → Internal testing → Testers)
7. Get the install link → install on your phone → verify
8. Once OK → **Production → Create new release** → reuse this AAB
9. **Submit for review** — Google takes 7-14 days for first approval

---

## Common errors

### "Keystore password is incorrect"
- Make sure `BUBBLEWRAP_KEYSTORE_PASSWORD=valuebite2026` is set BEFORE the build command on the same line.

### "Package name conflict" on Play Console upload
- The package name `app.valuebite.twa` is locked to this Play Console listing. Don't change it after first release.

### "Digital Asset Links verification failed" (TWA opens in Chrome instead of full-screen)
- Verify https://truevaluebite.com/.well-known/assetlinks.json returns the same SHA-256 fingerprint you can see by running:
  ```
  keytool -printcert -jarfile app-release-signed.apk | grep SHA256
  ```
- If they differ, edit `apps/web/public/.well-known/assetlinks.json`, commit, push (Vercel auto-deploys), then reinstall the APK.

### "App not installed" on Android phone (sideloading APK)
- Likely cause: an older version with a different signature is already installed. Uninstall first:
  ```
  adb uninstall app.valuebite.twa
  ```
