# ⚡ QUICK START GUIDE

**For experienced developers who want to get started fast.**

---

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
npm install -g supabase
```

### 2. Create Supabase Project
- Go to https://supabase.com → Create Project
- Copy Project URL and API keys

### 3. Run Database Migration
- Open `HOW_TO_START/database/full_migration.sql`
- Copy all content
- Paste in Supabase Dashboard → SQL Editor → Run

### 4. Create Storage Bucket
- Supabase Dashboard → Storage → Create bucket
- Name: `message-attachments` (PRIVATE)

### 5. Configure Environment
- Copy `HOW_TO_START/templates/.env.example` to `.env`
- Fill in your Supabase credentials

### 6. Set Edge Function Secrets
- Supabase Dashboard → Edge Functions → Secrets
- Add secrets from `HOW_TO_START/templates/edge-functions-secrets.txt`

### 7. Deploy Edge Functions
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
supabase functions deploy notify-admin
supabase functions deploy notify-client
supabase functions deploy public-config
```

### 8. Run Project
```bash
npm run dev
```

### 9. Create Admin User
- Register in app → Get UUID from Supabase → Run:
```sql
INSERT INTO user_roles (user_id, role) VALUES ('UUID', 'admin');
```

---

## 📚 Full Documentation

- **English:** `README_ENGLISH.md` - Complete step-by-step guide
- **Italian:** `README_ITALIANO.md` - Guida completa passo-passo

---

## 📁 File Structure

```
HOW_TO_START/
├── README_ENGLISH.md          # Complete English guide
├── README_ITALIANO.md         # Guida completa in italiano
├── QUICK_START.md             # This file
├── database/
│   └── full_migration.sql     # Complete database migration
├── templates/
│   ├── .env.example           # Environment variables template
│   └── edge-functions-secrets.txt  # Edge function secrets template
└── scripts/
    ├── create-admin-user.sql  # SQL to create admin user
    ├── deploy-edge-functions.sh    # Bash script to deploy functions
    └── deploy-edge-functions.ps1   # PowerShell script to deploy functions
```

---

**Need help?** Read the full guides in `README_ENGLISH.md` or `README_ITALIANO.md`
