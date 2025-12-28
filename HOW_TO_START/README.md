# 📚 HOW TO START - Complete Setup Guide

**Welcome!** This folder contains everything you need to set up and run this project from scratch.

---

## 🌍 Choose Your Language

- **[English Guide](README_ENGLISH.md)** - Complete step-by-step tutorial in English
- **[Italian Guide](README_ITALIANO.md)** - Guida completa passo-passo in italiano
- **[Quick Start](QUICK_START.md)** - Fast setup for experienced developers

---

## 📁 What's Inside

```
HOW_TO_START/
├── README.md                    # This file - Start here!
├── README_ENGLISH.md            # Complete English guide
├── README_ITALIANO.md           # Guida completa in italiano
├── QUICK_START.md               # Quick setup guide
├── PRESENTAZIONE_CLIENTE.md     # Client presentation (IT)
├── PRESENTAZIONE_CLIENTE_ENGLISH.md  # Client presentation (EN)
├── PRESENTAZIONE_VISIVA.md      # Visual presentation
├── database/
│   └── full_migration.sql       # Complete database setup SQL
├── templates/
│   ├── env.example              # Environment variables template
│   └── edge-functions-secrets.txt  # Edge function secrets template
├── scripts/
│   ├── create-admin-user.sql    # SQL to create admin user
│   ├── deploy-edge-functions.sh  # Bash script (Mac/Linux)
│   └── deploy-edge-functions.ps1 # PowerShell script (Windows)
└── docs/                        # Technical documentation
    ├── PRODUCTION_CHECKLIST.md   # Production deployment checklist
    ├── DEPLOYMENT_READINESS.md   # Deployment status
    ├── DEPLOY_EDGE_FUNCTIONS.md  # Edge functions guide
    ├── MESSAGE_ATTACHMENTS_IMPLEMENTATION.md  # Attachments docs
    └── GOOGLE_ANALYTICS_SEO_SETUP.md  # Google Analytics & SEO guide
```

---

## 🚀 Quick Overview

### What You'll Need:
1. ✅ Node.js installed
2. ✅ Supabase account (free)
3. ✅ 30-60 minutes of time
4. ✅ Basic computer skills

### What You'll Do:
1. 📦 Install software (Node.js, Git, Supabase CLI)
2. 🗄️ Create Supabase project
3. 💾 Run database migration
4. 📁 Create storage bucket
5. 🔐 Configure authentication
6. ⚙️ Deploy edge functions
7. 🔧 Set environment variables
8. 🏃 Run the project locally
9. 👤 Create admin user
10. 🌐 Deploy to production (optional)

---

## 📖 Recommended Reading Order

### For Complete Beginners:
1. Start with **README_ENGLISH.md** or **README_ITALIANO.md**
2. Follow each step carefully
3. Don't skip any steps
4. Read the troubleshooting section if you get stuck

### For Experienced Developers:
1. Read **QUICK_START.md**
2. Use the templates in `templates/` folder
3. Run the scripts in `scripts/` folder
4. Check `docs/` folder for technical reference

---

## 🆘 Need Help?

### Common Issues:
- **"Cannot find module"** → Run `npm install`
- **"Missing environment variables"** → Check `.env` file exists
- **"CORS errors"** → Check `ALLOWED_ORIGINS` in Supabase secrets
- **"RLS policy violation"** → Make sure you ran the migration

### Full Troubleshooting:
See the troubleshooting section in:
- **README_ENGLISH.md** (Section 13)
- **README_ITALIANO.md** (Sezione 13)

---

## ✅ Checklist

Before you start, make sure you have:
- [ ] Node.js installed (`node --version`)
- [ ] Git installed (optional but recommended)
- [ ] Supabase account created
- [ ] Text editor ready (VS Code, Notepad++, etc.)
- [ ] Terminal/Command Prompt ready

---

## 🎯 Next Steps

1. **Choose your language:**
   - English → Open `README_ENGLISH.md`
   - Italian → Apri `README_ITALIANO.md`

2. **Follow the guide step by step**

3. **If you get stuck:**
   - Check the troubleshooting section
   - Review the step you're on
   - Make sure you didn't skip any steps

---

## 📝 Important Notes

- ⚠️ **Never commit `.env` file to Git** - it contains secrets!
- ⚠️ **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - never expose it
- ✅ **All guides are beginner-friendly** - no programming experience needed
- ✅ **Take your time** - don't rush through the steps

---

**Ready to start?** Open `README_ENGLISH.md` or `README_ITALIANO.md` and begin! 🚀

---

**Last Updated:** December 29, 2025  
**Version:** 1.0.0
