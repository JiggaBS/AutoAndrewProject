# 🚀 GUIDA COMPLETA DI CONFIGURAZIONE - ITALIANO

**Benvenuto!** Questa guida ti aiuterà a configurare e avviare questo progetto da zero, anche se sei un principiante completo.

---

## 📋 INDICE

1. [Prerequisiti](#1-prerequisiti)
2. [Passo 1: Installare Software Necessari](#2-passo-1-installare-software-necessari)
3. [Passo 2: Creare Account e Progetto Supabase](#3-passo-2-creare-account-e-progetto-supabase)
4. [Passo 3: Configurare Database (Migrazioni)](#4-passo-3-configurare-database-migrazioni)
5. [Passo 4: Configurare Storage Bucket](#5-passo-4-configurare-storage-bucket)
6. [Passo 5: Configurare Autenticazione](#6-passo-5-configurare-autenticazione)
7. [Passo 6: Distribuire Edge Functions](#7-passo-6-distribuire-edge-functions)
8. [Passo 7: Configurare Variabili d'Ambiente](#8-passo-7-configurare-variabili-dambiente)
9. [Passo 8: Installare Dipendenze del Progetto](#9-passo-8-installare-dipendenze-del-progetto)
10. [Passo 9: Eseguire il Progetto Localmente](#10-passo-9-eseguire-il-progetto-localmente)
11. [Passo 10: Creare Utente Admin](#11-passo-10-creare-utente-admin)
12. [Passo 11: Distribuire in Produzione (Vercel)](#12-passo-11-distribuire-in-produzione-vercel)
13. [Risoluzione Problemi](#13-risoluzione-problemi)

---

## 1. PREREQUISITI

Prima di iniziare, assicurati di avere:
- Un computer (Windows, Mac o Linux)
- Connessione internet
- Un indirizzo email
- Competenze informatiche di base (aprire file, copiare testo)

**NON hai bisogno di:**
- Esperienza di programmazione
- Conoscenze di database
- Competenze di gestione server

---

## 2. PASSO 1: INSTALLARE SOFTWARE NECESSARI

### 2.1 Installare Node.js

1. **Vai su:** https://nodejs.org/
2. **Scarica:** Clicca sul pulsante versione "LTS" (Long Term Support)
3. **Installa:** Esegui il file scaricato e segui la procedura guidata
4. **Verifica:** Apri un terminale/prompt dei comandi e digita:
   ```bash
   node --version
   ```
   Dovresti vedere qualcosa come `v20.x.x` o `v18.x.x`

### 2.2 Installare Git (Opzionale ma Consigliato)

1. **Vai su:** https://git-scm.com/downloads
2. **Scarica:** Scegli il tuo sistema operativo
3. **Installa:** Esegui l'installer con impostazioni predefinite
4. **Verifica:** Apri il terminale e digita:
   ```bash
   git --version
   ```

### 2.3 Installare Supabase CLI (Per Edge Functions)

1. **Apri terminale/prompt dei comandi**
2. **Installa Supabase CLI:**
   ```bash
   npm install -g supabase
   ```
   Oppure su Mac/Linux:
   ```bash
   brew install supabase/tap/supabase
   ```
3. **Verifica:**
   ```bash
   supabase --version
   ```

---

## 3. PASSO 2: CREARE ACCOUNT E PROGETTO SUPABASE

### 3.1 Creare Account Supabase

1. **Vai su:** https://supabase.com/
2. **Clicca:** "Start your project" o "Sign up"
3. **Registrati** con la tua email o account GitHub
4. **Verifica** la tua email se richiesto

### 3.2 Creare Nuovo Progetto

1. **Clicca:** Pulsante "New Project"
2. **Compila il modulo:**
   - **Nome:** Scegli un nome qualsiasi (es. "AutoAndrew")
   - **Password Database:** Crea una password forte (SALVALA!)
   - **Regione:** Scegli quella più vicina ai tuoi utenti
   - **Piano Tariffario:** Inizia con il piano "Free"
3. **Clicca:** "Create new project"
4. **Attendi:** 2-3 minuti per la creazione del progetto

### 3.3 Ottenere Credenziali del Progetto

1. **Vai su:** Impostazioni Progetto → API
2. **Copia questi valori** (ti serviranno dopo):
   - **URL Progetto:** `https://xxxxx.supabase.co`
   - **Chiave anon/public:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Chiave service_role:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (MANTIENI SEGRETA!)

**⚠️ IMPORTANTE:** Salva questi in un file di testo per uso successivo!

---

## 4. PASSO 3: CONFIGURARE DATABASE (MIGRAZIONI)

### 4.1 Aprire SQL Editor

1. **Nel Dashboard Supabase:** Clicca "SQL Editor" nella barra laterale sinistra
2. **Clicca:** "New query"

### 4.2 Eseguire la Migrazione Completa

1. **Apri il file:** `HOW_TO_START/database/full_migration.sql`
2. **Copia TUTTO il contenuto** (Ctrl+A, Ctrl+C)
3. **Incolla** nell'SQL Editor di Supabase
4. **Clicca:** Pulsante "Run" (o premi Ctrl+Invio)
5. **Attendi:** 10-30 secondi per il completamento della migrazione
6. **Verifica:** Dovresti vedere "Success. No rows returned"

### 4.3 Verificare che le Tabelle Siano State Create

1. **Nel Dashboard Supabase:** Clicca "Table Editor" nella barra laterale sinistra
2. **Dovresti vedere queste tabelle:**
   - `user_profiles`
   - `user_roles`
   - `app_settings`
   - `saved_vehicles`
   - `valuation_requests`
   - `valuation_messages`
   - `activity_log`

✅ **Se vedi tutte le tabelle, la configurazione del database è completa!**

---

## 5. PASSO 4: CONFIGURARE STORAGE BUCKET

### 5.1 Creare Storage Bucket

1. **Nel Dashboard Supabase:** Clicca "Storage" nella barra laterale sinistra
2. **Clicca:** "Create a new bucket"
3. **Compila:**
   - **Nome:** `message-attachments` (NOME ESATTO, sensibile alle maiuscole!)
   - **Bucket pubblico:** ❌ **Deselezionato** (deve essere privato!)
4. **Clicca:** "Create bucket"

### 5.2 Configurare Impostazioni Bucket

1. **Clicca su** il bucket `message-attachments`
2. **Vai su:** Tab "Settings"
3. **Imposta:**
   - **Limite dimensione file:** `10485760` (10MB in byte)
   - **Tipi MIME consentiti:** 
     ```
     image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*
     ```
4. **Clicca:** "Save"

### 5.3 Verificare Policy di Storage

La migrazione dovrebbe aver creato automaticamente le policy di storage. Per verificare:

1. **Vai su:** Storage → Policies
2. **Dovresti vedere policy per** il bucket `message-attachments`
3. **Se non ci sono, esegui questo SQL** nell'SQL Editor:
   ```sql
   -- Verifica se le policy esistono
   SELECT * FROM storage.policies WHERE bucket_id = 'message-attachments';
   ```

✅ **Lo storage è ora configurato!**

---

## 6. PASSO 5: CONFIGURARE AUTENTICAZIONE

### 6.1 Configurare URL di Autenticazione

1. **Nel Dashboard Supabase:** Vai su Authentication → URL Configuration
2. **Imposta Site URL:**
   - Per sviluppo locale: `http://localhost:8085`
   - Per produzione: `https://tuodominio.com`
3. **Aggiungi Redirect URL:**
   ```
   http://localhost:8085/**
   https://tuodominio.com/**
   https://*.vercel.app/**
   ```
4. **Clicca:** "Save"

### 6.2 Abilitare Autenticazione Email (Opzionale)

1. **Vai su:** Authentication → Providers
2. **Clicca:** Provider "Email"
3. **Abilita:** "Enable email provider"
4. **Configura template email** (opzionale, usa default se non configurato)

### 6.3 Abilitare Google OAuth (Opzionale)

1. **Vai su:** Authentication → Providers
2. **Clicca:** Provider "Google"
3. **Abilita:** "Enable Google provider"
4. **Ottieni credenziali da Google Cloud Console:**
   - Vai su https://console.cloud.google.com/
   - Crea credenziali OAuth 2.0
   - Copia Client ID e Client Secret
5. **Incolla** nelle impostazioni del provider Google di Supabase
6. **Clicca:** "Save"

✅ **L'autenticazione è ora configurata!**

---

## 7. PASSO 6: DISTRIBUIRE EDGE FUNCTIONS

### 7.1 Installare Supabase CLI (Se Non Fatto)

```bash
npm install -g supabase
```

### 7.2 Accedere a Supabase

1. **Apri terminale/prompt dei comandi**
2. **Esegui:**
   ```bash
   supabase login
   ```
3. **Segui le istruzioni:** Si aprirà un browser per autenticarti
4. **Copia il token di accesso** e incollalo nel terminale

### 7.3 Collegare il Tuo Progetto

1. **Ottieni il tuo ID di riferimento del progetto:**
   - Nel Dashboard Supabase → Settings → General
   - Copia il "Reference ID" (sembra: `abcdefghijklmnop`)
2. **Nel terminale, esegui:**
   ```bash
   supabase link --project-ref IL_TUO_PROJECT_REF_ID
   ```
   Sostituisci `IL_TUO_PROJECT_REF_ID` con il tuo ID di riferimento effettivo

### 7.4 Impostare Segreti delle Edge Functions

1. **Nel Dashboard Supabase:** Vai su Edge Functions → Secrets
2. **Aggiungi questi segreti** (clicca "Add new secret" per ciascuno):

   **Richiesti:**
   ```
   ALLOWED_ORIGINS = http://localhost:8085,https://tuodominio.com,https://*.vercel.app
   SUPABASE_URL = https://IL_TUO_PROJECT_REF.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = LA_TUA_SERVICE_ROLE_KEY
   ```

   **Opzionali (ma consigliati):**
   ```
   MULTIGESTIONALE_API_KEY = la-tua-api-key-qui
   RESEND_API_KEY = la-tua-resend-api-key
   DEALER_EMAIL = dealer@esempio.com
   ADMIN_EMAIL = admin@esempio.com
   ```

### 7.5 Distribuire Ogni Edge Function

**Naviga alla root del progetto** (dove si trova la cartella `supabase`), poi esegui:

```bash
# Distribuisci funzione fetch-vehicles
supabase functions deploy fetch-vehicles

# Distribuisci funzione submit-valuation
supabase functions deploy submit-valuation

# Distribuisci funzione notify-admin
supabase functions deploy notify-admin

# Distribuisci funzione notify-client
supabase functions deploy notify-client

# Distribuisci funzione public-config
supabase functions deploy public-config
```

**Per ogni funzione:**
- Attendi il messaggio "Deployed successfully"
- Se vedi errori, verifica di essere loggato e che il progetto sia collegato

### 7.6 Verificare che le Funzioni Siano State Distribuite

1. **Nel Dashboard Supabase:** Vai su Edge Functions
2. **Dovresti vedere 5 funzioni:**
   - `fetch-vehicles`
   - `submit-valuation`
   - `notify-admin`
   - `notify-client`
   - `public-config`

✅ **Le edge functions sono ora distribuite!**

---

## 8. PASSO 7: CONFIGURARE VARIABILI D'AMBIENTE

### 8.1 Creare File `.env`

1. **Nella cartella root del progetto** (dove si trova `package.json`)
2. **Crea un nuovo file** chiamato `.env` (nessuna estensione, solo `.env`)
3. **Aprilo** in un editor di testo

### 8.2 Aggiungere Variabili d'Ambiente

**Copia e incolla questo template**, poi sostituisci con i tuoi valori effettivi:

```env
# Configurazione Supabase (RICHIESTO)
VITE_SUPABASE_URL=https://IL_TUO_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=LA_TUA_ANON_KEY
VITE_SUPABASE_PROJECT_ID=IL_TUO_PROJECT_REF

# Google Analytics (OPZIONALE)
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking (OPZIONALE)
# VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Dove trovare questi valori:**
- `VITE_SUPABASE_URL`: Dashboard Supabase → Settings → API → Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Dashboard Supabase → Settings → API → anon/public key
- `VITE_SUPABASE_PROJECT_ID`: Dashboard Supabase → Settings → General → Reference ID

### 8.3 Salvare il File

1. **Salva** il file `.env`
2. **Assicurati** che sia nella root del progetto (stessa cartella di `package.json`)
3. **⚠️ IMPORTANTE:** Non committare mai `.env` su Git! Contiene segreti.

✅ **Le variabili d'ambiente sono ora configurate!**

---

## 9. PASSO 8: INSTALLARE DIPENDENZE DEL PROGETTO

### 9.1 Aprire Terminale nella Cartella del Progetto

1. **Naviga** alla cartella del progetto
2. **Apri terminale/prompt dei comandi** in quella cartella
   - Windows: Click destro cartella → "Apri in Terminale"
   - Mac/Linux: Click destro cartella → "Apri in Terminale"

### 9.2 Installare Dipendenze

**Esegui questo comando:**
```bash
npm install
```

**Attendi:** Questo può richiedere 2-5 minuti. Vedrai molti pacchetti essere scaricati.

**Output atteso:**
```
added 1234 packages, and audited 1235 packages in 2m
```

### 9.3 Verificare Installazione

**Esegui:**
```bash
npm run build
```

**Output atteso:**
```
✓ built in X.XXs
```

✅ **Le dipendenze sono installate!**

---

## 10. PASSO 9: ESEGUIRE IL PROGETTO LOCALMENTE

### 10.1 Avviare Server di Sviluppo

**Esegui:**
```bash
npm run dev
```

**Output atteso:**
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8085/
  ➜  Network: use --host to expose
```

### 10.2 Aprire nel Browser

1. **Apri il tuo browser web** (Chrome, Firefox, Safari, ecc.)
2. **Vai su:** `http://localhost:8085`
3. **Dovresti vedere** la homepage della tua applicazione!

### 10.3 Testare Funzionalità Base

1. **Naviga** attraverso le pagine:
   - Homepage (`/`)
   - Listings (`/listings`)
   - Form Valutazione (`/valutiamo`)
2. **Prova a registrare** un nuovo account:
   - Vai su `/auth`
   - Clicca "Sign up"
   - Inserisci email e password
   - Controlla la tua email per il link di verifica

✅ **Il progetto è in esecuzione localmente!**

---

## 11. PASSO 10: CREARE UTENTE ADMIN

### 11.1 Registrare un Account Utente

1. **Nella tua app in esecuzione:** Vai su `/auth`
2. **Registrati** con la tua email
3. **Verifica** la tua email (controlla la posta in arrivo)
4. **Accedi** al tuo account

### 11.2 Ottenere il Tuo User ID

1. **Nel Dashboard Supabase:** Vai su Authentication → Users
2. **Trova il tuo utente** (per email)
3. **Clicca** sul tuo utente
4. **Copia l'UUID** (sembra: `123e4567-e89b-12d3-a456-426614174000`)

### 11.3 Rendere l'Utente Admin

1. **Nel Dashboard Supabase:** Vai su SQL Editor
2. **Esegui questo SQL** (sostituisci `IL_TUO_USER_UUID` con il tuo UUID effettivo):

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('IL_TUO_USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

3. **Clicca:** "Run"
4. **Verifica:** Dovresti vedere "Success. No rows returned" o "INSERT 0 1"

### 11.4 Testare Accesso Admin

1. **Nella tua app:** Disconnettiti e riconnettiti
2. **Vai su:** `/admin`
3. **Dovresti vedere** il dashboard admin!

✅ **L'utente admin è creato!**

---

## 12. PASSO 11: DISTRIBUIRE IN PRODUZIONE (VERCEL)

### 12.1 Creare Account Vercel

1. **Vai su:** https://vercel.com/
2. **Registrati** con GitHub, GitLab o email
3. **Verifica** la tua email

### 12.2 Installare Vercel CLI

```bash
npm install -g vercel
```

### 12.3 Distribuire su Vercel

1. **Nel terminale**, naviga alla cartella del progetto
2. **Esegui:**
   ```bash
   vercel
   ```
3. **Segui i prompt:**
   - "Set up and deploy?": Sì
   - "Which scope?": Il tuo account
   - "Link to existing project?": No
   - "Project name?": (premi Invio per default)
   - "Directory?": (premi Invio per directory corrente)
   - "Override settings?": No
4. **Attendi** la distribuzione (2-5 minuti)

### 12.4 Impostare Variabili d'Ambiente in Vercel

1. **Vai su:** Dashboard Vercel → Il Tuo Progetto → Settings → Environment Variables
2. **Aggiungi ogni variabile:**
   - `VITE_SUPABASE_URL` = `https://IL_TUO_PROJECT_REF.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `LA_TUA_ANON_KEY`
   - `VITE_SUPABASE_PROJECT_ID` = `IL_TUO_PROJECT_REF`
3. **Per ogni variabile:**
   - Seleziona "Production", "Preview" e "Development"
   - Clicca "Save"
4. **Ridistribuisci:** Vai su Deployments → Clicca "..." → "Redeploy"

### 12.5 Aggiornare URL di Autenticazione Supabase

1. **Nel Dashboard Supabase:** Authentication → URL Configuration
2. **Aggiorna Site URL** al tuo URL Vercel: `https://il-tuo-progetto.vercel.app`
3. **Aggiungi Redirect URL:** `https://il-tuo-progetto.vercel.app/**`
4. **Aggiorna ALLOWED_ORIGINS** nei segreti delle Edge Functions:
   ```
   https://il-tuo-progetto.vercel.app,https://tuodominio.com
   ```

### 12.6 Testare Distribuzione Produzione

1. **Visita** il tuo URL Vercel
2. **Testa** tutte le funzionalità:
   - Homepage carica
   - Registrazione utente funziona
   - Login funziona
   - Dashboard admin accessibile (se sei admin)

✅ **Il progetto è distribuito in produzione!**

---

## 13. RISOLUZIONE PROBLEMI

### Problema: Errore "Cannot find module"

**Soluzione:**
```bash
# Elimina node_modules e reinstalla
rm -rf node_modules package-lock.json
npm install
```

### Problema: Errore "Missing environment variables"

**Soluzione:**
1. Verifica che il file `.env` esista nella root del progetto
2. Verifica che i nomi delle variabili inizino con `VITE_`
3. Riavvia il server di sviluppo dopo aver modificato `.env`

### Problema: "Failed to fetch" o errori CORS

**Soluzione:**
1. Controlla `ALLOWED_ORIGINS` nei segreti delle Edge Functions di Supabase
2. Assicurati che il tuo URL locale (`http://localhost:8085`) sia incluso
3. Ridistribuisci le edge functions dopo aver modificato i segreti

### Problema: Errore "RLS policy violation"

**Soluzione:**
1. Assicurati di aver eseguito la migrazione SQL completa
2. Verifica di essere loggato come utente
3. Verifica che la tabella user_roles abbia il tuo utente

### Problema: Edge functions non si distribuiscono

**Soluzione:**
1. Assicurati di essere loggato: `supabase login`
2. Assicurati che il progetto sia collegato: `supabase link --project-ref IL_TUO_REF`
3. Verifica di essere nella directory corretta (dove si trova la cartella `supabase`)

### Problema: Errore "Bucket not found"

**Soluzione:**
1. Crea il bucket `message-attachments` in Supabase Storage
2. Assicurati che sia PRIVATO (non pubblico)
3. Esegui lo SQL delle policy di storage dalla migrazione

---

## 🎉 CONGRATULAZIONI!

Hai configurato e distribuito con successo il progetto! 

**Prossimi passi:**
- Personalizza il design e il contenuto
- Aggiungi il tuo branding
- Configura i template email
- Imposta dominio personalizzato in Vercel

**Serve aiuto?** Controlla la sezione risoluzione problemi o rivedi i passaggi sopra.

---

**Ultimo Aggiornamento:** 29 Dicembre 2025  
**Versione:** 1.0.0
