# 🔄 Guida alla Migrazione: Da Lovable a Supabase Indipendente

Questa guida ti aiuterà a configurare il progetto con il tuo nuovo progetto Supabase.

---

## 📋 Checklist Completa

### ✅ Step 1: Ottieni le Credenziali del Nuovo Progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e accedi al tuo nuovo progetto
2. Vai su **Settings** (icona ingranaggio) → **API**
3. Copia questi valori:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ **SEGRETA!**
4. Vai su **Settings** → **General**
5. Copia il **Reference ID** (Project ID)

---

### ✅ Step 2: Aggiorna `supabase/config.toml`

Apri `supabase/config.toml` e sostituisci il `project_id` con il tuo nuovo Reference ID:

```toml
project_id = "TUO_NUOVO_PROJECT_ID"
```

---

### ✅ Step 3: Crea File `.env`

1. Copia il file di esempio:
   ```bash
   # In PowerShell
   Copy-Item .env.example .env
   ```

2. Apri `.env` e compila con i tuoi valori:
   ```env
   VITE_SUPABASE_URL="https://TUO_PROJECT_ID.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="tua-anon-key"
   VITE_SUPABASE_PROJECT_ID="tuo-project-id"
   ```

---

### ✅ Step 4: Setup Database nel Nuovo Progetto

Devi eseguire le migrazioni SQL nel tuo nuovo progetto Supabase:

1. Vai su **SQL Editor** nella dashboard Supabase
2. Esegui gli script SQL in ordine (dalla cartella `supabase/migrations/`):
   - `20251222172254_...sql` - Crea tabella `valuation_requests`
   - `20251222172800_...sql` - (controlla il contenuto)
   - `20251222173416_...sql` - (controlla il contenuto)

   **Oppure** segui la guida completa in `README-SETUP.md` sezione "Setup Database"

---

### ✅ Step 5: Configura Edge Functions

#### 5.1: Configura i Secrets

1. In Supabase, vai su **Settings** → **Edge Functions**
2. Nella sezione **Secrets**, aggiungi:
   - `MULTIGESTIONALE_API_KEY` - La tua chiave API per i veicoli
   - `RESEND_API_KEY` - La tua chiave Resend per le email
   - `SUPABASE_URL` - Il tuo Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - La tua service_role key

#### 5.2: Deploy delle Functions

**Opzione A: Usando Supabase Dashboard (Più Facile)**
1. Vai su **Edge Functions** nella dashboard
2. Clicca **Create a new function**
3. Per ogni funzione (`fetch-vehicles` e `submit-valuation`):
   - Crea una nuova funzione
   - Copia il contenuto da `supabase/functions/[nome-funzione]/index.ts`
   - Incolla nel code editor
   - Salva e deploy

**Opzione B: Usando Supabase CLI**
```bash
# Login
supabase login

# Collega il progetto
supabase link --project-ref TUO_PROJECT_ID

# Deploy functions
supabase functions deploy fetch-vehicles
supabase functions deploy submit-valuation
```

---

### ✅ Step 6: Configura Autenticazione

1. Vai su **Authentication** → **Providers**
2. Abilita **Email** provider
3. Configura:
   - ✅ Enable Email Signup
   - ✅ Enable Email Login
   - ⬜ Confirm email (disabilita per test)

4. Vai su **Authentication** → **URL Configuration**
5. Imposta:
   - **Site URL**: `http://localhost:5173` (per sviluppo)
   - **Redirect URLs**: `http://localhost:5173/**`

---

### ✅ Step 7: Testa la Configurazione

1. Installa le dipendenze (se non l'hai già fatto):
   ```bash
   npm install
   ```

2. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

3. Apri [http://localhost:5173](http://localhost:5173)

4. Verifica che:
   - L'app si carichi senza errori
   - Non ci siano errori nella console del browser
   - Le chiamate API funzionino

---

## 🔍 Verifica Finale

Controlla che tutto sia configurato correttamente:

- [ ] `supabase/config.toml` ha il tuo nuovo Project ID
- [ ] File `.env` creato con le credenziali corrette
- [ ] Database migrazioni eseguite
- [ ] Edge Functions deployate
- [ ] Secrets configurati nelle Edge Functions
- [ ] Autenticazione configurata
- [ ] App si avvia senza errori

---

## ❓ Troubleshooting

### Errore: "Invalid API key"
- Verifica che `.env` abbia i valori corretti
- Riavvia il server di sviluppo dopo aver modificato `.env`

### Errore: "Function not found"
- Verifica che le Edge Functions siano deployate
- Controlla che i nomi delle funzioni corrispondano

### Errore: "Database error"
- Verifica che le migrazioni SQL siano state eseguite
- Controlla che le tabelle esistano in **Table Editor**

---

## 📝 Note Importanti

- ⚠️ **NON committare** il file `.env` (è già in `.gitignore`)
- 🔒 **NON condividere** la `service_role key` pubblicamente
- ✅ Il file `.env.example` è un template sicuro da committare

---

**Ultimo aggiornamento**: Dicembre 2024

