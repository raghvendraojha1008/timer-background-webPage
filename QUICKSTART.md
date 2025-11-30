# 🚀 Quick Start Guide

## Fastest Path to Running Your Live Wallpaper

### 1️⃣ First-Time Setup (5 minutes)

```bash
# Install dependencies
npm install

# Add these to package.json "scripts":
"electron": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && set NODE_ENV=development&& electron electron/main.js\"",
"electron:build:win": "npm run build && electron-builder --win",
"electron:build:appx": "npm run build && electron-builder --win appx"

# Add this at the top level of package.json:
"main": "electron/main.js",
```

### 2️⃣ Create Icons (5 minutes)

Add these files to `electron/resources/`:
- `icon.ico` (256x256) - Main app icon
- `tray-icon.png` (32x32) - Tray icon
- `icon.png` (512x512) - General use

**Don't have icons?** Use placeholder icons temporarily:
- Create simple colored squares with your app name
- Use online tools: favicon.io, canva.com

### 3️⃣ Test It (2 minutes)

```bash
# Run in development mode
npm run electron
```

Expected result:
- ✅ Full-screen window appears
- ✅ Shows behind desktop icons
- ✅ Tray icon in system tray (bottom-right)
- ✅ Right-click tray for menu

### 4️⃣ Build Installer (5 minutes)

```bash
# Build Windows installer
npm run electron:build:win
```

Find your app in `dist-electron/` folder!

---

## For Microsoft Store

### Before you start:
1. Create Microsoft Developer account ($19): https://partner.microsoft.com
2. Reserve app name in Partner Center
3. Update `electron-builder.json` with your identity info

### Build for Store:
```bash
npm run electron:build:appx
```

### Submit:
1. Upload `.appx` to Partner Center
2. Fill in app details & screenshots
3. Submit for review (1-3 days)

---

## Troubleshooting

**Problem:** npm run electron fails
- **Fix:** Make sure you updated package.json as shown in step 1

**Problem:** Icons not showing
- **Fix:** Check file paths in `electron/main.js` match your icon locations

**Problem:** Wallpaper mode not working
- **Fix:** Run app as administrator, check Windows permissions

**Problem:** Build fails
- **Fix:** Run `npm install` again, ensure all dependencies installed

---

## Next Steps

✅ Development works → Build installer → Test on another PC → Microsoft Store

**Full detailed guide:** See `WINDOWS_SETUP_GUIDE.md`

---

**Questions?** Check the detailed guide or console logs for specific errors.
