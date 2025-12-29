import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { SEO } from "@/components/SEO";
import { trackContactForm } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock, Star, Users, Car, Award, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contatti = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(2, language === "it" ? "Il nome deve avere almeno 2 caratteri" : "Name must be at least 2 characters"),
    email: z.string().email(language === "it" ? "Inserisci un'email valida" : "Enter a valid email"),
    phone: z.string().optional(),
    subject: z.string().min(3, language === "it" ? "L'oggetto deve avere almeno 3 caratteri" : "Subject must be at least 3 characters"),
    message: z.string().min(10, language === "it" ? "Il messaggio deve avere almeno 10 caratteri" : "Message must be at least 10 characters")
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    trackContactForm("contact");
    toast({
      title: language === "it" ? "Messaggio inviato!" : "Message sent!",
      description: language === "it" ? "Ti risponderemo il prima possibile." : "We will reply as soon as possible."
    });
    form.reset();
    setIsSubmitting(false);
  };

  const stats = [
    { icon: Car, value: "500+", label: language === "it" ? "Veicoli venduti" : "Vehicles sold" },
    { icon: Users, value: "1000+", label: language === "it" ? "Clienti soddisfatti" : "Satisfied customers" },
    { icon: Award, value: "15+", label: language === "it" ? "Anni di esperienza" : "Years of experience" },
    { icon: Star, value: "4.7", label: language === "it" ? "Valutazione Google" : "Google rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === "it" ? "Contatti - AutoAndrew" : "Contact - AutoAndrew"}
        description={language === "it" 
          ? "Contatta AutoAndrew per informazioni su veicoli, valutazioni e servizi. Siamo a tua disposizione per rispondere a tutte le tue domande."
          : "Contact AutoAndrew for information about vehicles, valuations and services. We are at your disposal to answer all your questions."}
        keywords={language === "it" 
          ? "contatti autoandrew, concessionaria auto, vendita auto, informazioni veicoli, assistenza clienti"
          : "contact autoandrew, car dealership, car sales, vehicle information, customer service"}
        url="/contatti"
      />
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-[Montserrat]">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <section id="contatti" className="py-8 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Left Column - Info & Map */}
              <div className="space-y-8">
                {/* About Company */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      {language === "it" ? "Chi Siamo" : "About Us"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">AutoAndrew</strong>{" "}
                      {language === "it" 
                        ? "è un punto di riferimento nel settore automotive in Romagna da oltre 15 anni. Ci occupiamo della vendita di veicoli nuovi e usati garantiti, offrendo un servizio completo che include valutazione del tuo usato, finanziamenti personalizzati e assistenza post-vendita."
                        : "has been a reference point in the automotive sector in Romagna for over 15 years. We deal with the sale of new and guaranteed used vehicles, offering a complete service that includes trade-in valuation, personalized financing and after-sales assistance."}
                    </p>
                    <p>
                      {language === "it"
                        ? "La nostra missione è rendere l'acquisto dell'auto un'esperienza semplice, trasparente e soddisfacente. Ogni veicolo in vendita viene accuratamente controllato e certificato per garantire la massima qualità ai nostri clienti."
                        : "Our mission is to make buying a car a simple, transparent and satisfying experience. Every vehicle for sale is carefully inspected and certified to guarantee the highest quality to our customers."}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(language === "it" 
                        ? ["Veicoli garantiti", "Finanziamenti", "Permute", "Assistenza"]
                        : ["Guaranteed vehicles", "Financing", "Trade-ins", "Assistance"]
                      ).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("contact.info.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a href="https://maps.google.com/?q=Via+Emilia+per+Cesena+1800+Forlimpopoli" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{t("contact.info.address")}</div>
                        <div className="text-muted-foreground">
                          Via Emilia per Cesena, 1800<br />
                          47034 Forlimpopoli FC, Italia
                        </div>
                      </div>
                    </a>
                    
                    <a href="tel:+393333889908" className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{t("contact.info.phone")}</div>
                        <div className="text-muted-foreground">+39 3333 88 99 08</div>
                      </div>
                    </a>
                    
                    <a href="mailto:gajanovsa@gmail.com" className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{t("contact.info.email")}</div>
                        <div className="text-muted-foreground">gajanovsa@gmail.com</div>
                      </div>
                    </a>
                    
                    <div className="flex items-start gap-3 p-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{t("contact.info.hours")}</div>
                        <div className="text-muted-foreground text-sm space-y-1">
                          <div className="flex justify-between gap-8">
                            <span>{language === "it" ? "Lunedì - Venerdì" : "Monday - Friday"}</span>
                            <span>09:00 - 19:00</span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span>{language === "it" ? "Sabato" : "Saturday"}</span>
                            <span>09:00 - 13:00</span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span>{language === "it" ? "Domenica" : "Sunday"}</span>
                            <span>{language === "it" ? "Chiuso" : "Closed"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Maps */}
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {language === "it" ? "Dove Siamo" : "Where We Are"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2864.5!2d12.1283!3d44.1883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca5a0b8b8b8b9%3A0x0!2sVia+Emilia+per+Cesena%2C+1800%2C+47034+Forlimpopoli+FC!5e0!3m2!1sit!2sit!4v1" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade" 
                        title="Map"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Contact Form */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      {language === "it" ? "Inviaci un Messaggio" : "Send Us a Message"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField 
                          control={form.control} 
                          name="name" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.name")} *</FormLabel>
                              <FormControl>
                                <Input placeholder={language === "it" ? "Mario Rossi" : "John Doe"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField 
                            control={form.control} 
                            name="email" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("contact.form.email")} *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />

                          <FormField 
                            control={form.control} 
                            name="phone" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("contact.form.phone")}</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="+39 333 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />
                        </div>

                        <FormField 
                          control={form.control} 
                          name="subject" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === "it" ? "Oggetto" : "Subject"} *</FormLabel>
                              <FormControl>
                                <Input placeholder={language === "it" ? "Es: Richiesta informazioni veicolo" : "E.g.: Vehicle information request"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <FormField 
                          control={form.control} 
                          name="message" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.message")} *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === "it" ? "Scrivi qui il tuo messaggio..." : "Write your message here..."} 
                                  className="min-h-[150px] resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              {language === "it" ? "Invio in corso..." : "Sending..."}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              {t("contact.form.submit")}
                            </>
                          )}
                        </Button>

                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {language === "it" 
                              ? "Risponderemo alla tua richiesta entro 24 ore lavorative."
                              : "We will respond to your request within 24 business hours."}
                          </span>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contatti;
