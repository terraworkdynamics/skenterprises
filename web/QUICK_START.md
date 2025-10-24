# 🚀 Quick Start Guide

## The application is showing empty because you need to set up your environment variables.

## 🔧 Quick Fix

### 1. Create Environment File
Create a `.env` file in the root directory with your Supabase credentials:

```bash
# Create .env file
touch .env
```

### 2. Add Your Supabase Configuration
Edit the `.env` file and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Security Configuration
VITE_APP_ENV=development
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=900000

# Admin Configuration
VITE_ADMIN_EMAIL=admin@skenterprises.com
VITE_ADMIN_PHONE=9972749555
```

### 3. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy your Project URL and anon public key
5. Paste them in your `.env` file

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 What You'll See

Once configured, you'll see:
- ✅ **Home Page**: Beautiful landing page with services
- ✅ **Login Page**: Secure admin login
- ✅ **Dashboard**: Protected admin area
- ✅ **All Features**: Registration, payments, etc.

## 🔐 Security Features

The application includes:
- ✅ **Route Protection**: All admin pages require login
- ✅ **Auto Logout**: Logout when window closes
- ✅ **Session Management**: 1-hour timeout
- ✅ **Brute Force Protection**: 5 attempts = 15-min lockout
- ✅ **Input Sanitization**: XSS protection
- ✅ **Audit Logging**: All actions logged

## 📋 Next Steps

1. **Set up Supabase**:
   - Create project at supabase.com
   - Get your URL and API key
   - Add to `.env` file

2. **Database Setup**:
   - Run `supabase.sql` in Supabase SQL editor
   - Run `database/auth_queries.sql` for security

3. **Test Application**:
   - Visit home page
   - Try admin login
   - Test all features

## 🆘 Still Having Issues?

If the page is still empty:

1. **Check Console**: Look for error messages
2. **Verify .env**: Make sure variables are set correctly
3. **Restart Server**: Stop and restart `npm run dev`
4. **Clear Cache**: Hard refresh browser (Ctrl+F5)

## 📞 Support

- **Technical Issues**: Check console for errors
- **Supabase Setup**: Follow supabase.com documentation
- **Environment Issues**: Verify `.env` file format

---

**🎉 Once configured, your application will be fully functional with maximum security!**
