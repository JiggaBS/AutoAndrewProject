import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <>
      <SEO
        title="Termini e Condizioni"
        description="Termini e condizioni di utilizzo del sito AutoAndrew. Leggi attentamente prima di utilizzare i nostri servizi. Informazioni su garanzie, diritti di recesso e responsabilità."
        keywords="termini e condizioni, condizioni di utilizzo, garanzia veicoli, diritto di recesso, condizioni vendita"
        url="/terms"
        noindex={false}
      />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Termini e Condizioni
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                1. Accettazione dei Termini
              </h2>
              <p className="text-muted-foreground">
                Utilizzando il sito web AutoAndrew, accetti di essere vincolato dai presenti Termini e Condizioni. 
                Se non accetti questi termini, ti preghiamo di non utilizzare il nostro sito. Ci riserviamo il 
                diritto di modificare questi termini in qualsiasi momento senza preavviso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                2. Descrizione del Servizio
              </h2>
              <p className="text-muted-foreground">
                AutoAndrew è un portale dedicato alla compravendita di veicoli usati. Il sito offre:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                <li>Visualizzazione dell'inventario di veicoli disponibili</li>
                <li>Servizio di valutazione del tuo veicolo usato</li>
                <li>Richieste di informazioni e contatto</li>
                <li>Area riservata per utenti registrati</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                3. Registrazione e Account
              </h2>
              <p className="text-muted-foreground mb-4">
                Per accedere ad alcune funzionalità del sito è necessaria la registrazione. L'utente si impegna a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Fornire informazioni veritiere, accurate e complete</li>
                <li>Mantenere riservate le proprie credenziali di accesso</li>
                <li>Notificare immediatamente qualsiasi uso non autorizzato del proprio account</li>
                <li>Non cedere o trasferire l'account a terzi</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Ci riserviamo il diritto di sospendere o eliminare account che violino questi termini.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                4. Informazioni sui Veicoli
              </h2>
              <p className="text-muted-foreground">
                Le informazioni sui veicoli pubblicate sul sito (descrizioni, foto, prezzi, caratteristiche) sono 
                fornite a scopo informativo. Nonostante i nostri sforzi per garantire l'accuratezza, non possiamo 
                garantire che tutte le informazioni siano complete o prive di errori. I prezzi indicati sono da 
                intendersi IVA inclusa, salvo diversa indicazione. Ci riserviamo il diritto di modificare i prezzi 
                senza preavviso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                5. Valutazione Veicoli
              </h2>
              <p className="text-muted-foreground">
                Il servizio di valutazione online fornisce una stima indicativa basata sulle informazioni fornite 
                dall'utente. La valutazione definitiva sarà determinata solo dopo un'ispezione fisica del veicolo 
                e potrà differire dalla stima iniziale. L'invio di una richiesta di valutazione non costituisce 
                un impegno all'acquisto da parte nostra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                6. Proprietà Intellettuale
              </h2>
              <p className="text-muted-foreground">
                Tutti i contenuti presenti sul sito (testi, immagini, loghi, grafiche, software) sono di proprietà 
                di AutoAndrew o dei rispettivi titolari e sono protetti dalle leggi sulla proprietà intellettuale. 
                È vietata la riproduzione, distribuzione o utilizzo non autorizzato di qualsiasi contenuto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                7. Limitazione di Responsabilità
              </h2>
              <p className="text-muted-foreground">
                AutoAndrew non sarà responsabile per danni diretti, indiretti, incidentali o consequenziali 
                derivanti dall'uso o dall'impossibilità di utilizzo del sito. Non garantiamo che il sito sia 
                sempre disponibile, privo di errori o sicuro da virus o altri componenti dannosi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                8. Link a Siti Esterni
              </h2>
              <p className="text-muted-foreground">
                Il sito potrebbe contenere link a siti web di terze parti. Non siamo responsabili per i contenuti, 
                le politiche sulla privacy o le pratiche di tali siti. L'accesso a siti esterni avviene a proprio 
                rischio e pericolo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                9. Garanzia sui Veicoli
              </h2>
              <p className="text-muted-foreground">
                Tutti i veicoli venduti sono coperti dalla garanzia legale di conformità prevista dal Codice del 
                Consumo (D.Lgs. 206/2005). Per i veicoli usati, la garanzia legale ha durata di 12 mesi dalla 
                consegna, salvo diverso accordo scritto tra le parti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                10. Diritto di Recesso
              </h2>
              <p className="text-muted-foreground">
                Per gli acquisti conclusi a distanza o fuori dai locali commerciali, il consumatore ha diritto 
                di recedere dal contratto entro 14 giorni senza dover fornire alcuna motivazione, ai sensi degli 
                artt. 52 e ss. del Codice del Consumo. Per esercitare il diritto di recesso, contattare: 
                gajanovsa@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                11. Legge Applicabile e Foro Competente
              </h2>
              <p className="text-muted-foreground">
                I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia 
                derivante dall'utilizzo del sito, sarà competente in via esclusiva il Foro di Roma, fatto salvo 
                il foro del consumatore previsto dall'art. 66-bis del Codice del Consumo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                12. Risoluzione delle Controversie Online
              </h2>
              <p className="text-muted-foreground">
                Ai sensi dell'art. 14 del Regolamento UE n. 524/2013, informiamo che è disponibile una 
                piattaforma europea per la risoluzione online delle controversie (ODR) accessibile al seguente 
                link:{" "}
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                13. Contatti
              </h2>
              <p className="text-muted-foreground">
                Per qualsiasi domanda relativa ai presenti Termini e Condizioni, puoi contattarci:
              </p>
              <ul className="list-none text-muted-foreground space-y-2 mt-4">
                <li><strong>Email:</strong> gajanovsa@gmail.com</li>
                <li><strong>Telefono:</strong> +39 333 388 9908</li>
                <li><strong>Indirizzo:</strong> Via Roma 123, 00100 Roma (RM)</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Per informazioni sul trattamento dei dati personali, consulta la nostra{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>. Per informazioni sui cookie, consulta la nostra{" "}
                <Link to="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsConditions;
