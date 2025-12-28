# 📑 HOW_TO_START - Complete File Index

This document lists all files in the `HOW_TO_START` folder and what they're for.

---

## 📚 Main Documentation Files

### `README.md`
**Purpose:** Main entry point - overview and navigation  
**Who needs it:** Everyone - start here!

### `README_ENGLISH.md`
**Purpose:** Complete step-by-step setup guide in English  
**Length:** ~1000+ lines  
**Who needs it:** English speakers, complete beginners  
**Covers:**
- Installing all required software
- Creating Supabase account and project
- Running database migrations
- Configuring storage, auth, edge functions
- Setting environment variables
- Running locally
- Creating admin user
- Deploying to production
- Troubleshooting

### `README_ITALIANO.md`
**Purpose:** Guida completa passo-passo in italiano  
**Length:** ~1000+ righe  
**Who needs it:** Italian speakers, principianti completi  
**Covers:** Same as English version, but in Italian

### `QUICK_START.md`
**Purpose:** Fast setup guide for experienced developers  
**Who needs it:** Developers who know what they're doing  
**Format:** Bullet points and commands only

---

## 💾 Database Files

### `database/full_migration.sql`
**Purpose:** Complete database setup - all tables, functions, policies  
**What it does:**
- Creates all database tables
- Sets up indexes
- Creates PostgreSQL functions
- Enables Row Level Security (RLS)
- Creates RLS policies
- Enables Realtime
- Inserts seed data

**How to use:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire file content
3. Paste and run
4. Wait for "Success" message

**Size:** ~400 lines of SQL

---

## 📝 Template Files

### `templates/env.example`
**Purpose:** Template for `.env` file  
**What it contains:**
- Required Supabase variables
- Optional Google Analytics variable
- Optional Sentry variable
- Comments explaining each variable

**How to use:**
1. Copy to project root as `.env`
2. Replace placeholder values
3. Never commit to Git!

### `templates/edge-functions-secrets.txt`
**Purpose:** Template for Supabase Edge Function secrets  
**What it contains:**
- Required secrets (ALLOWED_ORIGINS, SUPABASE_URL, etc.)
- Optional secrets (MULTIGESTIONALE_API_KEY, RESEND_API_KEY, etc.)
- Instructions on where to add them

**How to use:**
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Add each secret listed in this file
3. Replace placeholder values with actual values

---

## 🔧 Script Files

### `scripts/create-admin-user.sql`
**Purpose:** SQL script to create an admin user  
**What it does:**
- Inserts admin role for a user
- Includes verification query

**How to use:**
1. Register a user in your app
2. Get user UUID from Supabase Dashboard → Authentication → Users
3. Replace `YOUR_USER_UUID_HERE` in the script
4. Run in Supabase SQL Editor

### `scripts/deploy-edge-functions.sh`
**Purpose:** Bash script to deploy all edge functions (Mac/Linux)  
**What it does:**
- Checks if Supabase CLI is installed
- Checks if logged in
- Deploys all 5 edge functions in sequence
- Shows success/error messages

**How to use:**
```bash
chmod +x scripts/deploy-edge-functions.sh
./scripts/deploy-edge-functions.sh
```

### `scripts/deploy-edge-functions.ps1`
**Purpose:** PowerShell script to deploy all edge functions (Windows)  
**What it does:** Same as bash script, but for Windows

**How to use:**
```powershell
.\scripts\deploy-edge-functions.ps1
```

---

## 📊 File Structure Summary

```
HOW_TO_START/
│
├── 📄 README.md                          # Main entry point
├── 📄 README_ENGLISH.md                  # Complete English guide
├── 📄 README_ITALIANO.md                 # Guida completa italiana
├── 📄 QUICK_START.md                     # Quick setup guide
├── 📄 INDEX.md                           # This file
├── 📄 PRESENTAZIONE_CLIENTE.md           # Client presentation (IT)
├── 📄 PRESENTAZIONE_CLIENTE_ENGLISH.md   # Client presentation (EN)
├── 📄 PRESENTAZIONE_VISIVA.md            # Visual presentation
├── 📄 PRODUCTION_AUDIT_REPORT.md         # Production audit report
│
├── 📁 database/
│   └── 📄 full_migration.sql             # Complete database setup
│
├── 📁 templates/
│   ├── 📄 env.example                    # .env file template
│   └── 📄 edge-functions-secrets.txt     # Edge function secrets template
│
├── 📁 scripts/
│   ├── 📄 create-admin-user.sql          # Admin user creation SQL
│   ├── 📄 deploy-edge-functions.sh       # Bash deployment script
│   └── 📄 deploy-edge-functions.ps1      # PowerShell deployment script
│
└── 📁 docs/                              # Technical documentation
    ├── 📄 README.md                       # Docs index
    ├── 📄 PRODUCTION_CHECKLIST.md         # Production checklist
    ├── 📄 DEPLOYMENT_READINESS.md         # Deployment status
    ├── 📄 DEPLOY_EDGE_FUNCTIONS.md        # Edge functions guide
    ├── 📄 MESSAGE_ATTACHMENTS_IMPLEMENTATION.md  # Attachments docs
    └── 📄 GOOGLE_ANALYTICS_SEO_SETUP.md   # Google Analytics & SEO guide
```

---

## 🎯 Which File Should I Use?

### I'm a complete beginner:
→ Start with `README.md`, then follow `README_ENGLISH.md` or `README_ITALIANO.md`

### I know what I'm doing:
→ Read `QUICK_START.md`, use templates and scripts

### I need to set up the database:
→ Use `database/full_migration.sql`

### I need to configure environment:
→ Use `templates/env.example` and `templates/edge-functions-secrets.txt`

### I need to deploy edge functions:
→ Use `scripts/deploy-edge-functions.sh` or `.ps1`  
→ Or see `docs/DEPLOY_EDGE_FUNCTIONS.md` for detailed guide

### I need to create an admin:
→ Use `scripts/create-admin-user.sql`

### I need production deployment info:
→ See `docs/PRODUCTION_CHECKLIST.md` and `docs/DEPLOYMENT_READINESS.md`

### I need technical reference:
→ See `docs/` folder for advanced documentation  
→ See `FULL_DOCUMENTATION.md` in project root for complete reference

---

## ✅ Checklist: Have You Read Everything?

- [ ] Read `README.md` (overview)
- [ ] Read `README_ENGLISH.md` OR `README_ITALIANO.md` (full guide)
- [ ] Reviewed `database/full_migration.sql` (database setup)
- [ ] Reviewed `templates/env.example` (environment variables)
- [ ] Reviewed `templates/edge-functions-secrets.txt` (edge function secrets)
- [ ] Know how to use the scripts in `scripts/` folder

---

## 🆘 Still Need Help?

1. **Check the troubleshooting section** in the main guides
2. **Review the step you're stuck on** - did you skip anything?
3. **Verify all prerequisites** are installed
4. **Check Supabase Dashboard** - are migrations applied?

---

**Last Updated:** December 29, 2025  
**Total Files:** 16 files across 5 folders  
**Total Documentation:** ~3000+ lines
