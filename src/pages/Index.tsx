import { useState, useEffect, forwardRef } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { LatestArrivals } from "@/components/home/LatestArrivals";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Footer } from "@/components/home/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from "@/components/SEO";
import { OrganizationSchema, WebSiteSchema } from "@/components/SchemaOrg";
import { sampleVehicles, Vehicle } from "@/data/sampleVehicles";
import { fetchVehicles } from "@/lib/api/vehicles";

const Index = forwardRef<HTMLDivElement>((props, ref) => {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      // Fetch vehicles sorted by date (most recent first) for latest arrivals
      const response = await fetchVehicles({ 
        limit: 8, 
        sort: 'first_registration_date',
        invert: '1' // Descending order - newest first
      });
      if (response.success && response.data && response.data.length > 0) {
        setAllVehicles(response.data);
      } else {
        // Fallback: sort sample vehicles by date
        const sorted = [...sampleVehicles].sort((a, b) => {
          const dateA = new Date(a.first_registration_date.split('-').reverse().join('-'));
          const dateB = new Date(b.first_registration_date.split('-').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
        setAllVehicles(sorted.slice(0, 8));
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      const sorted = [...sampleVehicles].sort((a, b) => {
        const dateA = new Date(a.first_registration_date.split('-').reverse().join('-'));
        const dateB = new Date(b.first_registration_date.split('-').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
      setAllVehicles(sorted.slice(0, 8));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <SEO
        title="Auto Usate Italia | Concessionaria AutoAndrew - Veicoli Garantiti"
        description="Concessionaria auto usate in Italia. Scopri veicoli selezionati, garantiti e controllati. Prezzi competitivi, finanziamenti e permute. Trova l'auto perfetta per te."
        keywords="auto usate Italia, concessionaria auto usate, vendita auto garantite, automobili usate certificate, auto km 0, veicoli occasione Italia"
        url="/"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <Header />
      <HeroSection />
      <LatestArrivals vehicles={allVehicles} isLoading={isLoading} />
      <TestimonialsSection />
      <TrustSection />
      <ServicesSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

Index.displayName = "Index";

export default Index;
