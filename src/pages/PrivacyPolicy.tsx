import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === "it" ? "it-IT" : "en-US";

  return (
    <>
      <SEO
        title={t("privacy.seo.title")}
        description={t("privacy.seo.description")}
        keywords="privacy policy, trattamento dati personali, GDPR, protezione dati, informativa privacy"
        url="/privacy-policy"
        noindex={false}
      />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {t("privacy.title")}
          </h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground">
                {t("privacy.lastUpdate")} {new Date().toLocaleDateString(dateLocale)}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section1.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section1.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section2.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.section2.intro")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>{t("privacy.section2.item1").split(":")[0]}:</strong>{t("privacy.section2.item1").split(":")[1]}</li>
                <li><strong>{t("privacy.section2.item2").split(":")[0]}:</strong>{t("privacy.section2.item2").split(":")[1]}</li>
                <li><strong>{t("privacy.section2.item3").split(":")[0]}:</strong>{t("privacy.section2.item3").split(":")[1]}</li>
                <li><strong>{t("privacy.section2.item4").split(":")[0]}:</strong>{t("privacy.section2.item4").split(":")[1]}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section3.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.section3.intro")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("privacy.section3.item1")}</li>
                <li>{t("privacy.section3.item2")}</li>
                <li>{t("privacy.section3.item3")}</li>
                <li>{t("privacy.section3.item4")}</li>
                <li>{t("privacy.section3.item5")}</li>
                <li>{t("privacy.section3.item6")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section4.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section4.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section5.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section5.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section6.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section6.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section7.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section7.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section8.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.section8.intro")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("privacy.section8.item1")}</li>
                <li>{t("privacy.section8.item2")}</li>
                <li>{t("privacy.section8.item3")}</li>
                <li>{t("privacy.section8.item4")}</li>
                <li>{t("privacy.section8.item5")}</li>
                <li>{t("privacy.section8.item6")}</li>
                <li>{t("privacy.section8.item7")}</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                {t("privacy.section8.contact")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section9.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section9.content")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                {t("privacy.section10.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.section10.content")}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
