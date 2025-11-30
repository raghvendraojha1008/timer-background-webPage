# 🔧 Manual Steps Required

## ✅ What's Already Done
- ✅ All Electron files created
- ✅ Configuration files ready
- ✅ Placeholder icons generated
- ✅ Documentation and guides created
- ✅ Batch scripts for easy execution

---

## ⚠️ REQUIRED: Update package.json

**You MUST manually edit `package.json` because it's a protected file.**

### Step 1: Add main entry point
Open `package.json` and add this line at the top level (after `"name"` or `"version"`):
```json
"main": "electron/main.js",
```

### Step 2: Add these scripts to the `"scripts"` section:
```json
"electron": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && set NODE_ENV=development&& electron electron/main.js\"",
"electron:build:win": "npm run build && electron-builder --win",
"electron:build:appx": "npm run build && electron-builder --win appx"
```

**Your `package.json` scripts section should look like this:**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "electron": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && set NODE_ENV=development&& electron electron/main.js\"",
  "electron:build:win": "npm run build && electron-builder --win",
  "electron:build:appx": "npm run build && electron-builder --win appx"
}
```

---

## 📝 Your Action Steps

### TODAY (30 minutes):

1. **Update package.json** (see above) ⚠️ REQUIRED

2. **Run these commands in your project folder:**
   ```bash
   npm install
   npm run electron
   ```

3. **Expected result:**
   - Full-screen window appears
   - Shows behind desktop icons (live wallpaper!)
   - System tray icon in bottom-right corner
   - Right-click tray for menu

### THIS WEEK (2 hours):

4. **Test all features:**
   - Clock displays correctly
   - Timer and stopwatch work
   - Settings save properly
   - Tray menu functions

5. **Build Windows installer:**
   - Double-click `scripts/build-windows.bat`
   - OR run: `npm run electron:build:win`
   - Find installer in `dist-electron/` folder
   - Test the `.exe` on your PC

6. **Optional: Customize icons**
   - Replace icons in `electron/resources/` with your own
   - Use the README in that folder for requirements

### MICROSOFT STORE (Next Week):

7. **Create Microsoft Developer Account**
   - Go to: https://partner.microsoft.com/dashboard
   - Cost: $19 one-time fee
   - Verification takes 1-2 days

8. **Update `electron-builder.json`**
   - Replace `"YourName"` with your name
   - Replace `"YourCompany.LiveClockWallpaper"` with your identity
   - Replace `"CN=YourPublisher"` with your publisher info
   - (Get these from Microsoft Partner Center after account setup)

9. **Build for Store:**
   - Double-click `scripts/build-store.bat`
   - OR run: `npm run electron:build:appx`
   - Upload `.appx` from `dist-electron/` to Partner Center

10. **Submit to Store:**
    - Fill in app details
    - Add screenshots (at least 1)
    - Write description (200-500 words)
    - Add privacy policy URL
    - Submit for certification (1-3 days review)

---

## 🆘 Troubleshooting

### "Cannot find module 'electron'"
**Fix:** Make sure you ran `npm install`

### "npm run electron not found"
**Fix:** You forgot to update package.json (see step 1 above)

### "Icons not loading"
**Fix:** Icons are already created in `electron/resources/`

### "Wallpaper not showing behind icons"
**Fix:** Run as administrator, check Windows permissions

### "Build fails"
**Fix:** Make sure `npm run build` works first, check console output

---

## 📚 Documentation Reference

- **Quick Start:** `QUICKSTART.md`
- **Detailed Guide:** `WINDOWS_SETUP_GUIDE.md`
- **Overview:** `GETTING_STARTED.md`
- **Icon Guide:** `electron/resources/README.md`

---

## 🎯 Quick Test Commands

```bash
# Install dependencies
npm install

# Run in development (after updating package.json)
npm run electron

# Build Windows installer
npm run electron:build:win

# Build for Microsoft Store
npm run electron:build:appx
```

---

## ✨ Success Checklist

- [ ] package.json updated with main entry and scripts
- [ ] Ran `npm install`
- [ ] App runs with `npm run electron`
- [ ] Wallpaper mode works (shows behind desktop icons)
- [ ] System tray icon appears and menu works
- [ ] Windows installer built and tested
- [ ] Microsoft Developer account created (for Store)
- [ ] electron-builder.json updated with your info
- [ ] APPX package built for Store
- [ ] Submitted to Microsoft Store

---

**Start here:** Update package.json → npm install → npm run electron

Good luck! 🚀
