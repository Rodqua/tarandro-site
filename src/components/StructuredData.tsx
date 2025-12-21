export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Tarandro",
    description:
      "Expert en accompagnement qualité (certifications ISO, HAS, PSAD) et formation professionnelle (bureautique, SST)",
    url: "https://tarandro.org",
    logo: "https://tarandro.org/icon.svg",
    image: "https://tarandro.org/og-image.jpg",
    telephone: "+33633289161",
    email: "contact@tarandro.org",
    address: {
      "@type": "PostalAddress",
      streetAddress: "17 Avenue de Caen",
      addressLocality: "Caen",
      postalCode: "14000",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "49.1829",
      longitude: "-0.3707",
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: ["https://www.linkedin.com/company/tarandro"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services Tarandro",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Certification ISO",
            description:
              "Accompagnement à la certification ISO (ISO 9001, ISO 14001, ISO 45001)",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Certification HAS",
            description:
              "Accompagnement à la certification Haute Autorité de Santé",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PSAD",
            description: "Plan de Sécurité et d'Analyse des Dangers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Formation Bureautique",
            description:
              "Formations Microsoft Office, Google Workspace, Excel, Word, PowerPoint",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Formation SST",
            description: "Formation Sauveteur Secouriste du Travail certifiée",
          },
        },
      ],
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Tarandro",
    description:
      "Cabinet de conseil en qualité et organisme de formation professionnelle",
    url: "https://tarandro.org",
    telephone: "+33633289161",
    email: "contact@tarandro.org",
    address: {
      "@type": "PostalAddress",
      streetAddress: "17 Avenue de Caen",
      addressLocality: "Caen",
      postalCode: "14000",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "49.1829",
      longitude: "-0.3707",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://tarandro.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://tarandro.org/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Contact",
        item: "https://tarandro.org/contact",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
