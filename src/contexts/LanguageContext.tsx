import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "it" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateFuelType: (fuelType: string | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = "preferred_language";

// Translations
const translations: Record<Language, Record<string, string>> = {
  it: {
    // Navigation
    "nav.home": "Home",
    "nav.listings": "Annunci",
    "nav.valutiamo": "Valutiamo",
    "nav.contact": "Contatti",
    "nav.blog": "Blog",
    "nav.faq": "FAQ",
    "nav.login": "Accedi",
    "nav.dashboard": "Area Clienti",
    "nav.admin": "Admin",
    "nav.logout": "Esci",

    // Hero Section
    "hero.title": "Trova la Tua Auto Perfetta",
    "hero.subtitle":
      "Scopri la nostra selezione di veicoli usati garantiti e certificati. Qualità, trasparenza e convenienza.",
    "hero.cta.browse": "Sfoglia Annunci",
    "hero.cta.valuation": "Valuta il Tuo Usato",

    // Services Section
    "services.title": "I Nostri Servizi",
    "services.subtitle": "Tutto ciò di cui hai bisogno per il tuo prossimo veicolo",
    "services.selection.title": "Selezione Garantita",
    "services.selection.desc": "Ogni veicolo è accuratamente ispezionato e certificato prima della vendita.",
    "services.financing.title": "Finanziamenti Su Misura",
    "services.financing.desc": "Soluzioni di pagamento personalizzate con le migliori condizioni del mercato.",
    "services.tradein.title": "Ritiro Usato",
    "services.tradein.desc": "Valutiamo e ritiriamo il tuo veicolo attuale al miglior prezzo.",
    "services.warranty.title": "Garanzia Estesa",
    "services.warranty.desc": "Protezione completa fino a 36 mesi per la tua tranquillità.",

    // Latest Arrivals
    "arrivals.badge": "Novità",
    "arrivals.title": "Ultimi Arrivi",
    "arrivals.subtitle": "Scopri i veicoli appena aggiunti al nostro inventario",
    "arrivals.viewAll": "Vedi Tutti gli Annunci",
    "arrivals.loading": "Caricamento veicoli...",
    "arrivals.error": "Impossibile caricare i veicoli",

    // Testimonials
    "testimonials.title": "Cosa Dicono i Nostri Clienti",
    "testimonials.subtitle": "La soddisfazione dei nostri clienti è la nostra priorità",

    // Trust Section
    "trust.title": "Perché Scegliere Noi",
    "trust.years": "Anni di Esperienza",
    "trust.vehicles": "Veicoli Venduti",
    "trust.clients": "Clienti Soddisfatti",
    "trust.warranty": "Mesi di Garanzia",

    // CTA Section
    "cta.title": "Pronto a Trovare la Tua Auto?",
    "cta.subtitle": "Contattaci oggi stesso per una consulenza gratuita e senza impegno.",
    "cta.button": "Contattaci Ora",

    // Footer
    "footer.description": "Il tuo concessionario di fiducia per auto usate selezionate e garantite.",
    "footer.newsletter": "Iscriviti alla newsletter",
    "footer.newsletter.placeholder": "Email",
    "footer.newsletter.button": "Iscriviti",
    "footer.menu": "Menu",
    "footer.info": "Informazioni",
    "footer.contacts": "Contatti",
    "footer.rights": "Tutti i diritti riservati.",
    "footer.terms": "Termini e Condizioni",
    "footer.privacy": "Privacy Policy",
    "footer.cookies": "Cookie Policy",
    "footer.about": "Chi Siamo",

    // Listings Page
    "listings.title": "I Nostri Veicoli",
    "listings.subtitle": "Sfoglia la nostra selezione di auto usate garantite",
    "listings.filters.brand": "Marca",
    "listings.filters.model": "Modello",
    "listings.filters.price": "Prezzo",
    "listings.filters.year": "Anno",
    "listings.filters.fuel": "Carburante",
    "listings.filters.km": "Chilometraggio",
    "listings.filters.reset": "Resetta Filtri",
    "listings.filters.apply": "Applica",
    "listings.sort.newest": "Più recenti",
    "listings.sort.price_asc": "Prezzo: dal più basso",
    "listings.sort.price_desc": "Prezzo: dal più alto",
    "listings.sort.mileage_asc": "Km: dal più basso",
    "listings.sort.mileage_desc": "Km: dal più alto",
    "listings.sort.year_desc": "Anno: dal più recente",
    "listings.sort.year_asc": "Anno: dal più vecchio",
    "listings.results": "veicoli trovati",
    "listings.noResults": "Nessun veicolo trovato",
    "listings.loading": "Caricamento...",

    // Vehicle Card
    "vehicle.km": "km",
    "vehicle.year": "Anno",
    "vehicle.fuel": "Carburante",
    "vehicle.details": "Dettagli",
    "vehicle.save": "Salva",
    "vehicle.saved": "Salvato",
    "vehicle.price": "Prezzo",

    // Fuel Types
    "fuel.petrol": "Benzina",
    "fuel.diesel": "Diesel",
    "fuel.hybrid": "Ibrido",
    "fuel.electric": "Elettrico",
    "fuel.lpg": "GPL",
    "fuel.methane": "Metano",
    "fuel.electric/diesel": "Ibrido Elettrico/Diesel",
    "fuel.electric/petrol": "Ibrido Elettrico/Benzina",
    "fuel.elettrica/diesel": "Ibrido Elettrico/Diesel",
    "fuel.elettrica/benzina": "Ibrido Elettrico/Benzina",

    // Valuation Page
    "valuation.title": "Richiedi una valutazione",
    "valuation.subtitle": "Ottieni una valutazione gratuita e senza impegno del tuo veicolo",
    "valuation.form.name": "Nome e Cognome",
    "valuation.form.email": "Email",
    "valuation.form.phone": "Telefono",
    "valuation.form.brand": "Marca",
    "valuation.form.model": "Modello",
    "valuation.form.year": "Anno",
    "valuation.form.km": "Chilometraggio",
    "valuation.form.fuel": "Tipo Carburante",
    "valuation.form.condition": "Condizioni",
    "valuation.form.condition.excellent": "Eccellente",
    "valuation.form.condition.good": "Buone",
    "valuation.form.condition.fair": "Discrete",
    "valuation.form.condition.poor": "Da Rivedere",
    "valuation.form.notes": "Note aggiuntive",
    "valuation.form.submit": "Richiedi Valutazione",
    "valuation.form.submitting": "Invio in corso...",
    "valuation.success": "Richiesta inviata con successo!",
    "valuation.error": "Errore nell'invio della richiesta",

    // Contact Page
    "contact.title": "Contattaci",
    "contact.subtitle": "Siamo qui per aiutarti. Contattaci per qualsiasi informazione.",
    "contact.form.name": "Nome",
    "contact.form.email": "Email",
    "contact.form.phone": "Telefono",
    "contact.form.message": "Messaggio",
    "contact.form.submit": "Invia Messaggio",
    "contact.info.title": "Informazioni di Contatto",
    "contact.info.address": "Indirizzo",
    "contact.info.phone": "Telefono",
    "contact.info.email": "Email",
    "contact.info.hours": "Orari",
    "contact.info.hours.weekdays": "Lun - Ven: 9:00 - 19:00",
    "contact.info.hours.saturday": "Sab: 9:00 - 13:00",
    "contact.info.hours.sunday": "Dom: Chiuso",

    // FAQ Page
    "faq.title": "Domande Frequenti",
    "faq.subtitle":
      "Trova le risposte alle domande più comuni. Se non trovi quello che cerchi, non esitare a contattarci.",
    "faq.notFound": "Non hai trovato la risposta che cercavi?",
    "faq.notFound.subtitle": "Il nostro team è pronto ad aiutarti.",
    "faq.contact": "Contattaci",
    "faq.category.purchase": "Acquisto Veicoli",
    "faq.category.valuation": "Valutazione e Permuta",
    "faq.category.delivery": "Consegna e Pagamento",
    "faq.category.support": "Assistenza Post-Vendita",
    "faq.category.general": "Informazioni Generali",
    // FAQ Questions - Purchase
    "faq.purchase.q1": "Come posso acquistare un veicolo?",
    "faq.purchase.a1":
      "Puoi visitare il nostro salone, contattarci telefonicamente o via email, oppure compilare il modulo di contatto sul nostro sito. Ti guideremo in ogni fase dell'acquisto, dalla scelta del veicolo al finanziamento.",
    "faq.purchase.q2": "I veicoli sono garantiti?",
    "faq.purchase.a2":
      "Sì, tutti i nostri veicoli usati sono coperti dalla garanzia legale di conformità di 12 mesi prevista dal Codice del Consumo. Offriamo anche estensioni di garanzia opzionali fino a 24 o 36 mesi.",
    "faq.purchase.q3": "Posso provare il veicolo prima dell'acquisto?",
    "faq.purchase.a3":
      "Assolutamente sì! Offriamo test drive gratuiti su appuntamento. Contattaci per prenotare la tua prova su strada.",
    "faq.purchase.q4": "Offrite finanziamenti?",
    "faq.purchase.a4":
      "Sì, collaboriamo con le principali finanziarie per offrirti soluzioni di pagamento personalizzate. Puoi finanziare fino al 100% del valore del veicolo con rate su misura per le tue esigenze.",
    "faq.purchase.q5": "Quali documenti servono per l'acquisto?",
    "faq.purchase.a5":
      "Per l'acquisto servono: documento d'identità valido, codice fiscale, e per il finanziamento anche le ultime buste paga o documentazione reddituale. Per le aziende: visura camerale e documenti del legale rappresentante.",
    // FAQ Questions - Valuation
    "faq.valuation.q1": "Come funziona la valutazione del mio usato?",
    "faq.valuation.a1":
      "Puoi richiedere una valutazione gratuita online compilando il modulo nella sezione 'Valutiamo'. Ti forniremo una stima iniziale e, dopo un'ispezione del veicolo, una valutazione definitiva.",
    "faq.valuation.q2": "Accettate permute?",
    "faq.valuation.a2":
      "Sì, ritiriamo il tuo usato in permuta. Il valore del tuo veicolo verrà scalato dal prezzo di acquisto del nuovo. La valutazione è gratuita e senza impegno.",
    "faq.valuation.q3": "Quanto tempo richiede la valutazione?",
    "faq.valuation.a3":
      "La valutazione online è immediata. Per la valutazione definitiva con ispezione, solitamente richiediamo 1-2 giorni lavorativi.",
    // FAQ Questions - Delivery
    "faq.delivery.q1": "Quali metodi di pagamento accettate?",
    "faq.delivery.a1":
      "Accettiamo bonifico bancario, assegno circolare, contanti (entro i limiti di legge), e finanziamenti. Per i pagamenti rateali, collaboriamo con diverse finanziarie.",
    "faq.delivery.q2": "Effettuate consegne a domicilio?",
    "faq.delivery.a2":
      "Sì, offriamo il servizio di consegna a domicilio in tutta Italia. I costi variano in base alla distanza. Contattaci per un preventivo.",
    "faq.delivery.q3": "Quanto tempo passa dall'acquisto alla consegna?",
    "faq.delivery.a3":
      "Per veicoli pronti in stock, la consegna avviene generalmente entro 3-5 giorni lavorativi dal completamento delle pratiche. Per veicoli da preparare, i tempi possono variare.",
    // FAQ Questions - Support
    "faq.support.q1": "Cosa copre la garanzia?",
    "faq.support.a1":
      "La garanzia legale copre i difetti di conformità esistenti al momento della consegna. Sono esclusi i danni causati da usura normale, uso improprio o mancata manutenzione.",
    "faq.support.q2": "Come posso segnalare un problema con il veicolo?",
    "faq.support.a2":
      "Puoi contattarci telefonicamente, via email o tramite il modulo di contatto. Il nostro team ti assisterà nella risoluzione del problema nel più breve tempo possibile.",
    "faq.support.q3": "Offrite servizi di manutenzione?",
    "faq.support.a3":
      "Collaboriamo con officine autorizzate per offrirti servizi di manutenzione ordinaria e straordinaria a prezzi convenzionati.",
    // FAQ Questions - General
    "faq.general.q1": "Quali sono gli orari di apertura?",
    "faq.general.a1":
      "Siamo aperti dal lunedì al venerdì dalle 9:00 alle 19:00, e il sabato dalle 9:00 alle 13:00. Domenica chiuso. Per appuntamenti fuori orario, contattaci.",
    "faq.general.q2": "Dove si trova il vostro salone?",
    "faq.general.a2":
      "Il nostro salone si trova in Via Roma 123, 00100 Roma (RM). Siamo facilmente raggiungibili con i mezzi pubblici e disponiamo di parcheggio gratuito per i clienti.",
    "faq.general.q3": "Come posso contattarvi?",
    "faq.general.a3":
      "Puoi contattarci telefonicamente al +39 333 388 9908, via email a gajanovsa@gmail.com, tramite WhatsApp, o compilando il modulo di contatto sul sito.",

    // Privacy Policy
    "privacy.title": "Informativa sulla Privacy",
    "privacy.seo.title": "Privacy Policy | AutoAndrew",
    "privacy.seo.description":
      "Informativa sulla privacy di AutoAndrew. Scopri come trattiamo i tuoi dati personali in conformità al GDPR.",
    "privacy.lastUpdate": "Ultimo aggiornamento:",
    "privacy.section1.title": "1. Titolare del Trattamento",
    "privacy.section1.content":
      "Il Titolare del trattamento dei dati personali è AutoAndrew, con sede in Via Roma 123, 00100 Roma (RM), Italia. Per qualsiasi informazione relativa al trattamento dei dati personali, è possibile contattarci all'indirizzo email: gajanovsa@gmail.com",
    "privacy.section2.title": "2. Tipologie di Dati Raccolti",
    "privacy.section2.intro": "I dati personali che raccogliamo includono:",
    "privacy.section2.item1": "Dati di contatto: nome, cognome, indirizzo email, numero di telefono",
    "privacy.section2.item2": "Dati relativi ai veicoli: informazioni sui veicoli che desideri valutare o acquistare",
    "privacy.section2.item3":
      "Dati di navigazione: indirizzo IP, tipo di browser, pagine visitate, tempo di permanenza",
    "privacy.section2.item4": "Dati di autenticazione: email e password per l'accesso all'area riservata",
    "privacy.section3.title": "3. Finalità del Trattamento",
    "privacy.section3.intro": "I tuoi dati personali sono trattati per le seguenti finalità:",
    "privacy.section3.item1": "Fornitura dei servizi richiesti (valutazione veicoli, richieste di contatto)",
    "privacy.section3.item2": "Gestione dell'account utente e accesso all'area riservata",
    "privacy.section3.item3": "Invio di comunicazioni relative ai servizi richiesti",
    "privacy.section3.item4": "Miglioramento dell'esperienza utente sul sito",
    "privacy.section3.item5": "Adempimento di obblighi legali e fiscali",
    "privacy.section3.item6": "Previo consenso, invio di newsletter e comunicazioni promozionali",
    "privacy.section4.title": "4. Base Giuridica del Trattamento",
    "privacy.section4.content":
      "Il trattamento dei dati personali si basa su: esecuzione di un contratto o misure precontrattuali (art. 6.1.b GDPR), adempimento di obblighi legali (art. 6.1.c GDPR), legittimo interesse del Titolare (art. 6.1.f GDPR), e consenso dell'interessato per finalità di marketing (art. 6.1.a GDPR).",
    "privacy.section5.title": "5. Conservazione dei Dati",
    "privacy.section5.content":
      "I dati personali sono conservati per il tempo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti, e comunque non oltre 10 anni dalla cessazione del rapporto contrattuale, salvo diversi obblighi di legge. I dati raccolti per finalità di marketing sono conservati fino alla revoca del consenso.",
    "privacy.section6.title": "6. Comunicazione e Diffusione dei Dati",
    "privacy.section6.content":
      "I dati personali potranno essere comunicati a: soggetti autorizzati al trattamento (dipendenti e collaboratori), fornitori di servizi tecnici (hosting, email), professionisti e consulenti, autorità competenti quando richiesto dalla legge. I dati non saranno diffusi a terzi non autorizzati.",
    "privacy.section7.title": "7. Trasferimento dei Dati Extra-UE",
    "privacy.section7.content":
      "Alcuni fornitori di servizi potrebbero trasferire dati al di fuori dell'Unione Europea. In tal caso, garantiamo che il trasferimento avvenga nel rispetto delle garanzie previste dal GDPR, come le Clausole Contrattuali Standard approvate dalla Commissione Europea.",
    "privacy.section8.title": "8. Diritti dell'Interessato",
    "privacy.section8.intro": "Ai sensi degli artt. 15-22 del GDPR, hai il diritto di:",
    "privacy.section8.item1": "Accedere ai tuoi dati personali",
    "privacy.section8.item2": "Ottenere la rettifica o la cancellazione dei dati",
    "privacy.section8.item3": "Limitare il trattamento",
    "privacy.section8.item4": "Opporti al trattamento",
    "privacy.section8.item5": "Richiedere la portabilità dei dati",
    "privacy.section8.item6": "Revocare il consenso in qualsiasi momento",
    "privacy.section8.item7": "Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali",
    "privacy.section8.contact": "Per esercitare i tuoi diritti, contattaci all'indirizzo: gajanovsa@gmail.com",
    "privacy.section9.title": "9. Sicurezza dei Dati",
    "privacy.section9.content":
      "Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, perdita, distruzione o alterazione. I dati sono conservati su server sicuri e l'accesso è limitato al personale autorizzato.",
    "privacy.section10.title": "10. Modifiche all'Informativa",
    "privacy.section10.content":
      "Ci riserviamo il diritto di modificare questa informativa in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento. Ti invitiamo a consultare periodicamente questa pagina.",

    // Cookie Policy
    "cookie.title": "Cookie Policy",
    "cookie.seo.title": "Cookie Policy | AutoAndrew",
    "cookie.seo.description":
      "Cookie Policy di AutoAndrew. Scopri quali cookie utilizziamo e come puoi gestire le tue preferenze.",
    "cookie.lastUpdate": "Ultimo aggiornamento:",
    "cookie.section1.title": "1. Cosa sono i Cookie",
    "cookie.section1.content":
      "I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, tablet, smartphone) quando visiti un sito web. I cookie permettono al sito di riconoscerti e ricordare le tue preferenze, migliorando la tua esperienza di navigazione.",
    "cookie.section2.title": "2. Tipologie di Cookie Utilizzati",
    "cookie.section2.technical.title": "2.1 Cookie Tecnici (Necessari)",
    "cookie.section2.technical.desc":
      "Questi cookie sono essenziali per il corretto funzionamento del sito. Non possono essere disattivati.",
    "cookie.section2.analytics.title": "2.2 Cookie Analitici",
    "cookie.section2.analytics.desc":
      "Utilizziamo Google Analytics per comprendere come gli utenti interagiscono con il sito. Questi cookie raccolgono informazioni in forma anonima.",
    "cookie.section2.marketing.title": "2.3 Cookie di Marketing",
    "cookie.section2.marketing.desc":
      "Questi cookie sono utilizzati per tracciare i visitatori sui siti web e mostrare annunci pertinenti. Vengono attivati solo con il tuo consenso esplicito.",
    "cookie.table.name": "Nome",
    "cookie.table.purpose": "Scopo",
    "cookie.table.duration": "Durata",
    "cookie.table.consent.purpose": "Memorizza le preferenze cookie",
    "cookie.table.consent.duration": "1 anno",
    "cookie.table.auth.purpose": "Autenticazione utente",
    "cookie.table.auth.duration": "Sessione",
    "cookie.table.ga.purpose": "Distingue gli utenti",
    "cookie.table.ga.duration": "2 anni",
    "cookie.table.gax.purpose": "Mantiene lo stato della sessione",
    "cookie.table.gax.duration": "2 anni",
    "cookie.table.gid.purpose": "Distingue gli utenti",
    "cookie.table.gid.duration": "24 ore",
    "cookie.section3.title": "3. Come Gestire i Cookie",
    "cookie.section3.intro": "Puoi gestire le tue preferenze sui cookie in diversi modi:",
    "cookie.section3.banner.title": "Banner cookie:",
    "cookie.section3.banner.desc":
      "Al primo accesso al sito, puoi scegliere quali categorie di cookie accettare tramite il nostro banner.",
    "cookie.section3.browser.title": "Impostazioni del browser:",
    "cookie.section3.browser.desc":
      "Puoi configurare il tuo browser per bloccare o eliminare i cookie. Ecco le guide per i principali browser:",
    "cookie.section3.optout.title": "Opt-out Google Analytics:",
    "cookie.section3.optout.desc": "Puoi installare il",
    "cookie.section3.optout.link": "componente aggiuntivo del browser per la disattivazione di Google Analytics",
    "cookie.section4.title": "4. Cookie di Terze Parti",
    "cookie.section4.content":
      "Alcuni cookie sono impostati da servizi di terze parti che appaiono sulle nostre pagine. Non abbiamo controllo su questi cookie. Per maggiori informazioni, consulta le informative sulla privacy dei rispettivi servizi:",
    "cookie.section5.title": "5. Base Giuridica",
    "cookie.section5.content":
      "Il trattamento dei dati tramite cookie tecnici è basato sul legittimo interesse del Titolare. Per i cookie analitici e di marketing, la base giuridica è il consenso dell'utente, revocabile in qualsiasi momento.",
    "cookie.section6.title": "6. Aggiornamenti",
    "cookie.section6.content":
      "Questa Cookie Policy può essere aggiornata periodicamente. Ti invitiamo a consultare regolarmente questa pagina per essere informato su eventuali modifiche.",
    "cookie.section7.title": "7. Contatti",
    "cookie.section7.content":
      "Per qualsiasi domanda relativa a questa Cookie Policy o al trattamento dei tuoi dati, puoi contattarci all'indirizzo email: gajanovsa@gmail.com",
    "cookie.section7.moreInfo": "Per maggiori informazioni sul trattamento dei dati personali, consulta la nostra",

    // Auth Page
    "auth.title": "Accedi",
    "auth.subtitle": "Accedi al tuo account o registrati per salvare i tuoi veicoli preferiti",
    "auth.login.tab": "Accedi",
    "auth.signup.tab": "Registrati",
    "auth.login.title": "Accedi",
    "auth.login.subtitle": "Inserisci le tue credenziali per accedere",
    "auth.signup.title": "Registrati",
    "auth.signup.subtitle": "Crea un nuovo account",
    "auth.email": "Email",
    "auth.email.placeholder": "email@esempio.com",
    "auth.password": "Password",
    "auth.password.placeholder": "Minimo 6 caratteri",
    "auth.login.button": "Accedi",
    "auth.signup.button": "Registrati",
    "auth.login.switch": "Non hai un account?",
    "auth.signup.switch": "Hai già un account?",
    "auth.forgot": "Password dimenticata?",
    "auth.name": "Nome",
    "auth.name.placeholder": "Nome",
    "auth.surname": "Cognome",
    "auth.surname.placeholder": "Cognome",
    "auth.phone": "Numero di telefono",
    "auth.phone.placeholder": "Numero di telefono",
    "auth.or": "OPPURE",
    "auth.google": "Continua con Google",
    "auth.footer": "Accedi per salvare i tuoi veicoli preferiti e gestire le richieste",
    "auth.forgot.title": "Recupera Password",
    "auth.forgot.subtitle": "Inserisci la tua email e ti invieremo un link per reimpostare la password",
    "auth.forgot.send": "Invia",
    "auth.forgot.back": "Indietro",
    "auth.reset.title": "Reimposta Password",
    "auth.reset.subtitle": "Inserisci la nuova password",
    "auth.reset.newPassword": "Nuova Password",
    "auth.reset.confirmPassword": "Conferma Password",
    "auth.reset.confirm.placeholder": "Conferma la password",
    "auth.reset.button": "Reimposta Password",
    "auth.reset.updating": "Aggiornamento...",
    // Auth Messages
    "auth.error": "Errore",
    "auth.error.invalidEmail": "Email non valida",
    "auth.error.passwordMin": "Password minimo 6 caratteri",
    "auth.error.nameMin": "Il nome deve contenere almeno 2 caratteri",
    "auth.error.surnameMin": "Il cognome deve contenere almeno 2 caratteri",
    "auth.error.phoneMin": "Il numero di telefono deve contenere almeno 10 caratteri",
    "auth.error.alreadyRegistered": "Email già registrata. Prova ad accedere.",
    "auth.error.invalidLogin": "Email o password non corretti",
    "auth.error.auth": "Errore di autenticazione",
    "auth.error.enterEmail": "Inserisci la tua email",
    "auth.error.sendReset": "Impossibile inviare l'email di reset",
    "auth.error.passwordMismatch": "Le password non corrispondono",
    "auth.error.updatePassword": "Impossibile aggiornare la password",
    "auth.error.google": "Impossibile accedere con Google",
    "auth.success.registered": "Registrazione completata",
    "auth.success.registeredDesc": "Controlla la tua email per confermare l'account.",
    "auth.success.emailSent": "Email inviata",
    "auth.success.emailSentDesc": "Controlla la tua casella email per il link di reset password",
    "auth.success": "Successo",
    "auth.success.passwordUpdated": "Password aggiornata con successo. Ora puoi accedere.",

    // Cookie Consent
    "cookies.title": "Questo sito utilizza i cookie 🍪",
    "cookies.description":
      "Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza di navigazione, analizzare il traffico del sito e personalizzare i contenuti. Puoi accettare tutti i cookie, solo quelli necessari, oppure personalizzare le tue preferenze.",
    "cookies.learnMore": "Per saperne di più, consulta la nostra",
    "cookies.and": "e la",
    "cookies.acceptAll": "Accetta Tutti",
    "cookies.acceptNecessary": "Solo Necessari",
    "cookies.customize": "Personalizza",
    "cookies.settings.title": "Impostazioni Cookie",
    "cookies.necessary.title": "Cookie Necessari",
    "cookies.necessary.desc": "Essenziali per il funzionamento del sito. Non possono essere disattivati.",
    "cookies.analytics.title": "Cookie Analitici",
    "cookies.analytics.desc": "Ci aiutano a capire come utilizzi il sito per migliorare l'esperienza.",
    "cookies.marketing.title": "Cookie di Marketing",
    "cookies.marketing.desc": "Utilizzati per mostrarti annunci pertinenti ai tuoi interessi.",
    "cookies.save": "Salva Preferenze",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Si è verificato un errore",
    "common.retry": "Riprova",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.close": "Chiudi",
    "common.search": "Cerca",
    "common.all": "Tutti",
    "common.from": "Da",
    "common.to": "A",

    // Search Filters
    "filters.title": "Trova veicoli usati e nuovi",
    "filters.brand": "Marca",
    "filters.model": "Modello",
    "filters.selectBrand": "Seleziona modello",
    "filters.yearFrom": "Anno da",
    "filters.priceFrom": "Prezzo da",
    "filters.priceTo": "Prezzo a",
    "filters.powerFrom": "Potenza da",
    "filters.power": "Potenza",
    "filters.powerTo": "Potenza a",
    "filters.engineFrom": "Cilindrata da",
    "filters.engineTo": "Cilindrata a",
    "filters.maxKm": "Km max",
    "filters.color": "Colore",
    "filters.fuel": "Carburante",
    "filters.gearbox": "Cambio",
    "filters.condition": "Condizione",
    "filters.euroClass": "Classe Euro",
    "filters.doors": "N° Porte",
    "filters.bodyType": "Tipo di carrozeria",
    "filters.results": "risultati",
    "filters.advancedSearch": "RICERCA AVANZATA",
    "filters.closeAdvanced": "CHIUDI RICERCA AVANZATA",
    "filters.removeFilter": "Rimuovi filtro",
    "filters.searchByBody": "Cerca per carrozzeria",
    "filters.any": "Qualsiasi",
    "filters.upTo": "Fino a",
    "filters.from": "Da",
    "filters.doors2": "2 porte",
    "filters.doors3": "3 porte",
    "filters.doors4": "4 porte",
    "filters.doors5": "5 porte",

    // Body Types
    "body.cityCar": "City car",
    "body.suv": "SUV & Pick-up",
    "body.van": "Furgoni & Van",
    "body.cabrio": "Cabrio",
    "body.monovolume": "Monovolume",
    "body.berlina": "Berlina",
    "body.stationWagon": "Station Wagon",
    "body.coupe": "Coupé",

    // Trust Section
    "trust.mainTitle": "Perché Sceglierci",
    "trust.badge": "I Nostri Vantaggi",
    "trust.warranty.title": "Garanzia 12 Mesi",
    "trust.warranty.desc": "Tutti i veicoli sono coperti da garanzia",
    "trust.certified.title": "Auto Certificate",
    "trust.certified.desc": "Controlli qualità su ogni veicolo",
    "trust.delivery.title": "Consegna Rapida",
    "trust.delivery.desc": "Ritiro o consegna in 48 ore",
    "trust.satisfaction.title": "Soddisfatti o Rimborsati",
    "trust.satisfaction.desc": "14 giorni per cambiare idea",
    "trust.stat.vehicles": "Veicoli Venduti",
    "trust.stat.experience": "Anni Esperienza",
    "trust.stat.satisfaction": "Clienti Soddisfatti",
    "trust.stat.support": "Assistenza",

    // Testimonials Section
    "testimonials.badge": "Le Opinioni",
    "testimonials.mainTitle": "Cosa dicono i nostri clienti",
    "testimonials.basedOn": "su 5 basato su",
    "testimonials.reviews": "recensioni",
    "testimonials.purchase": "Acquisto:",
    "testimonials.verified": "Recensioni Verificate",
    "testimonials.guarantee": "Garanzia Soddisfatti",
    "testimonials.satisfiedClients": "98% Clienti Soddisfatti",

    // Valuation Page Extended
    "valuation.badge": "Valutazione Gratuita",
    "valuation.vehicleInfo": "Informazioni Veicolo",
    "valuation.vehicleInfo.desc": "Inserisci i dati del tuo veicolo per ottenere una stima",
    "valuation.brand": "Marca",
    "valuation.selectBrand": "Seleziona modello",
    "valuation.modelLabel": "Modello",
    "valuation.modelPlaceholder": "Es. Golf, Serie 3...",
    "valuation.registrationYear": "Anno Immatricolazione",
    "valuation.selectYear": "Seleziona anno",
    "valuation.fuelType": "Carburante",
    "valuation.selectFuel": "Seleziona carburante",
    "valuation.mileage": "Chilometraggio (km)",
    "valuation.mileagePlaceholder": "Es. 85000",
    "valuation.conditionLabel": "Condizioni",
    "valuation.selectCondition": "Seleziona condizioni",
    "valuation.condition.excellent": "Ottime condizioni",
    "valuation.condition.good": "Buone condizioni",
    "valuation.condition.fair": "Condizioni discrete",
    "valuation.condition.poor": "Da revisionare",
    "valuation.bodyType": "Carrozzeria",
    "valuation.selectBodyType": "Seleziona tipo carrozzeria",
    "valuation.desiredPrice": "Prezzo Desiderato",
    "valuation.pricePlaceholder": "Es. 15000",
    "valuation.photos": "Foto del Veicolo",
    "valuation.photos.desc": "Carica fino a 10 foto per una valutazione più accurata",
    "valuation.photos.dragDrop": "Clicca o trascina le foto qui",
    "valuation.photos.format": "JPG, PNG, WebP (max 5MB per foto)",
    "valuation.photos.limitReached": "Limite foto raggiunto",
    "valuation.photos.maxPhotos": "Puoi caricare massimo 10 foto",
    "valuation.photos.fileTooLarge": "File troppo grande",
    "valuation.photos.maxSize": "Ogni foto deve essere massimo 5MB",
    "valuation.yourData": "I Tuoi Dati",
    "valuation.yourData.desc": "Come possiamo contattarti per la valutazione definitiva",
    "valuation.fullName": "Nome e Cognome",
    "valuation.phone": "Telefono",
    "valuation.phonePlaceholder": "Numero di telefono",
    "valuation.emailLabel": "Email",
    "valuation.emailPlaceholder": "Indirizzo email",
    "valuation.notesLabel": "Note aggiuntive (opzionale)",
    "valuation.notesPlaceholder": "Descrivi eventuali optional, tagliandi, stato pneumatici...",
    "valuation.submitting": "Invio in corso...",
    "valuation.submitButton": "Richiedi Valutazione Gratuita",
    "valuation.instantEstimate": "Stima Istantanea",
    "valuation.instantEstimate.desc": "Valutazione indicativa basata sui dati inseriti",
    "valuation.estimatedValue": "Valore stimato",
    "valuation.estimateDisclaimer": "* Stima indicativa. Il valore finale dipenderà dalla valutazione in sede.",
    "valuation.fillData": "Compila i dati del veicolo per vedere la stima istantanea",
    "valuation.whyChooseUs": "Perché Sceglierci",
    "valuation.benefit1": "Valutazione gratuita e senza impegno",
    "valuation.benefit2": "Risposta garantita entro 24 ore",
    "valuation.benefit3": "Pagamento immediato",
    "valuation.benefit4": "Ritiro a domicilio disponibile",
    "valuation.benefit5": "Massima trasparenza e serietà",
    "valuation.successTitle": "Richiesta inviata!",
    "valuation.successDesc": "Ti contatteremo entro 24 ore con la valutazione definitiva.",
    "valuation.errorTitle": "Errore",
    "valuation.errorDesc": "Si è verificato un errore. Riprova.",

    // Dashboard
    "dashboard.welcome": "Benvenuto nella tua area",
    "dashboard.logout": "Esci",
    "dashboard.savedVehicles": "Veicoli Salvati",
    "dashboard.requestsSent": "Richieste Inviate",
    "dashboard.offersReceived": "Offerte Ricevute",
    "dashboard.favorites": "Preferiti",
    "dashboard.valuations": "Valutazioni",
    "dashboard.noSavedVehicles": "Nessun veicolo salvato",
    "dashboard.noSavedVehiclesDesc": "Salva i veicoli che ti interessano per rivederli facilmente in seguito",
    "dashboard.exploreVehicles": "Esplora Veicoli",
    "dashboard.noRequests": "Nessuna richiesta",
    "dashboard.noRequestsDesc": "Vuoi vendere la tua auto? Invia una richiesta di valutazione gratuita",
    "dashboard.requestValuation": "Richiedi Valutazione",
    "dashboard.year": "Anno",
    "dashboard.km": "Km",
    "dashboard.fuel": "Carburante",
    "dashboard.condition": "Condizione",
    "dashboard.requestedPrice": "Prezzo richiesto",
    "dashboard.requestDate": "Richiesta",
    "dashboard.yourNotes": "Le tue note",
    "dashboard.finalOffer": "Offerta finale",
    "dashboard.offerAvailable": "Offerta disponibile",
    "dashboard.appointment": "Appuntamento",
    "dashboard.processing": "In elaborazione",
    "dashboard.contactSoon": "Ti contatteremo presto",
    "dashboard.note": "Nota",
    "dashboard.idCopied": "ID copiato",
    "dashboard.idCopiedDesc": "L'ID è stato copiato negli appunti",
    "dashboard.clickToCopy": "Clicca per copiare",
    "dashboard.caseId": "ID Pratica",
    "dashboard.removed": "Rimosso",
    "dashboard.vehicleRemoved": "Veicolo rimosso dai preferiti",
    "dashboard.logoutSuccess": "Logout effettuato",
    "dashboard.logoutSuccessDesc": "Sei stato disconnesso con successo",
    "dashboard.errorLoadRequests": "Impossibile caricare le richieste di valutazione",
    "dashboard.errorLoadSaved": "Impossibile caricare i veicoli salvati",
    "dashboard.errorRemove": "Impossibile rimuovere il veicolo",
    "dashboard.errorLogout": "Impossibile effettuare il logout",
    "dashboard.status.pending": "In attesa",
    "dashboard.status.contacted": "Contattato",
    "dashboard.status.completed": "Completato",
    "dashboard.status.rejected": "Rifiutato",
    "dashboard.condition.excellent": "Ottime",
    "dashboard.condition.good": "Buone",
    "dashboard.condition.fair": "Discrete",
    "dashboard.condition.poor": "Da revisionare",

    // Vehicle Detail
    "vehicleDetail.back": "Indietro",
    "vehicleDetail.save": "Salva",
    "vehicleDetail.saved": "Salvato",
    "vehicleDetail.share": "Condividi",
    "vehicleDetail.print": "Stampa",
    "vehicleDetail.greatPrice": "Ottimo prezzo",
    "vehicleDetail.loading": "Caricamento dettagli...",
    "vehicleDetail.notFound": "Veicolo non trovato",
    "vehicleDetail.backToSearch": "Torna alla ricerca",
    "vehicleDetail.shared": "Condiviso!",
    "vehicleDetail.sharedDesc": "Il link è stato condiviso con successo.",
    "vehicleDetail.linkCopied": "Link copiato!",
    "vehicleDetail.linkCopiedDesc": "Il link è stato copiato negli appunti. Puoi condividerlo con chi vuoi.",
    "vehicleDetail.linkCopiedShort": "Il link è stato copiato negli appunti.",
    "vehicleDetail.shareError": "Impossibile condividere il link. Prova a copiare manualmente l'URL.",
    "vehicleDetail.description": "Descrizione",
    "vehicleDetail.interestedMsg": "Ciao! Sono interessato a",

    // Vehicle Specs
    "specs.mileage": "Chilometraggio",
    "specs.transmission": "Tipo di cambio",
    "specs.gearbox": "Cambio",
    "specs.driveType": "Trazione",
    "specs.year": "Anno",
    "specs.fuel": "Carburante",
    "specs.power": "Potenza",
    "specs.seller": "Venditore",
    "specs.dealer": "Rivenditore",
    "specs.additionalDetails": "Dettagli aggiuntivi",
    "specs.emissionClass": "Classe emissioni",
    "specs.combinedConsumption": "Consumo combinato",
    "specs.warranty": "Garanzia",
    "specs.months": "mesi",
    "specs.numSeats": "Numero posti",
    "specs.ownersCount": "Proprietari precedenti",
    "specs.doorsCount": "Numero porte",
    "specs.weight": "Peso",
    "specs.kg": "kg",

    // Dealer Card
    "dealer.googleReviews": "Recensioni Google",
    "dealer.contactSeller": "Contatta venditore",
    "dealer.showNumber": "Mostra numero",

    // Financing Calculator
    "financing.calculate": "Calcola rata",
    "financing.title": "Calcola il tuo finanziamento",
    "financing.vehiclePrice": "Prezzo veicolo",
    "financing.downPayment": "Anticipo",
    "financing.duration": "Durata",
    "financing.months": "mesi",
    "financing.rate": "Tasso (TAN)",
    "financing.monthlyPayment": "Rata mensile",
    "financing.totalFinanced": "Totale finanziato",
    "financing.totalInterest": "Interessi totali",
    "financing.disclaimer": "*Calcolo indicativo. Condizioni definitive soggette ad approvazione.",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.listings": "Listings",
    "nav.valutiamo": "Sell Your Car",
    "nav.contact": "Contact",
    "nav.blog": "Blog",
    "nav.faq": "FAQ",
    "nav.login": "Login",
    "nav.dashboard": "Client Area",
    "nav.admin": "Admin",
    "nav.logout": "Logout",

    // Hero Section
    "hero.title": "Find Your Perfect Car",
    "hero.subtitle":
      "Discover our selection of certified and guaranteed used vehicles. Quality, transparency, and value.",
    "hero.cta.browse": "Browse Listings",
    "hero.cta.valuation": "Get Your Car Valued",

    // Services Section
    "services.title": "Our Services",
    "services.subtitle": "Everything you need for your next vehicle",
    "services.selection.title": "Guaranteed Selection",
    "services.selection.desc": "Every vehicle is carefully inspected and certified before sale.",
    "services.financing.title": "Custom Financing",
    "services.financing.desc": "Personalized payment solutions with the best market conditions.",
    "services.tradein.title": "Trade-In",
    "services.tradein.desc": "We evaluate and buy your current vehicle at the best price.",
    "services.warranty.title": "Extended Warranty",
    "services.warranty.desc": "Complete protection up to 36 months for your peace of mind.",

    // Latest Arrivals
    "arrivals.badge": "New In",
    "arrivals.title": "Latest Arrivals",
    "arrivals.subtitle": "Discover vehicles just added to our inventory",
    "arrivals.viewAll": "View All Listings",
    "arrivals.loading": "Loading vehicles...",
    "arrivals.error": "Unable to load vehicles",

    // Testimonials
    "testimonials.title": "What Our Customers Say",
    "testimonials.subtitle": "Customer satisfaction is our priority",

    // Trust Section
    "trust.title": "Why Choose Us",
    "trust.years": "Years of Experience",
    "trust.vehicles": "Vehicles Sold",
    "trust.clients": "Satisfied Customers",
    "trust.warranty": "Months Warranty",

    // CTA Section
    "cta.title": "Ready to Find Your Car?",
    "cta.subtitle": "Contact us today for a free, no-obligation consultation.",
    "cta.button": "Contact Us Now",

    // Footer
    "footer.description": "Your trusted dealership for selected and guaranteed used cars.",
    "footer.newsletter": "Subscribe to newsletter",
    "footer.newsletter.placeholder": "Email",
    "footer.newsletter.button": "Subscribe",
    "footer.menu": "Menu",
    "footer.info": "Information",
    "footer.contacts": "Contacts",
    "footer.rights": "All rights reserved.",
    "footer.terms": "Terms & Conditions",
    "footer.privacy": "Privacy Policy",
    "footer.cookies": "Cookie Policy",
    "footer.about": "About Us",

    // Listings Page
    "listings.title": "Our Vehicles",
    "listings.subtitle": "Browse our selection of guaranteed used cars",
    "listings.filters.brand": "Brand",
    "listings.filters.model": "Model",
    "listings.filters.price": "Price",
    "listings.filters.year": "Year",
    "listings.filters.fuel": "Fuel",
    "listings.filters.km": "Mileage",
    "listings.filters.reset": "Reset Filters",
    "listings.filters.apply": "Apply",
    "listings.sort.newest": "Newest",
    "listings.sort.price_asc": "Price: Low to High",
    "listings.sort.price_desc": "Price: High to Low",
    "listings.sort.mileage_asc": "Mileage: Low to High",
    "listings.sort.mileage_desc": "Mileage: High to Low",
    "listings.sort.year_desc": "Year: Newest First",
    "listings.sort.year_asc": "Year: Oldest First",
    "listings.results": "vehicles found",
    "listings.noResults": "No vehicles found",
    "listings.loading": "Loading...",

    // Vehicle Card
    "vehicle.km": "km",
    "vehicle.year": "Year",
    "vehicle.fuel": "Fuel",
    "vehicle.details": "Details",
    "vehicle.save": "Save",
    "vehicle.saved": "Saved",
    "vehicle.price": "Price",

    // Fuel Types
    "fuel.petrol": "Petrol",
    "fuel.diesel": "Diesel",
    "fuel.hybrid": "Hybrid",
    "fuel.electric": "Electric",
    "fuel.lpg": "LPG",
    "fuel.methane": "CNG",
    "fuel.electric/diesel": "Diesel Hybrid",
    "fuel.electric/petrol": "Petrol Hybrid",
    "fuel.elettrica/diesel": "Diesel Hybrid",
    "fuel.elettrica/benzina": "Petrol Hybrid",

    // Valuation Page
    "valuation.title": "Get Your Car Valued",
    "valuation.subtitle": "Get a free, no-obligation valuation of your vehicle",
    "valuation.form.name": "Full Name",
    "valuation.form.email": "Email",
    "valuation.form.phone": "Phone",
    "valuation.form.brand": "Brand",
    "valuation.form.model": "Model",
    "valuation.form.year": "Year",
    "valuation.form.km": "Mileage",
    "valuation.form.fuel": "Fuel Type",
    "valuation.form.condition": "Condition",
    "valuation.form.condition.excellent": "Excellent",
    "valuation.form.condition.good": "Good",
    "valuation.form.condition.fair": "Fair",
    "valuation.form.condition.poor": "Needs Work",
    "valuation.form.notes": "Additional notes",
    "valuation.form.submit": "Request Valuation",
    "valuation.form.submitting": "Submitting...",
    "valuation.success": "Request submitted successfully!",
    "valuation.error": "Error submitting request",

    // Contact Page
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to help. Contact us for any information.",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.info.title": "Contact Information",
    "contact.info.address": "Address",
    "contact.info.phone": "Phone",
    "contact.info.email": "Email",
    "contact.info.hours": "Hours",
    "contact.info.hours.weekdays": "Mon - Fri: 9:00 AM - 7:00 PM",
    "contact.info.hours.saturday": "Sat: 9:00 AM - 1:00 PM",
    "contact.info.hours.sunday": "Sun: Closed",

    // FAQ Page
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle":
      "Find answers to the most common questions. If you cannot find what you are looking for, do not hesitate to contact us.",
    "faq.notFound": "Did not find the answer you were looking for?",
    "faq.notFound.subtitle": "Our team is ready to help you.",
    "faq.contact": "Contact Us",
    "faq.category.purchase": "Vehicle Purchase",
    "faq.category.valuation": "Valuation and Trade-In",
    "faq.category.delivery": "Delivery and Payment",
    "faq.category.support": "After-Sales Support",
    "faq.category.general": "General Information",
    // FAQ Questions - Purchase
    "faq.purchase.q1": "How can I purchase a vehicle?",
    "faq.purchase.a1":
      "You can visit our showroom, contact us by phone or email, or fill out the contact form on our website. We will guide you through every step of the purchase, from choosing the vehicle to financing.",
    "faq.purchase.q2": "Are vehicles guaranteed?",
    "faq.purchase.a2":
      "Yes, all our used vehicles are covered by the 12-month legal warranty of conformity as required by consumer law. We also offer optional warranty extensions up to 24 or 36 months.",
    "faq.purchase.q3": "Can I test drive a vehicle before purchasing?",
    "faq.purchase.a3": "Absolutely! We offer free test drives by appointment. Contact us to book your road test.",
    "faq.purchase.q4": "Do you offer financing?",
    "faq.purchase.a4":
      "Yes, we work with major finance companies to offer you customized payment solutions. You can finance up to 100% of the vehicle value with installments tailored to your needs.",
    "faq.purchase.q5": "What documents are needed for purchase?",
    "faq.purchase.a5":
      "For the purchase you need: valid ID, tax code, and for financing also the latest payslips or income documentation. For businesses: chamber of commerce registration and documents of the legal representative.",
    // FAQ Questions - Valuation
    "faq.valuation.q1": "How does the valuation of my used car work?",
    "faq.valuation.a1":
      "You can request a free online valuation by filling out the form in the 'Sell Your Car' section. We will provide you with an initial estimate and, after inspecting the vehicle, a final valuation.",
    "faq.valuation.q2": "Do you accept trade-ins?",
    "faq.valuation.a2":
      "Yes, we accept your used car as a trade-in. The value of your vehicle will be deducted from the purchase price of the new one. The valuation is free and without obligation.",
    "faq.valuation.q3": "How long does the valuation take?",
    "faq.valuation.a3":
      "The online valuation is immediate. For the final valuation with inspection, we usually require 1-2 business days.",
    // FAQ Questions - Delivery
    "faq.delivery.q1": "What payment methods do you accept?",
    "faq.delivery.a1":
      "We accept bank transfer, cashier's check, cash (within legal limits), and financing. For installment payments, we work with various finance companies.",
    "faq.delivery.q2": "Do you offer home delivery?",
    "faq.delivery.a2":
      "Yes, we offer home delivery service throughout Italy. Costs vary depending on distance. Contact us for a quote.",
    "faq.delivery.q3": "How long from purchase to delivery?",
    "faq.delivery.a3":
      "For vehicles ready in stock, delivery usually takes place within 3-5 business days from completing the paperwork. For vehicles to be prepared, times may vary.",
    // FAQ Questions - Support
    "faq.support.q1": "What does the warranty cover?",
    "faq.support.a1":
      "The legal warranty covers defects of conformity existing at the time of delivery. Damage caused by normal wear, improper use or lack of maintenance is excluded.",
    "faq.support.q2": "How can I report a problem with the vehicle?",
    "faq.support.a2":
      "You can contact us by phone, email or through the contact form. Our team will assist you in resolving the issue as quickly as possible.",
    "faq.support.q3": "Do you offer maintenance services?",
    "faq.support.a3":
      "We work with authorized workshops to offer you ordinary and extraordinary maintenance services at agreed prices.",
    // FAQ Questions - General
    "faq.general.q1": "What are your opening hours?",
    "faq.general.a1":
      "We are open Monday to Friday from 9:00 AM to 7:00 PM, and Saturday from 9:00 AM to 1:00 PM. Closed on Sunday. For appointments outside hours, contact us.",
    "faq.general.q2": "Where is your showroom located?",
    "faq.general.a2":
      "Our showroom is located at Via Roma 123, 00100 Rome (RM). We are easily accessible by public transport and have free parking for customers.",
    "faq.general.q3": "How can I contact you?",
    "faq.general.a3":
      "You can contact us by phone at +39 333 388 9908, by email at gajanovsa@gmail.com, via WhatsApp, or by filling out the contact form on the website.",

    // Privacy Policy
    "privacy.title": "Privacy Policy",
    "privacy.seo.title": "Privacy Policy | AutoAndrew",
    "privacy.seo.description":
      "AutoAndrew Privacy Policy. Learn how we process your personal data in compliance with GDPR.",
    "privacy.lastUpdate": "Last updated:",
    "privacy.section1.title": "1. Data Controller",
    "privacy.section1.content":
      "The Data Controller for personal data is AutoAndrew, located at Via Roma 123, 00100 Rome (RM), Italy. For any information regarding the processing of personal data, you can contact us at: gajanovsa@gmail.com",
    "privacy.section2.title": "2. Types of Data Collected",
    "privacy.section2.intro": "The personal data we collect includes:",
    "privacy.section2.item1": "Contact data: name, surname, email address, phone number",
    "privacy.section2.item2": "Vehicle data: information about vehicles you wish to evaluate or purchase",
    "privacy.section2.item3": "Navigation data: IP address, browser type, pages visited, time spent",
    "privacy.section2.item4": "Authentication data: email and password for access to the reserved area",
    "privacy.section3.title": "3. Purposes of Processing",
    "privacy.section3.intro": "Your personal data is processed for the following purposes:",
    "privacy.section3.item1": "Provision of requested services (vehicle valuation, contact requests)",
    "privacy.section3.item2": "User account management and access to reserved area",
    "privacy.section3.item3": "Sending communications related to requested services",
    "privacy.section3.item4": "Improving user experience on the site",
    "privacy.section3.item5": "Compliance with legal and tax obligations",
    "privacy.section3.item6": "With prior consent, sending newsletters and promotional communications",
    "privacy.section4.title": "4. Legal Basis for Processing",
    "privacy.section4.content":
      "The processing of personal data is based on: execution of a contract or pre-contractual measures (art. 6.1.b GDPR), compliance with legal obligations (art. 6.1.c GDPR), legitimate interest of the Controller (art. 6.1.f GDPR), and consent of the data subject for marketing purposes (art. 6.1.a GDPR).",
    "privacy.section5.title": "5. Data Retention",
    "privacy.section5.content":
      "Personal data is retained for the time strictly necessary to achieve the purposes for which it was collected, and in any case no longer than 10 years from the termination of the contractual relationship, unless otherwise required by law. Data collected for marketing purposes is retained until consent is withdrawn.",
    "privacy.section6.title": "6. Communication and Disclosure of Data",
    "privacy.section6.content":
      "Personal data may be communicated to: authorized persons for processing (employees and collaborators), technical service providers (hosting, email), professionals and consultants, competent authorities when required by law. Data will not be disclosed to unauthorized third parties.",
    "privacy.section7.title": "7. Transfer of Data Outside the EU",
    "privacy.section7.content":
      "Some service providers may transfer data outside the European Union. In such cases, we ensure that the transfer takes place in compliance with the guarantees provided by the GDPR, such as the Standard Contractual Clauses approved by the European Commission.",
    "privacy.section8.title": "8. Rights of the Data Subject",
    "privacy.section8.intro": "Pursuant to articles 15-22 of the GDPR, you have the right to:",
    "privacy.section8.item1": "Access your personal data",
    "privacy.section8.item2": "Obtain rectification or erasure of data",
    "privacy.section8.item3": "Restrict processing",
    "privacy.section8.item4": "Object to processing",
    "privacy.section8.item5": "Request data portability",
    "privacy.section8.item6": "Withdraw consent at any time",
    "privacy.section8.item7": "Lodge a complaint with the Data Protection Authority",
    "privacy.section8.contact": "To exercise your rights, contact us at: gajanovsa@gmail.com",
    "privacy.section9.title": "9. Data Security",
    "privacy.section9.content":
      "We adopt adequate technical and organizational measures to protect personal data from unauthorized access, loss, destruction or alteration. Data is stored on secure servers and access is limited to authorized personnel.",
    "privacy.section10.title": "10. Changes to the Policy",
    "privacy.section10.content":
      "We reserve the right to modify this policy at any time. Changes will be published on this page with an indication of the last update date. We invite you to periodically consult this page.",

    // Cookie Policy
    "cookie.title": "Cookie Policy",
    "cookie.seo.title": "Cookie Policy | AutoAndrew",
    "cookie.seo.description":
      "AutoAndrew Cookie Policy. Discover which cookies we use and how you can manage your preferences.",
    "cookie.lastUpdate": "Last updated:",
    "cookie.section1.title": "1. What are Cookies",
    "cookie.section1.content":
      "Cookies are small text files that are stored on your device (computer, tablet, smartphone) when you visit a website. Cookies allow the site to recognize you and remember your preferences, improving your browsing experience.",
    "cookie.section2.title": "2. Types of Cookies Used",
    "cookie.section2.technical.title": "2.1 Technical Cookies (Necessary)",
    "cookie.section2.technical.desc":
      "These cookies are essential for the proper functioning of the site. They cannot be disabled.",
    "cookie.section2.analytics.title": "2.2 Analytics Cookies",
    "cookie.section2.analytics.desc":
      "We use Google Analytics to understand how users interact with the site. These cookies collect information anonymously.",
    "cookie.section2.marketing.title": "2.3 Marketing Cookies",
    "cookie.section2.marketing.desc":
      "These cookies are used to track visitors across websites and show relevant ads. They are only activated with your explicit consent.",
    "cookie.table.name": "Name",
    "cookie.table.purpose": "Purpose",
    "cookie.table.duration": "Duration",
    "cookie.table.consent.purpose": "Stores cookie preferences",
    "cookie.table.consent.duration": "1 year",
    "cookie.table.auth.purpose": "User authentication",
    "cookie.table.auth.duration": "Session",
    "cookie.table.ga.purpose": "Distinguishes users",
    "cookie.table.ga.duration": "2 years",
    "cookie.table.gax.purpose": "Maintains session state",
    "cookie.table.gax.duration": "2 years",
    "cookie.table.gid.purpose": "Distinguishes users",
    "cookie.table.gid.duration": "24 hours",
    "cookie.section3.title": "3. How to Manage Cookies",
    "cookie.section3.intro": "You can manage your cookie preferences in different ways:",
    "cookie.section3.banner.title": "Cookie banner:",
    "cookie.section3.banner.desc":
      "On first access to the site, you can choose which categories of cookies to accept through our banner.",
    "cookie.section3.browser.title": "Browser settings:",
    "cookie.section3.browser.desc":
      "You can configure your browser to block or delete cookies. Here are the guides for the main browsers:",
    "cookie.section3.optout.title": "Google Analytics Opt-out:",
    "cookie.section3.optout.desc": "You can install the",
    "cookie.section3.optout.link": "Google Analytics Opt-out Browser Add-on",
    "cookie.section4.title": "4. Third-Party Cookies",
    "cookie.section4.content":
      "Some cookies are set by third-party services that appear on our pages. We have no control over these cookies. For more information, consult the privacy policies of the respective services:",
    "cookie.section5.title": "5. Legal Basis",
    "cookie.section5.content":
      "The processing of data through technical cookies is based on the legitimate interest of the Controller. For analytics and marketing cookies, the legal basis is user consent, revocable at any time.",
    "cookie.section6.title": "6. Updates",
    "cookie.section6.content":
      "This Cookie Policy may be updated periodically. We invite you to regularly consult this page to be informed of any changes.",
    "cookie.section7.title": "7. Contacts",
    "cookie.section7.content":
      "For any questions regarding this Cookie Policy or the processing of your data, you can contact us at: gajanovsa@gmail.com",
    "cookie.section7.moreInfo": "For more information on the processing of personal data, consult our",

    // Auth Page
    "auth.title": "Login",
    "auth.subtitle": "Access your account or register to save your favorite vehicles",
    "auth.login.tab": "Login",
    "auth.signup.tab": "Register",
    "auth.login.title": "Login",
    "auth.login.subtitle": "Enter your credentials to access",
    "auth.signup.title": "Sign Up",
    "auth.signup.subtitle": "Create a new account",
    "auth.email": "Email",
    "auth.email.placeholder": "email@example.com",
    "auth.password": "Password",
    "auth.password.placeholder": "Minimum 6 characters",
    "auth.login.button": "Login",
    "auth.signup.button": "Register",
    "auth.login.switch": "Do not have an account?",
    "auth.signup.switch": "Already have an account?",
    "auth.forgot": "Forgot password?",
    "auth.name": "Name",
    "auth.name.placeholder": "Name",
    "auth.surname": "Surname",
    "auth.surname.placeholder": "Surname",
    "auth.phone": "Phone Number",
    "auth.phone.placeholder": "Phone Number",
    "auth.or": "OR",
    "auth.google": "Continue with Google",
    "auth.footer": "Login to save your favorite vehicles and manage requests",
    "auth.forgot.title": "Recover Password",
    "auth.forgot.subtitle": "Enter your email and we will send you a link to reset your password",
    "auth.forgot.send": "Send",
    "auth.forgot.back": "Back",
    "auth.reset.title": "Reset Password",
    "auth.reset.subtitle": "Enter your new password",
    "auth.reset.newPassword": "New Password",
    "auth.reset.confirmPassword": "Confirm Password",
    "auth.reset.confirm.placeholder": "Confirm password",
    "auth.reset.button": "Reset Password",
    "auth.reset.updating": "Updating...",
    // Auth Messages
    "auth.error": "Error",
    "auth.error.invalidEmail": "Invalid email",
    "auth.error.passwordMin": "Password minimum 6 characters",
    "auth.error.nameMin": "Name must contain at least 2 characters",
    "auth.error.surnameMin": "Surname must contain at least 2 characters",
    "auth.error.phoneMin": "Phone number must contain at least 10 characters",
    "auth.error.alreadyRegistered": "Email already registered. Try to login.",
    "auth.error.invalidLogin": "Incorrect email or password",
    "auth.error.auth": "Authentication error",
    "auth.error.enterEmail": "Enter your email",
    "auth.error.sendReset": "Unable to send reset email",
    "auth.error.passwordMismatch": "Passwords do not match",
    "auth.error.updatePassword": "Unable to update password",
    "auth.error.google": "Unable to login with Google",
    "auth.success.registered": "Registration completed",
    "auth.success.registeredDesc": "Check your email to confirm your account.",
    "auth.success.emailSent": "Email sent",
    "auth.success.emailSentDesc": "Check your inbox for the password reset link",
    "auth.success": "Success",
    "auth.success.passwordUpdated": "Password updated successfully. Now you can login.",

    // Cookie Consent
    "cookies.title": "This site uses cookies 🍪",
    "cookies.description":
      "We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and personalize content. You can accept all cookies, only necessary ones, or customize your preferences.",
    "cookies.learnMore": "To learn more, see our",
    "cookies.and": "and",
    "cookies.acceptAll": "Accept All",
    "cookies.acceptNecessary": "Necessary Only",
    "cookies.customize": "Customize",
    "cookies.settings.title": "Cookie Settings",
    "cookies.necessary.title": "Necessary Cookies",
    "cookies.necessary.desc": "Essential for the website to function. Cannot be disabled.",
    "cookies.analytics.title": "Analytics Cookies",
    "cookies.analytics.desc": "Help us understand how you use the site to improve the experience.",
    "cookies.marketing.title": "Marketing Cookies",
    "cookies.marketing.desc": "Used to show you relevant ads based on your interests.",
    "cookies.save": "Save Preferences",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.back": "Back",
    "common.next": "Next",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.search": "Search",
    "common.all": "All",
    "common.from": "From",
    "common.to": "To",

    // Search Filters
    "filters.title": "Find used and new vehicles",
    "filters.brand": "Brand",
    "filters.model": "Model",
    "filters.selectBrand": "Select brand",
    "filters.yearFrom": "Year from",
    "filters.priceFrom": "Price from",
    "filters.priceTo": "Price to",
    "filters.powerFrom": "Power from",
    "filters.power": "Power",
    "filters.powerTo": "Power to",
    "filters.engineFrom": "Engine size from",
    "filters.engineTo": "Engine size to",
    "filters.maxKm": "Max km",
    "filters.color": "Color",
    "filters.fuel": "Fuel",
    "filters.gearbox": "Gearbox",
    "filters.condition": "Condition",
    "filters.euroClass": "Euro Class",
    "filters.doors": "Doors",
    "filters.bodyType": "Body Type",
    "filters.results": "results",
    "filters.advancedSearch": "ADVANCED SEARCH",
    "filters.closeAdvanced": "CLOSE ADVANCED SEARCH",
    "filters.removeFilter": "Remove filter",
    "filters.searchByBody": "Search by body type",
    "filters.any": "Any",
    "filters.upTo": "Up to",
    "filters.from": "From",
    "filters.doors2": "2 doors",
    "filters.doors3": "3 doors",
    "filters.doors4": "4 doors",
    "filters.doors5": "5 doors",

    // Body Types
    "body.cityCar": "City car",
    "body.suv": "SUV & Pick-up",
    "body.van": "Vans & Van",
    "body.cabrio": "Convertible",
    "body.monovolume": "Minivan",
    "body.berlina": "Sedan",
    "body.stationWagon": "Station Wagon",
    "body.coupe": "Coupé",

    // Trust Section
    "trust.mainTitle": "Why Choose Us",
    "trust.badge": "Our Advantages",
    "trust.warranty.title": "12-Month Warranty",
    "trust.warranty.desc": "All vehicles are covered by warranty",
    "trust.certified.title": "Certified Cars",
    "trust.certified.desc": "Quality checks on every vehicle",
    "trust.delivery.title": "Fast Delivery",
    "trust.delivery.desc": "Pick-up or delivery in 48 hours",
    "trust.satisfaction.title": "Satisfied or Refunded",
    "trust.satisfaction.desc": "14 days to change your mind",
    "trust.stat.vehicles": "Vehicles Sold",
    "trust.stat.experience": "Years Experience",
    "trust.stat.satisfaction": "Satisfied Customers",
    "trust.stat.support": "Support",

    // Testimonials Section
    "testimonials.badge": "Reviews",
    "testimonials.mainTitle": "What our customers say",
    "testimonials.basedOn": "out of 5 based on",
    "testimonials.reviews": "reviews",
    "testimonials.purchase": "Purchase:",
    "testimonials.verified": "Verified Reviews",
    "testimonials.guarantee": "Satisfaction Guarantee",
    "testimonials.satisfiedClients": "98% Satisfied Customers",

    // Valuation Page Extended
    "valuation.badge": "Free Valuation",
    "valuation.vehicleInfo": "Vehicle Information",
    "valuation.vehicleInfo.desc": "Enter your vehicle details to get an estimate",
    "valuation.brand": "Brand",
    "valuation.selectBrand": "Select brand",
    "valuation.modelLabel": "Model",
    "valuation.modelPlaceholder": "E.g. Golf, 3 Series...",
    "valuation.registrationYear": "Registration Year",
    "valuation.selectYear": "Select year",
    "valuation.fuelType": "Fuel Type",
    "valuation.selectFuel": "Select fuel type",
    "valuation.mileage": "Mileage (km)",
    "valuation.mileagePlaceholder": "E.g. 85000",
    "valuation.conditionLabel": "Condition",
    "valuation.selectCondition": "Select condition",
    "valuation.condition.excellent": "Excellent condition",
    "valuation.condition.good": "Good condition",
    "valuation.condition.fair": "Fair condition",
    "valuation.condition.poor": "Needs work",
    "valuation.bodyType": "Body Type",
    "valuation.selectBodyType": "Select body type",
    "valuation.desiredPrice": "Desired Price",
    "valuation.pricePlaceholder": "E.g. 15000",
    "valuation.photos": "Vehicle Photos",
    "valuation.photos.desc": "Upload up to 10 photos for a more accurate valuation",
    "valuation.photos.dragDrop": "Click or drag photos here",
    "valuation.photos.format": "JPG, PNG, WebP (max 5MB per photo)",
    "valuation.photos.limitReached": "Photo limit reached",
    "valuation.photos.maxPhotos": "You can upload a maximum of 10 photos",
    "valuation.photos.fileTooLarge": "File too large",
    "valuation.photos.maxSize": "Each photo must be maximum 5MB",
    "valuation.yourData": "Your Details",
    "valuation.yourData.desc": "How we can contact you for the final valuation",
    "valuation.fullName": "Full Name",
    "valuation.phone": "Phone",
    "valuation.phonePlaceholder": "Phone number",
    "valuation.emailLabel": "Email",
    "valuation.emailPlaceholder": "Email address",
    "valuation.notesLabel": "Additional notes (optional)",
    "valuation.notesPlaceholder": "Describe any extras, service history, tire condition...",
    "valuation.submitting": "Submitting...",
    "valuation.submitButton": "Request Free Valuation",
    "valuation.instantEstimate": "Instant Estimate",
    "valuation.instantEstimate.desc": "Indicative valuation based on entered data",
    "valuation.estimatedValue": "Estimated value",
    "valuation.estimateDisclaimer": "* Indicative estimate. The final value will depend on the in-person evaluation.",
    "valuation.fillData": "Fill in vehicle details to see instant estimate",
    "valuation.whyChooseUs": "Why Choose Us",
    "valuation.benefit1": "Free and no-obligation valuation",
    "valuation.benefit2": "Guaranteed response within 24 hours",
    "valuation.benefit3": "Immediate payment",
    "valuation.benefit4": "Home pickup available",
    "valuation.benefit5": "Maximum transparency and professionalism",
    "valuation.successTitle": "Request sent!",
    "valuation.successDesc": "We will contact you within 24 hours with the final valuation.",
    "valuation.errorTitle": "Error",
    "valuation.errorDesc": "An error occurred. Please try again.",

    // Dashboard
    "dashboard.welcome": "Welcome to your area",
    "dashboard.logout": "Logout",
    "dashboard.savedVehicles": "Saved Vehicles",
    "dashboard.requestsSent": "Requests Sent",
    "dashboard.offersReceived": "Offers Received",
    "dashboard.favorites": "Favorites",
    "dashboard.valuations": "Valuations",
    "dashboard.noSavedVehicles": "No saved vehicles",
    "dashboard.noSavedVehiclesDesc": "Save vehicles you are interested in to easily view them later",
    "dashboard.exploreVehicles": "Explore Vehicles",
    "dashboard.noRequests": "No requests",
    "dashboard.noRequestsDesc": "Want to sell your car? Submit a free valuation request",
    "dashboard.requestValuation": "Request Valuation",
    "dashboard.year": "Year",
    "dashboard.km": "Km",
    "dashboard.fuel": "Fuel",
    "dashboard.condition": "Condition",
    "dashboard.requestedPrice": "Requested price",
    "dashboard.requestDate": "Request",
    "dashboard.yourNotes": "Your notes",
    "dashboard.finalOffer": "Final offer",
    "dashboard.offerAvailable": "Offer available",
    "dashboard.appointment": "Appointment",
    "dashboard.processing": "Processing",
    "dashboard.contactSoon": "We will contact you soon",
    "dashboard.note": "Note",
    "dashboard.idCopied": "ID copied",
    "dashboard.idCopiedDesc": "The ID has been copied to clipboard",
    "dashboard.clickToCopy": "Click to copy",
    "dashboard.caseId": "Case ID",
    "dashboard.removed": "Removed",
    "dashboard.vehicleRemoved": "Vehicle removed from favorites",
    "dashboard.logoutSuccess": "Logged out",
    "dashboard.logoutSuccessDesc": "You have been successfully logged out",
    "dashboard.errorLoadRequests": "Unable to load valuation requests",
    "dashboard.errorLoadSaved": "Unable to load saved vehicles",
    "dashboard.errorRemove": "Unable to remove vehicle",
    "dashboard.errorLogout": "Unable to logout",
    "dashboard.status.pending": "Pending",
    "dashboard.status.contacted": "Contacted",
    "dashboard.status.completed": "Completed",
    "dashboard.status.rejected": "Rejected",
    "dashboard.condition.excellent": "Excellent",
    "dashboard.condition.good": "Good",
    "dashboard.condition.fair": "Fair",
    "dashboard.condition.poor": "Needs work",

    // Vehicle Detail
    "vehicleDetail.back": "Back",
    "vehicleDetail.save": "Save",
    "vehicleDetail.saved": "Saved",
    "vehicleDetail.share": "Share",
    "vehicleDetail.print": "Print",
    "vehicleDetail.greatPrice": "Great price",
    "vehicleDetail.loading": "Loading details...",
    "vehicleDetail.notFound": "Vehicle not found",
    "vehicleDetail.backToSearch": "Back to search",
    "vehicleDetail.shared": "Shared!",
    "vehicleDetail.sharedDesc": "The link has been shared successfully.",
    "vehicleDetail.linkCopied": "Link copied!",
    "vehicleDetail.linkCopiedDesc": "The link has been copied to clipboard. You can share it with anyone.",
    "vehicleDetail.linkCopiedShort": "The link has been copied to clipboard.",
    "vehicleDetail.shareError": "Unable to share link. Try copying the URL manually.",
    "vehicleDetail.description": "Description",
    "vehicleDetail.interestedMsg": "Hi! I am interested in",

    // Vehicle Specs
    "specs.mileage": "Mileage",
    "specs.transmission": "Transmission",
    "specs.gearbox": "Gearbox",
    "specs.driveType": "Drive Type",
    "specs.year": "Year",
    "specs.fuel": "Fuel",
    "specs.power": "Power",
    "specs.seller": "Seller",
    "specs.dealer": "Dealer",
    "specs.additionalDetails": "Additional details",
    "specs.emissionClass": "Emission class",
    "specs.combinedConsumption": "Combined consumption",
    "specs.warranty": "Warranty",
    "specs.months": "months",
    "specs.numSeats": "Number of seats",
    "specs.ownersCount": "Previous owners",
    "specs.doorsCount": "Number of doors",
    "specs.weight": "Weight",
    "specs.kg": "kg",

    // Dealer Card
    "dealer.googleReviews": "Google Reviews",
    "dealer.contactSeller": "Contact seller",
    "dealer.showNumber": "Show number",

    // Financing Calculator
    "financing.calculate": "Calculate payment",
    "financing.title": "Calculate your financing",
    "financing.vehiclePrice": "Vehicle price",
    "financing.downPayment": "Down payment",
    "financing.duration": "Duration",
    "financing.months": "months",
    "financing.rate": "Rate (APR)",
    "financing.monthlyPayment": "Monthly payment",
    "financing.totalFinanced": "Total financed",
    "financing.totalInterest": "Total interest",
    "financing.disclaimer": "*Indicative calculation. Final conditions subject to approval.",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_KEY) as Language;
      if (saved && (saved === "it" || saved === "en")) {
        return saved;
      }
    }
    return "it";
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const translateFuelType = (fuelType: string | undefined): string => {
    if (!fuelType) return "";
    
    // Normalize the fuel type to lowercase for matching
    const normalized = fuelType.toLowerCase().trim();
    
    // Check for exact translation key matches
    const translationKey = `fuel.${normalized}`;
    if (translations[language][translationKey]) {
      return translations[language][translationKey];
    }
    
    // Handle hybrid variants with slash
    if (normalized.includes("/")) {
      const parts = normalized.split("/").map(p => p.trim());
      
      // Elettrica/Diesel or Electric/Diesel
      if ((parts[0] === "elettrica" || parts[0] === "electric") && parts[1] === "diesel") {
        return t("fuel.elettrica/diesel");
      }
      
      // Elettrica/Benzina or Electric/Petrol
      if ((parts[0] === "elettrica" || parts[0] === "electric") && (parts[1] === "benzina" || parts[1] === "petrol")) {
        return t("fuel.elettrica/benzina");
      }
    }
    
    // Map common Italian fuel types to translation keys
    const fuelTypeMap: Record<string, string> = {
      "benzina": "fuel.petrol",
      "diesel": "fuel.diesel",
      "ibrido": "fuel.hybrid",
      "ibrida": "fuel.hybrid",
      "elettrico": "fuel.electric",
      "elettrica": "fuel.electric",
      "gpl": "fuel.lpg",
      "metano": "fuel.methane",
      "petrol": "fuel.petrol",
      "gasoline": "fuel.petrol",
      "hybrid": "fuel.hybrid",
      "electric": "fuel.electric",
      "lpg": "fuel.lpg",
      "cng": "fuel.methane",
      "methane": "fuel.methane",
    };
    
    const key = fuelTypeMap[normalized];
    if (key) {
      return t(key);
    }
    
    // If no translation found, return original
    return fuelType;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t, translateFuelType }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
