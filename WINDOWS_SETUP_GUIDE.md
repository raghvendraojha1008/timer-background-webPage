# 🪟 Complete Windows Live Wallpaper Setup Guide

## Prerequisites Checklist
- [ ] Node.js installed (v18 or higher)
- [ ] Git installed
- [ ] Visual Studio Code or your preferred IDE
- [ ] Windows 10/11 (for testing)

---

## PHASE 1: Initial Setup

### Step 1: Update package.json

Open `package.json` and make these changes:

1. **Add main entry point** at the top level:
```json
"main": "electron/main.js",
```

2. **Add scripts** to the scripts section:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "electron": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && set NODE_ENV=development&& electron electron/main.js\"",
  "electron:build": "npm run build && electron-builder",
  "electron:build:win": "npm run build && electron-builder --win",
  "electron:build:appx": "npm run build && electron-builder --win appx"
}
```

### Step 2: Install Dependencies

In your project folder, run:
```bash
npm install
```

### Step 3: Create App Icons

1. Navigate to `electron/resources/` folder
2. Create or add these icon files:
   - `icon.ico` (256x256 Windows icon)
   - `tray-icon.png` (16x16 or 32x32 for system tray)
   - `icon.png` (512x512 general purpose)

**Quick Icon Creation:**
- Use online tools like favicon.io or canva.com
- Base your design on a clock/timer theme
- Ensure good visibility at small sizes

---

## PHASE 2: Development & Testing

### Step 4: Test in Development Mode

Run the Electron app in development:
```bash
npm run electron
```

This will:
1. Start the Vite dev server
2. Launch Electron window
3. Enable hot-reload for changes

**Expected Behavior:**
- Window appears full screen
- Shows behind desktop icons (wallpaper mode)
- System tray icon appears
- Right-click tray to access menu

### Step 5: Test Wallpaper Features

Right-click the system tray icon and test:
- ✅ Enable/Disable Wallpaper
- ✅ Show Clock (brings window forward)
- ✅ Settings access
- ✅ Exit

**Troubleshooting:**
- If wallpaper doesn't activate: Check Windows permissions
- If tray icon missing: Verify icon file paths
- If window won't hide: Restart the app

---

## PHASE 3: Build for Distribution

### Step 6: Build Windows Installer

Build a standard Windows installer (NSIS):
```bash
npm run electron:build:win
```

Output: `dist-electron/win-unpacked/` and `.exe` installer

### Step 7: Test the Built App

1. Navigate to `dist-electron/`
2. Run the `.exe` installer
3. Install the app
4. Test all features:
   - [ ] Launches on startup
   - [ ] Wallpaper mode works
   - [ ] Settings persist
   - [ ] Uninstall works cleanly

---

## PHASE 4: Microsoft Store Preparation

### Step 8: Create Microsoft Store Assets

You need these assets for Store submission:

**Required Images:**
1. **StoreLogo.png** - 50x50px
2. **Square44x44Logo.png** - 44x44px
3. **Square150x150Logo.png** - 150x150px
4. **Wide310x150Logo.png** - 310x150px
5. **Screenshots** - At least 1 (1366x768 or larger)
6. **Promotional images** - Feature image, hero image

**App Details Needed:**
- App name: "Live Clock Wallpaper" (or your choice)
- Description: Write a compelling 200-500 word description
- Keywords: clock, wallpaper, live wallpaper, timer, stopwatch
- Privacy policy URL (required)
- Support contact email

### Step 9: Build for Microsoft Store (APPX)

Build the APPX package:
```bash
npm run electron:build:appx
```

**Before building:**

1. **Update `electron-builder.json`** with your details:
```json
{
  "appx": {
    "identityName": "YourCompanyName.LiveClockWallpaper",
    "publisher": "CN=Your Publisher Name",
    "publisherDisplayName": "Your Name"
  }
}
```

2. **Get a Microsoft Developer Account:**
   - Go to https://partner.microsoft.com/dashboard
   - Sign up ($19 one-time fee)
   - Complete publisher verification

3. **Reserve App Name:**
   - In Partner Center, create new app
   - Reserve your app name
   - Note the Identity Name and Publisher info

4. **Update electron-builder.json** with the reserved info

5. **Build the APPX:**
```bash
npm run electron:build:appx
```

Output will be in `dist-electron/`

---

## PHASE 5: Microsoft Store Submission

### Step 10: Submit to Microsoft Store

1. **Sign in to Partner Center:**
   https://partner.microsoft.com/dashboard

2. **Create New Submission:**
   - Go to your app
   - Click "Start submission"

3. **Fill Out Submission Form:**

   **Pricing:**
   - Free or paid (your choice)
   - Set availability (all regions or specific ones)

   **Properties:**
   - Category: Personalization
   - Subcategory: Themes
   - Age rating: Everyone

   **Packages:**
   - Upload your `.appx` file from `dist-electron/`
   - System will validate automatically

   **Store Listings:**
   - Description (highlight features)
   - Screenshots (show the wallpaper in action)
   - Icons (all sizes required)
   - Features list:
     * Live animated wallpaper
     * Customizable clock formats
     * Multiple gradient themes
     * Timer and stopwatch
     * Runs on startup

   **Privacy Policy:**
   - Required even if you don't collect data
   - Can use a simple policy generator online

4. **Submit for Certification:**
   - Review all sections
   - Click "Submit to Store"
   - Certification takes 1-3 days typically

5. **Monitor Certification:**
   - Check Partner Center for status
   - Respond to any issues raised
   - Once approved, your app goes live!

---

## Post-Launch Checklist

After your app is published:

- [ ] Test download from Microsoft Store
- [ ] Set up analytics (optional)
- [ ] Create update schedule
- [ ] Monitor user reviews
- [ ] Plan feature updates

---

## Common Issues & Solutions

### Issue: "Wallpaper not showing"
**Solution:** Check Windows security settings, run as administrator

### Issue: "App crashes on startup"
**Solution:** Check console logs, verify all dependencies installed

### Issue: "Certification failed"
**Solution:** Review Microsoft's feedback, common issues:
- Missing privacy policy
- Incomplete metadata
- Crashes during testing
- Missing required capabilities

### Issue: "Can't build APPX"
**Solution:** 
- Verify electron-builder.json configuration
- Check publisher certificate details match Partner Center
- Ensure all required icons present

---

## Additional Resources

- **Microsoft Store Docs:** https://docs.microsoft.com/windows/apps/
- **Electron Builder Docs:** https://www.electron.build/
- **Partner Center Help:** https://partner.microsoft.com/support

---

## Need Help?

If you encounter issues:
1. Check the console logs in Electron DevTools
2. Review electron-builder output
3. Search Microsoft Partner Center forums
4. Ask in Electron community Discord

Good luck with your Windows live wallpaper app! 🎉
