# Google Analytics e SEO Setup

Questo documento descrive l'integrazione di Google Analytics e dei meta tag SEO dinamici nell'applicazione.

## Configurazione Google Analytics

### 1. Ottenere il Measurement ID

1. Vai su [Google Analytics](https://analytics.google.com/)
2. Crea una nuova proprietà o seleziona una esistente
3. Vai su **Admin** > **Data Streams** > Seleziona il tuo stream web
4. Copia il **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 2. Configurare la variabile d'ambiente

Crea un file `.env` nella root del progetto e aggiungi:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://tuodominio.com
```

**Nota**: Sostituisci `G-XXXXXXXXXX` con il tuo Measurement ID reale e `https://tuodominio.com` con l'URL del tuo sito.

### 3. Per lo sviluppo locale

Per testare Google Analytics in locale, puoi usare un Measurement ID di test o lasciare la variabile vuota (verrà mostrato solo un warning in console).

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

1. Verifica che `VITE_GA_MEASUREMENT_ID` sia impostato correttamente nel file `.env`
2. Riavvia il server di sviluppo dopo aver modificato il file `.env`
3. Controlla la console del browser per eventuali errori
4. Verifica che il Measurement ID sia corretto su Google Analytics

### Meta tag non aggiornati

1. Assicurati che il componente `SEO` sia incluso nella pagina
2. Verifica che `HelmetProvider` sia presente in `App.tsx`
3. Controlla che i props passati a `SEO` siano corretti
4. Pulisci la cache del browser e ricarica la pagina

