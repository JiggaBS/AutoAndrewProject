# Google Analytics e SEO Setup

Questo documento descrive l'integrazione di Google Analytics e dei meta tag SEO dinamici nell'applicazione.

## Configurazione Google Analytics

### 1. Ottenere il Measurement ID

1. Vai su [Google Analytics](https://analytics.google.com/)
2. Crea una nuova proprietà o seleziona una esistente
3. Vai su **Admin** > **Data Streams** > Seleziona il tuo stream web
4. Copia il **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 2. Metodi di Configurazione

L'applicazione supporta **3 metodi** per configurare Google Analytics (in ordine di priorità):

#### Metodo 1: Variabile d'ambiente (Consigliato per produzione)

Crea un file `.env` nella root del progetto e aggiungi:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://tuodominio.com
```

**Nota**: Sostituisci `G-XXXXXXXXXX` con il tuo Measurement ID reale e `https://tuodominio.com` con l'URL del tuo sito.

#### Metodo 2: Edge Function `public-config` (Consigliato per configurazione dinamica)

L'applicazione può recuperare il Measurement ID dall'edge function `public-config` di Supabase. Questo permette di cambiare la configurazione senza ricompilare l'applicazione.

1. Vai su **Supabase Dashboard** → **Edge Functions** → **public-config**
2. Configura il secret `GA_MEASUREMENT_ID` nella funzione
3. La funzione restituirà automaticamente il valore al frontend

**Vantaggi**: Configurazione centralizzata, nessuna ricompilazione necessaria.

#### Metodo 3: localStorage (Fallback automatico)

Se configurato tramite edge function, il valore viene automaticamente salvato in `localStorage` per migliorare le performance nelle visite successive.

### 3. Per lo sviluppo locale

Per testare Google Analytics in locale, puoi:
- Usare un Measurement ID di test nel file `.env`
- Lasciare la variabile vuota (verrà mostrato solo un warning in console)
- Configurare tramite edge function `public-config`

## Funzionalità Google Analytics

L'applicazione traccia automaticamente:

- **Page Views**: Ogni cambio di pagina viene tracciato automaticamente
- **Vehicle Views**: Visualizzazioni dei dettagli veicolo
- **Search Events**: Ricerche e filtri applicati
- **Form Submissions**: Invio form di contatto e valutazione
- **WhatsApp Clicks**: Click sul pulsante WhatsApp
- **Save Vehicle**: Salvataggio/rimozione veicoli dai preferiti
- **Share Events**: Condivisione di veicoli

## Meta Tag SEO Dinamici

### Componente SEO

Il componente `SEO` è disponibile in `src/components/SEO.tsx` e può essere utilizzato in qualsiasi pagina:

```tsx
import { SEO } from "@/components/SEO";

<SEO
  title="Titolo della Pagina"
  description="Descrizione della pagina per i motori di ricerca"
  keywords="parola1, parola2, parola3"
  image="/path/to/image.jpg"
  url="/path/to/page"
  type="website" // o "product" per prodotti
/>
```

### Pagine con SEO già configurato

- **Homepage** (`/`): Meta tag ottimizzati per la homepage
- **Listings** (`/listings`): Meta tag dinamici basati sui filtri attivi
- **Vehicle Detail** (`/vehicle/:id`): Meta tag specifici per ogni veicolo con immagini e descrizioni
- **Valutiamo** (`/valutiamo`): Meta tag per la pagina di valutazione
- **Contatti** (`/contatti`): Meta tag per la pagina contatti
- **Blog** (`/blog`): Meta tag per il blog

### Meta Tag inclusi

Ogni pagina include automaticamente:

- **Primary Meta Tags**: title, description, keywords
- **Open Graph**: Per condivisione su Facebook, LinkedIn, ecc.
- **Twitter Cards**: Per condivisione su Twitter
- **Canonical URL**: Per evitare contenuti duplicati
- **Mobile Meta Tags**: Per ottimizzazione mobile

## Personalizzazione

### Modificare i meta tag di default

I meta tag di default sono definiti in `src/components/SEO.tsx`:

```tsx
const defaultTitle = "AutoMarket - Trova la tua Auto Perfetta";
const defaultDescription = "Vendita di auto usate selezionate e garantite...";
const defaultImage = "/placeholder.svg";
const siteUrl = import.meta.env.VITE_SITE_URL || "https://automarket.it";
```

### Aggiungere tracking personalizzato

Puoi aggiungere eventi personalizzati usando le funzioni in `src/lib/analytics.ts`:

```tsx
import { trackEvent } from "@/lib/analytics";

trackEvent("custom_action", "custom_category", "custom_label", value);
```

## Verifica

### Google Analytics

1. Vai su Google Analytics > **Reports** > **Realtime**
2. Naviga sul tuo sito
3. Dovresti vedere le visite in tempo reale

### SEO Meta Tags

1. Apri una pagina del sito
2. Fai click destro > **Visualizza sorgente pagina**
3. Cerca i tag `<meta>` nell'`<head>`
4. Oppure usa strumenti come:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Google Rich Results Test](https://search.google.com/test/rich-results)

## Note Importanti

- **Privacy**: Assicurati di rispettare le normative sulla privacy (GDPR) e aggiungere un banner di consenso se necessario
- **Performance**: Google Analytics viene caricato in modo asincrono per non impattare le performance
- **Development**: In sviluppo, se `VITE_GA_MEASUREMENT_ID` non è impostato, verrà mostrato solo un warning in console

## Troubleshooting

### Google Analytics non funziona

1. **Verifica la configurazione** (controlla nell'ordine):
   - Variabile `VITE_GA_MEASUREMENT_ID` nel file `.env`
   - Edge function `public-config` configurata correttamente
   - `localStorage.getItem("ga_measurement_id")` nel browser
2. **Riavvia il server** di sviluppo dopo aver modificato il file `.env`
3. **Controlla la console** del browser per eventuali errori o warning
4. **Verifica il Measurement ID** su Google Analytics (formato: `G-XXXXXXXXXX`)
5. **Controlla la rete**: Verifica che le richieste a `googletagmanager.com` non siano bloccate
6. **Testa l'edge function**: Chiama manualmente `/functions/v1/public-config` per verificare la risposta

### Meta tag non aggiornati

1. Assicurati che il componente `SEO` sia incluso nella pagina
2. Verifica che `HelmetProvider` sia presente in `App.tsx`
3. Controlla che i props passati a `SEO` siano corretti
4. Pulisci la cache del browser e ricarica la pagina

