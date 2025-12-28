import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CookiePolicy = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === "it" ? "it-IT" : "en-US";

  return (
    <>
      <SEO
        title={t("cookie.seo.title")}
        description={t("cookie.seo.description")}
        keywords="cookie policy, informativa cookie, gestione cookie, privacy cookie"
        url="/cookie-policy"
        noindex={false}
      />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {t("cookie.title")}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground">
                {t("cookie.lastUpdate")} {new Date().toLocaleDateString(dateLocale)}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section1.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cookie.section1.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section2.title")}
              </h2>
              
              <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
                {t("cookie.section2.technical.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("cookie.section2.technical.desc")}
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">{t("cookie.table.name")}</th>
                      <th className="text-left py-2 text-foreground">{t("cookie.table.purpose")}</th>
                      <th className="text-left py-2 text-foreground">{t("cookie.table.duration")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">cookie_consent</td>
                      <td className="py-2">{t("cookie.table.consent.purpose")}</td>
                      <td className="py-2">{t("cookie.table.consent.duration")}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">sb-*-auth-token</td>
                      <td className="py-2">{t("cookie.table.auth.purpose")}</td>
                      <td className="py-2">{t("cookie.table.auth.duration")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
                {t("cookie.section2.analytics.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("cookie.section2.analytics.desc")}
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">{t("cookie.table.name")}</th>
                      <th className="text-left py-2 text-foreground">{t("cookie.table.purpose")}</th>
                      <th className="text-left py-2 text-foreground">{t("cookie.table.duration")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">_ga</td>
                      <td className="py-2">{t("cookie.table.ga.purpose")}</td>
                      <td className="py-2">{t("cookie.table.ga.duration")}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">_ga_*</td>
                      <td className="py-2">{t("cookie.table.gax.purpose")}</td>
                      <td className="py-2">{t("cookie.table.gax.duration")}</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gid</td>
                      <td className="py-2">{t("cookie.table.gid.purpose")}</td>
                      <td className="py-2">{t("cookie.table.gid.duration")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
                {t("cookie.section2.marketing.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("cookie.section2.marketing.desc")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section3.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("cookie.section3.intro")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>{t("cookie.section3.banner.title")}</strong> {t("cookie.section3.banner.desc")}
                </li>
                <li>
                  <strong>{t("cookie.section3.browser.title")}</strong> {t("cookie.section3.browser.desc")}
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                    <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
                  </ul>
                </li>
                <li>
                  <strong>{t("cookie.section3.optout.title")}</strong> {t("cookie.section3.optout.desc")}{" "}
                  <a 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("cookie.section3.optout.link")}
                  </a>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section4.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cookie.section4.content")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                <li>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Analytics - Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section5.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cookie.section5.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section6.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cookie.section6.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("cookie.section7.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cookie.section7.content")}
              </p>
              <p className="text-muted-foreground mt-4">
                {t("cookie.section7.moreInfo")}{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  {t("footer.privacy")}
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

export default CookiePolicy;
