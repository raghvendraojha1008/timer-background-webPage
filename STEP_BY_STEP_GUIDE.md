# 🎯 Complete Step-by-Step Guide to Windows Wallpaper App

## Overview
This guide will help you transform your clock app into a Windows 10/11 live wallpaper that can be distributed via the Microsoft Store.

---

## 📝 **STEP 1: Create Your App Icons** (30 minutes)

### What you need:
- **icon.ico** (256x256) - Main app icon
- **tray-icon.png** (32x32) - System tray icon  
- **icon.png** (512x512) - General purpose

### Quick Method:
1. Go to https://favicon.io/favicon-generator/
2. Design a simple clock icon:
   - Background: Choose a color from your app
   - Text: "⏰" or "🕐" emoji, or use "CLOCK"
   - Font: Bold, readable
3. Download the package
4. Rename the `.ico` file to `icon.ico`
5. Place it in `electron/resources/icon.ico`
6. For PNG icons, use an image editor or https://www.remove.bg/ to create transparent PNGs

### Design Ideas for Clock Icon:
- 🕐 Clock emoji style
- ⏰ Alarm clock symbol
- Minimalist circle with clock hands
- Digital time display (12:00)

**✅ Checkpoint:** You should have these 3 files in `electron/resources/`

---

## 📝 **STEP 2: Add Required Dependencies** (5 minutes)

### Open your terminal and run:
```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
npm install ref-napi
```

**Why these packages:**
- `electron` - Creates desktop app
- `electron-builder` - Builds installers
- `concurrently` - Runs multiple commands
- `wait-on` - Waits for dev server
- `ref-napi` - Windows native integration
- `cross-env` - Cross-platform environment variables

**✅ Checkpoint:** All packages should install without errors

---

## 📝 **STEP 3: Update package.json** (Manual Step Required)

**⚠️ IMPORTANT:** You need to manually edit `package.json` because it's read-only to me.

### Add these lines to your package.json:

1. **At the top level**, add:
```json
"main": "electron/main.js",
```

2. **In the "scripts" section**, add these commands:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "electron": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"wait-on http://localhost:8080 && electron .\"",
  "electron:build": "npm run build && electron-builder --win --x64",
  "electron:build-store": "npm run build && electron-builder --win --appx",
  "pack": "electron-builder --dir",
  "dist": "electron-builder"
}
```

### Your complete package.json should look like:
```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"wait-on http://localhost:8080 && electron .\"",
    "electron:build": "npm run build && electron-builder --win --x64",
    "electron:build-store": "npm run build && electron-builder --win --appx",
    ...
  },
  ...
}
```

**✅ Checkpoint:** package.json has the `main` field and new scripts

---

## 📝 **STEP 4: Test in Development Mode** (10 minutes)

### Run your app:
```bash
npm run electron
```

**OR** double-click `scripts/run-dev.bat` (Windows only)

### What should happen:
1. Vite dev server starts
2. Electron window opens
3. Your clock appears as a maximized window
4. Window goes behind desktop icons (wallpaper mode)
5. System tray icon appears (bottom-right taskbar)

### Test these features:
- [ ] Clock displays correctly
- [ ] Background gradients change
- [ ] Timer works
- [ ] Stopwatch works
- [ ] Right-click tray icon shows menu
- [ ] "Disable Wallpaper" brings window to front
- [ ] "Enable Wallpaper" sends it back behind icons
- [ ] Settings persist after restart

### Troubleshooting:
- **Icons not showing?** Check `electron/resources/` folder
- **Window not behind icons?** Run as Administrator (right-click bat file)
- **Tray menu doesn't appear?** Tray icon might need permissions

**✅ Checkpoint:** App runs in development mode

---

## 📝 **STEP 5: Customize Your App** (30 minutes)

### Update `electron-builder.json`:

```json
{
  "appId": "com.yourname.clockwallpaper",
  "productName": "My Live Clock Wallpaper",
  "win": {
    "publisherName": "Your Name or Company"
  },
  "appx": {
    "displayName": "My Live Clock Wallpaper",
    "identityName": "YourCompany.ClockWallpaper",
    "publisher": "CN=Your Publisher Name",
    "publisherDisplayName": "Your Name"
  }
}
```

### What to change:
- `appId` - Unique identifier (reverse domain style)
- `productName` - Name users will see
- `publisherName` - Your name
- `displayName` - Store listing name

**✅ Checkpoint:** App metadata is personalized

---

## 📝 **STEP 6: Build Windows Installer** (15 minutes)

### Build standard installer (.exe):
```bash
npm run electron:build
```

**OR** double-click `scripts/build-windows.bat`

### What happens:
1. Vite builds production files
2. Electron Builder creates installer
3. Output in `dist-electron/` folder
4. Creates both `.exe` installer and unpacked folder

### Test the installer:
1. Go to `dist-electron/`
2. Find `Live Clock Wallpaper Setup X.X.X.exe`
3. Install it on your PC
4. Run the installed app
5. Verify all features work

**✅ Checkpoint:** You have a working .exe installer

---

## 📝 **STEP 7: Prepare for Microsoft Store** (1 hour)

### 7.1 Create Microsoft Developer Account
1. Go to https://partner.microsoft.com/
2. Sign up (costs $19 one-time)
3. Complete identity verification (1-2 days)
4. Access Partner Center dashboard

### 7.2 Create Store Assets

You need these images:

| Asset | Size | Purpose |
|-------|------|---------|
| App Icon | 300x300 | Store listing |
| Screenshots | 1366x768 | Show your app |
| Hero Image | 1920x1080 | Featured image |
| Promo Images | Various | Marketing |

**Screenshot tips:**
- Show clock in different modes (timer, stopwatch)
- Show tray menu
- Show settings panel
- Capture on actual desktop with icons

### 7.3 Write Store Description

**Title:** (50 chars max)
```
Live Clock Wallpaper - Animated Desktop Clock
```

**Short description:** (200 chars)
```
Transform your desktop with a beautiful animated clock wallpaper. Features timer, stopwatch, and customizable themes. Runs as live wallpaper behind your icons.
```

**Full description:** (Write 300-500 words about)
- What it does
- Key features (timer, stopwatch, themes)
- How it works (system tray, wallpaper mode)
- Why it's useful
- How to use it

### 7.4 Set App Pricing
- Free or Paid (recommend starting Free)
- Can always add in-app purchases later

### 7.5 Set Age Rating
- Complete questionnaire (usually E for Everyone)

**✅ Checkpoint:** Store account ready, assets prepared

---

## 📝 **STEP 8: Build for Microsoft Store** (20 minutes)

### Build APPX package:
```bash
npm run electron:build-store
```

**OR** double-click `scripts/build-store.bat`

### What you get:
- `.appx` file in `dist-electron/`
- This is the package you upload to Microsoft

### Test APPX locally (optional):
1. Enable Developer Mode in Windows Settings
2. Double-click the `.appx` file
3. Click "Install"
4. Test the app

**✅ Checkpoint:** APPX package created

---

## 📝 **STEP 9: Submit to Microsoft Store** (30 minutes)

### In Partner Center:

1. **Create new app submission**
   - Click "Create a new app"
   - Reserve app name
   
2. **Upload package**
   - Go to "Packages" section
   - Upload your `.appx` file
   - Wait for validation (5-10 minutes)

3. **Fill out Store listing**
   - Upload screenshots
   - Add description
   - Add keywords (clock, wallpaper, timer, desktop)
   - Add support contact info

4. **Set pricing & availability**
   - Choose markets (select all)
   - Set price (Free recommended)

5. **Complete age ratings**
   - Usually E (Everyone)

6. **Add privacy policy** (if collecting data)
   - Can use a template
   - Host on GitHub Pages or your website

7. **Submit for certification**
   - Review everything
   - Click "Submit to Store"
   - Wait 1-3 days for approval

**✅ Checkpoint:** App submitted and in certification

---

## 📝 **STEP 10: After Approval** (Ongoing)

### When app goes live:

1. **Test from Store**
   - Download your own app
   - Verify everything works
   - Check if updates work

2. **Monitor reviews**
   - Respond to user feedback
   - Fix reported bugs

3. **Plan updates**
   - Release every 2-3 months
   - Add requested features
   - Keep app fresh

4. **Marketing** (optional)
   - Share on social media
   - Post on Reddit (r/Windows10, r/Wallpapers)
   - Create demo video for YouTube

**✅ Checkpoint:** App is live! 🎉

---

## 🎯 Complete Checklist

### Development Phase:
- [ ] Icons created (icon.ico, tray-icon.png, icon.png)
- [ ] Dependencies installed (`npm install`)
- [ ] package.json updated (main + scripts)
- [ ] App runs in dev mode (`npm run electron`)
- [ ] All features tested (clock, timer, stopwatch)
- [ ] Wallpaper mode works (behind desktop icons)
- [ ] System tray menu works
- [ ] Settings persist after restart

### Build Phase:
- [ ] electron-builder.json customized
- [ ] .exe installer built (`npm run electron:build`)
- [ ] Installer tested on clean Windows install
- [ ] APPX package built (`npm run electron:build-store`)
- [ ] APPX tested locally (optional)

### Store Phase:
- [ ] Microsoft Developer account created ($19)
- [ ] Identity verified (1-2 days)
- [ ] Screenshots captured (at least 3)
- [ ] Store description written
- [ ] App icon prepared (300x300)
- [ ] Age rating completed
- [ ] Privacy policy created (if needed)
- [ ] APPX uploaded to Partner Center
- [ ] Store listing completed
- [ ] Submitted for certification

### Post-Launch:
- [ ] App downloaded and tested from Store
- [ ] Reviews monitored
- [ ] First update planned
- [ ] Shared with friends/community

---

## ⏱️ Time Estimates

| Phase | Time |
|-------|------|
| Create icons | 30 min |
| Setup & test | 1 hour |
| Build installer | 30 min |
| Store prep | 2 hours |
| Submission | 30 min |
| **Total active time** | **4.5 hours** |
| Microsoft verification | 1-2 days |
| Certification review | 1-3 days |
| **Total calendar time** | **1-2 weeks** |

---

## 🆘 Common Issues

### "electron: command not found"
**Fix:** Run `npm install` again

### "Cannot find module 'electron'"
**Fix:** Make sure package.json has `"main": "electron/main.js"`

### Wallpaper not behind icons
**Fix:** 
- Run as Administrator
- Close other wallpaper apps
- Restart Windows Explorer (Task Manager)

### Build fails
**Fix:**
- Check all icons exist
- Run `npm run build` first to test
- Check console for specific errors

### APPX upload rejected
**Fix:**
- Check publisher certificate matches
- Verify appId is unique
- Update version number if resubmitting

---

## 📚 Additional Resources

- **Electron Docs:** https://www.electronjs.org/docs
- **Electron Builder:** https://www.electron.build/
- **Microsoft Store Guide:** https://docs.microsoft.com/windows/uwp/publish/
- **Icon Tools:** https://favicon.io/, https://www.canva.com/
- **Lovable Docs:** https://docs.lovable.dev/

---

## 🎊 You're Ready!

Follow these steps in order, and in about 2 weeks you'll have your app live on the Microsoft Store!

**Questions?** Check the troubleshooting section or reach out to the Lovable community.

Good luck! 🚀
