import { Helmet } from "react-helmet-async";
import { Vehicle } from "@/data/sampleVehicles";

interface SchemaOrgProps {
  type: "Organization" | "WebSite" | "Product" | "ItemList" | "BreadcrumbList" | "FAQPage";
  data: Record<string, unknown>;
}

/**
 * Schema.org JSON-LD structured data component
 * Adds structured data to pages for better SEO and rich snippets
 */
export const SchemaOrg = ({ type, data }: SchemaOrgProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Organization schema for the dealership
 */
export const OrganizationSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  
  return (
    <SchemaOrg
      type="Organization"
      data={{
        name: "AutoAndrew",
        url: siteUrl,
        logo: `${siteUrl}/placeholder.svg`,
        description: "Concessionaria auto usate in Italia. Veicoli selezionati, garantiti e controllati.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IT",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["Italian", "English"],
        },
        sameAs: [
          // Add social media links if available
        ],
      }}
    />
  );
};

/**
 * WebSite schema with search action
 */
export const WebSiteSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  
  return (
    <SchemaOrg
      type="WebSite"
      data={{
        name: "AutoAndrew",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/listings?make={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
};

/**
 * Product schema for vehicle listings
 */
export const VehicleProductSchema = ({ vehicle }: { vehicle: Vehicle }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  const vehicleUrl = `${siteUrl}/vehicle/${vehicle.ad_number}`;
  const getImageUrl = (img: string) => {
    if (!img) return `${siteUrl}/placeholder.svg`;
    if (img.startsWith("http")) return img;
    return img.startsWith("/") ? `${siteUrl}${img}` : `${siteUrl}/${img}`;
  };
  const vehicleImage = vehicle.images && vehicle.images.length > 0 
    ? getImageUrl(vehicle.images[0])
    : `${siteUrl}/placeholder.svg`;
  
  // Extract year from first_registration_date
  const yearMatch = vehicle.first_registration_date?.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Format price
  const price = vehicle.price;
  const currency = "EUR";
  
  // Build product name
  const productName = `${vehicle.make} ${vehicle.model} ${vehicle.version || ""}`.trim();
  
  // Build description
  const description = vehicle.description 
    ? vehicle.description.substring(0, 500)
    : `${productName}. ${year ? `Anno ${year}` : ""}${vehicle.mileage ? `, ${vehicle.mileage}` : ""}${vehicle.fuel_type ? `, ${vehicle.fuel_type}` : ""}.`;
  
  // Extract mileage number
  const mileageNumber = vehicle.mileage 
    ? parseInt(vehicle.mileage.replace(/\D/g, "")) 
    : null;
  
  const schemaData: Record<string, unknown> = {
    name: productName,
    description: description,
    image: vehicleImage,
    brand: {
      "@type": "Brand",
      name: vehicle.make,
    },
    model: vehicle.model,
    category: vehicle.vehicle_category || "Used Car",
    offers: {
      "@type": "Offer",
      url: vehicleUrl,
      priceCurrency: currency,
      price: price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      availability: "https://schema.org/InStock",
      itemCondition: vehicle.vehicle_class === "Nuovo" 
        ? "https://schema.org/NewCondition"
        : vehicle.vehicle_class === "Km 0"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: vehicle.dealer_name || "AutoAndrew",
      },
    },
  };
  
  // Add vehicle-specific properties
  if (year) {
    schemaData.productionDate = `${year}-01-01`;
  }
  
  if (mileageNumber) {
    schemaData.mileageFromOdometer = {
      "@type": "QuantitativeValue",
      value: mileageNumber,
      unitCode: "KMT", // Kilometers
    };
  }
  
  if (vehicle.fuel_type) {
    schemaData.fuelType = vehicle.fuel_type;
  }
  
  if (vehicle.color) {
    schemaData.color = vehicle.color;
  }
  
  if (vehicle.power_cv) {
    schemaData.vehicleEngine = {
      "@type": "EngineSpecification",
      enginePower: {
        "@type": "QuantitativeValue",
        value: vehicle.power_cv,
        unitCode: "CV", // Horsepower
      },
    };
  }
  
  if (vehicle.gearbox) {
    schemaData.vehicleTransmission = vehicle.gearbox.includes("Automatico") || vehicle.gearbox.includes("Auto")
      ? "https://schema.org/AutomaticTransmission"
      : "https://schema.org/ManualTransmission";
  }
  
  // Add additional images
  if (vehicle.images && vehicle.images.length > 1) {
    schemaData.image = vehicle.images.slice(0, 5).map(img => getImageUrl(img)); // Limit to 5 images
  }
  
  return <SchemaOrg type="Product" data={schemaData} />;
};

/**
 * ItemList schema for vehicle listings page
 */
export const VehicleListSchema = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  
  const items = vehicles.slice(0, 20).map((vehicle) => ({
    "@type": "ListItem",
    position: vehicles.indexOf(vehicle) + 1,
    item: {
      "@type": "Product",
      name: `${vehicle.make} ${vehicle.model} ${vehicle.version || ""}`.trim(),
      url: `${siteUrl}/vehicle/${vehicle.ad_number}`,
      image: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: vehicle.price,
      },
    },
  }));
  
  return (
    <SchemaOrg
      type="ItemList"
      data={{
        name: "Auto Usate - Listino Veicoli",
        description: "Listino completo di auto usate selezionate e garantite",
        numberOfItems: vehicles.length,
        itemListElement: items,
      }}
    />
  );
};

/**
 * BreadcrumbList schema for navigation
 */
export const BreadcrumbSchema = ({ items }: { items: Array<{ name: string; url: string }> }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  
  const breadcrumbItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
  }));
  
  return (
    <SchemaOrg
      type="BreadcrumbList"
      data={{
        itemListElement: breadcrumbItems,
      }}
    />
  );
};

/**
 * FAQPage schema for FAQ pages
 */
export const FAQPageSchema = ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://autoandrew.it";
  
  return (
    <SchemaOrg
      type="FAQPage"
      data={{
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
};

