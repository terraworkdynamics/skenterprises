# 🚀 Hostinger Deployment Guide

## 📁 Files to Upload to Hostinger

Upload the **entire contents** of the `dist/` folder to your Hostinger public_html directory:

### Required Files:
- `index.html` (main entry point)
- `assets/` folder (all CSS, JS, and font files)
- `logo.jpeg` (favicon)
- `apple.jpg`, `battery.jpg`, `camera.jpg`, `laptop.jpg` (images)

## 🔧 Deployment Steps

1. **Build the Production Version** (already done):
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**:
   - Login to your Hostinger control panel
   - Go to File Manager
   - Navigate to `public_html` folder
   - Upload all files from the `dist/` folder
   - Make sure `index.html` is in the root of `public_html`

3. **File Structure on Hostinger**:
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-BXAmw8nr.js
   │   ├── index-Vc8DK5dH.css
   │   ├── vendor-DiVHUFYI.js
   │   ├── mui-BtYwZD9a.js
   │   ├── router-DUUtADUR.js
   │   ├── supabase-CNjoZMIR.js
   │   └── [font files...]
   ├── logo.jpeg
   ├── apple.jpg
   ├── battery.jpg
   ├── camera.jpg
   └── laptop.jpg
   ```

## ⚠️ Important Notes

- **DO NOT** upload the development `index.html` from the root directory
- **ONLY** upload files from the `dist/` folder
- The `dist/index.html` is the production version with proper asset references
- All assets are optimized and minified for production

## 🔍 Troubleshooting

If you still see a blank page:

1. **Check File Permissions**: Ensure all files have proper read permissions
2. **Clear Browser Cache**: Hard refresh (Ctrl+F5) your browser
3. **Check Console**: Open browser developer tools to see any remaining errors
4. **Verify Upload**: Make sure all files from `dist/` are uploaded correctly

## 🎯 Expected Result

After proper deployment, your website should show:
- S K Enterprises homepage with rotating balls animation
- Service cards for Laptops, CCTV, and Inverter
- Contact information and call-to-action buttons
- Responsive design that works on mobile and desktop

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Ensure the `index.html` is in the root of `public_html`
