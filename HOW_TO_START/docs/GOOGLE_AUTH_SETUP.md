# 🔐 Google Authentication Setup Guide

This guide will walk you through configuring Google OAuth authentication for your Supabase project.

## 📋 Prerequisites

- A Supabase project (already set up)
- A Google account
- Access to Google Cloud Console

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one:
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Enter a project name (e.g., "My App Authentication")
   - Click **"Create"**

### 1.2 Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity Services API"**
3. Click on it and click **"Enable"**

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Your application name
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (default scopes are fine)
7. On the **Test users** page (if in testing mode), add test users if needed
8. Click **"Save and Continue"**

### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Give it a name (e.g., "Supabase Auth Client")
5. **Authorized JavaScript origins** - Add these URLs:
   ```
   https://YOUR_PROJECT_REF.supabase.co
   http://localhost:8085
   https://yourdomain.com
   ```
   Replace:
   - `YOUR_PROJECT_REF` with your Supabase project reference ID
   - `yourdomain.com` with your production domain (if applicable)

6. **Authorized redirect URIs** - Add these URLs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   http://localhost:8085/auth/v1/callback
   https://yourdomain.com/auth/v1/callback
   ```

7. Click **"Create"**
8. **IMPORTANT**: Copy and save:
   - **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

⚠️ **Security Note**: Keep these credentials secure! Never commit them to version control.

---

## Step 2: Configure Supabase Dashboard

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **"Google"** in the list and click on it
5. Toggle **"Enable Google provider"** to **ON**
6. Enter your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **"Save"**

### 2.2 Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set your **Site URL**:
   - For development: `http://localhost:8085`
   - For production: `https://yourdomain.com`
3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:8085/**
   https://yourdomain.com/**
   https://*.vercel.app/**
   ```
4. Click **"Save"**

---

## Step 3: Verify Code Implementation

Your codebase already has Google authentication implemented! Here's what's already set up:

### 3.1 Auth Component

The `src/pages/Auth.tsx` file already includes:

```216:235:src/pages/Auth.tsx
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: error instanceof Error ? error.message : t("auth.error.google"),
        variant: "destructive",
      });
      setLoading(false);
    }
  };
```

### 3.2 Supabase Client Configuration

Your Supabase client is already configured with PKCE flow support:

```30:38:src/integrations/supabase/client.ts
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // Use sessionStorage for better XSS protection (tokens cleared on tab close)
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Enable PKCE flow detection
  },
});
```

### 3.3 UI Button

The Google sign-in button is already in the Auth component UI.

---

## Step 4: Test Google Authentication

### 4.1 Local Testing

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the auth page:**
   - Open `http://localhost:8085/auth` in your browser

3. **Click "Continue with Google"** button

4. **Expected flow:**
   - You'll be redirected to Google's sign-in page
   - After signing in, you'll be redirected back to your app
   - You should be logged in and redirected to `/dashboard` (or `/admin` if you're an admin)

### 4.2 Troubleshooting

#### Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in Google Cloud Console doesn't match Supabase's callback URL
- **Solution**: 
  1. Check your Supabase project reference ID
  2. Add `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` to Google Cloud Console's authorized redirect URIs
  3. Make sure there are no typos or extra spaces

#### Error: "invalid_client"
- **Cause**: Incorrect Client ID or Client Secret in Supabase Dashboard
- **Solution**: 
  1. Double-check the credentials in Supabase Dashboard → Authentication → Providers → Google
  2. Make sure you copied the entire Client ID and Client Secret (no extra spaces)

#### Error: "access_denied"
- **Cause**: User denied permission or OAuth consent screen not configured
- **Solution**: 
  1. Complete the OAuth consent screen setup in Google Cloud Console
  2. If in testing mode, make sure the user's email is added to test users

#### No redirect after Google sign-in
- **Cause**: Redirect URL not configured in Supabase
- **Solution**: 
  1. Go to Supabase Dashboard → Authentication → URL Configuration
  2. Add your redirect URLs (including `http://localhost:8085/**` for development)

---

## Step 5: Production Setup

### 5.1 Update Google Cloud Console

1. Add your production domain to **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   ```

2. Add your production callback URL to **Authorized redirect URIs**:
   ```
   https://yourdomain.com/auth/v1/callback
   ```

### 5.2 Update Supabase Configuration

1. In Supabase Dashboard → **Authentication** → **URL Configuration**:
   - Set **Site URL** to your production domain: `https://yourdomain.com`
   - Add production redirect URLs

2. Verify the Google provider settings are still correct

### 5.3 Test Production

1. Deploy your application
2. Test Google sign-in on the production domain
3. Verify users are redirected correctly after authentication

---

## ✅ Verification Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created (Client ID & Secret)
- [ ] Authorized JavaScript origins added in Google Console
- [ ] Authorized redirect URIs added in Google Console
- [ ] Google provider enabled in Supabase Dashboard
- [ ] Client ID and Secret added to Supabase Dashboard
- [ ] Redirect URLs configured in Supabase Dashboard
- [ ] Tested Google sign-in locally
- [ ] Tested Google sign-in in production (if applicable)

---

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data (already configured)
3. **Rotate credentials** if they're ever exposed
4. **Use HTTPS** in production (required for OAuth)
5. **Limit redirect URIs** to only your domains
6. **Review OAuth consent screen** regularly

---

## 📚 Additional Resources

- [Supabase Google Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Reference](https://supabase.com/docs/reference/javascript/auth-signinwithoauth)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Check Supabase Dashboard → Authentication → Logs
3. Verify all URLs match exactly (no trailing slashes, correct protocol)
4. Ensure your Google Cloud Console project is active and APIs are enabled

---

**Congratulations!** 🎉 Your Google authentication is now configured and ready to use!
