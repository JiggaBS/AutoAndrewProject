# 🧪 Testing MULTIGESTIONALE_API_KEY

## Quick Answer
**Yes, you can test your API key using `npm run dev`**, but the API key must be configured in Supabase Edge Functions first.

---

## 📋 Prerequisites

### 1. Configure Supabase Secrets
The `MULTIGESTIONALE_API_KEY` must be set as a **secret** in your Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Edge Functions** → **Secrets**
4. Add a new secret:
   - **Name**: `MULTIGESTIONALE_API_KEY`
   - **Value**: Your actual API key from Multigestionale

### 2. Deploy the Edge Function
Make sure the `fetch-vehicles` Edge Function is deployed:

```bash
# Using Supabase CLI
supabase functions deploy fetch-vehicles

# Or deploy via Supabase Dashboard:
# Edge Functions → Create/Edit → Copy code from supabase/functions/fetch-vehicles/index.ts
```

### 3. Create `.env` File (if not exists)
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

**Note**: The `MULTIGESTIONALE_API_KEY` should NOT be in `.env` - it's a backend secret only!

---

## 🧪 Testing Methods

### Method 1: Test via Frontend (npm run dev)

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:8085` (or the port shown)
   - Go to the **Listings** page or **Home** page (they load vehicles)

3. **Check the results:**
   - **Browser Console** (F12 → Console tab):
     - ✅ Success: You'll see vehicles loading
     - ❌ Error: Check for error messages like:
       - `"API key not configured"` → Secret not set in Supabase
       - `"API returned 401/403"` → Invalid API key
       - `"Risposta vuota da Multigestionale"` → API key invalid or IP not whitelisted
   
   - **Network Tab** (F12 → Network tab):
     - Look for request to `/functions/v1/fetch-vehicles`
     - Check the response:
       - ✅ `{ success: true, data: [...] }` → API key works!
       - ❌ `{ success: false, error: "..." }` → Check error message

### Method 2: Test Edge Function Directly

You can test the Edge Function directly using curl or Postman:

```bash
# Replace with your actual Supabase URL and anon key
curl -X POST https://your-project-id.supabase.co/functions/v1/fetch-vehicles \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

**Expected responses:**

✅ **Success:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

❌ **API Key Not Configured:**
```json
{
  "success": false,
  "error": "API key not configured"
}
```

❌ **Invalid API Key:**
```json
{
  "success": false,
  "error": "Risposta vuota da Multigestionale (chiave non valida, IP non autorizzato o endpoint non disponibile)."
}
```

### Method 3: Check Supabase Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → **Logs**
2. Select the `fetch-vehicles` function
3. Look for:
   - ✅ Success logs showing vehicle data
   - ❌ Error logs with details about API failures

---

## 🔍 Troubleshooting

### Error: "API key not configured"
- **Solution**: Add `MULTIGESTIONALE_API_KEY` as a secret in Supabase Edge Functions

### Error: "Risposta vuota da Multigestionale"
- **Possible causes**:
  1. Invalid API key
  2. IP address not whitelisted in Multigestionale
  3. API endpoint changed
- **Solution**: 
  - Verify API key with Multigestionale support
  - Check if your Supabase Edge Function IP needs whitelisting

### Error: "API returned 401/403"
- **Solution**: API key is invalid or expired - contact Multigestionale

### No vehicles loading, but no errors
- **Check**: The API might be returning empty results
- **Test**: Try calling the Edge Function directly (Method 2) to see the raw response

---

## ✅ Success Indicators

When your API key works correctly, you should see:

1. **In Browser:**
   - Vehicles loading on Home/Listings pages
   - No console errors
   - Network requests returning `{ success: true }`

2. **In Supabase Logs:**
   - Successful function invocations
   - Vehicle data being parsed

3. **In Network Tab:**
   - Response with vehicle objects containing:
     - `ad_number`, `make`, `model`, `price`, `images`, etc.

---

## 📝 Quick Test Checklist

- [ ] `MULTIGESTIONALE_API_KEY` secret configured in Supabase
- [ ] Edge Function `fetch-vehicles` deployed
- [ ] `.env` file created with Supabase credentials
- [ ] `npm run dev` started successfully
- [ ] Browser console shows no errors
- [ ] Vehicles appear on the page OR clear error message shown

---

## 🚀 Next Steps

Once your API key is working:
- Test different filters (make, model, price range)
- Verify images are loading correctly
- Check that all vehicle details are displayed properly
