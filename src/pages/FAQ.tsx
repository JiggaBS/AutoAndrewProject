import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { FAQPageSchema } from "@/components/SchemaOrg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      category: t("faq.category.purchase"),
      questions: [
        { q: t("faq.purchase.q1"), a: t("faq.purchase.a1") },
        { q: t("faq.purchase.q2"), a: t("faq.purchase.a2") },
        { q: t("faq.purchase.q3"), a: t("faq.purchase.a3") },
        { q: t("faq.purchase.q4"), a: t("faq.purchase.a4") },
        { q: t("faq.purchase.q5"), a: t("faq.purchase.a5") },
      ]
    },
    {
      category: t("faq.category.valuation"),
      questions: [
        { q: t("faq.valuation.q1"), a: t("faq.valuation.a1") },
        { q: t("faq.valuation.q2"), a: t("faq.valuation.a2") },
        { q: t("faq.valuation.q3"), a: t("faq.valuation.a3") },
      ]
    },
    {
      category: t("faq.category.delivery"),
      questions: [
        { q: t("faq.delivery.q1"), a: t("faq.delivery.a1") },
        { q: t("faq.delivery.q2"), a: t("faq.delivery.a2") },
        { q: t("faq.delivery.q3"), a: t("faq.delivery.a3") },
      ]
    },
    {
      category: t("faq.category.support"),
      questions: [
        { q: t("faq.support.q1"), a: t("faq.support.a1") },
        { q: t("faq.support.q2"), a: t("faq.support.a2") },
        { q: t("faq.support.q3"), a: t("faq.support.a3") },
      ]
    },
    {
      category: t("faq.category.general"),
      questions: [
        { q: t("faq.general.q1"), a: t("faq.general.a1") },
        { q: t("faq.general.q2"), a: t("faq.general.a2") },
        { q: t("faq.general.q3"), a: t("faq.general.a3") },
      ]
    }
  ];

  // Prepare FAQ data for schema
  const faqSchemaData = faqs.flatMap(section => 
    section.questions.map(qa => ({
      question: qa.q,
      answer: qa.a,
    }))
  );

  return (
    <>
      <SEO
        title={`FAQ - ${t("faq.title")}`}
        description={t("faq.subtitle")}
        keywords="domande frequenti auto, FAQ concessionaria, informazioni auto usate, risposte vendita auto"
        url="/faq"
      />
      <FAQPageSchema faqs={faqSchemaData} />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("faq.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${sectionIndex}-${faqIndex}`}
                      className="border-border"
                    >
                      <AccordionTrigger className="text-left hover:text-primary">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-secondary/50 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("faq.notFound")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("faq.notFound.subtitle")}
            </p>
            <a 
              href="/contatti" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t("faq.contact")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
