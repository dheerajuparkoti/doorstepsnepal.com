interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Doorsteps Nepal",
    url: "https://www.doorstepsnepal.com",
    logo: "https://www.doorstepsnepal.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-9851407706",
      contactType: "customer service",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: [
      "https://www.facebook.com/doorstepsnepal",
      "https://www.instagram.com/doorstepsnepal",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Doorsteps Nepal",
    url: "https://www.doorstepsnepal.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.doorstepsnepal.com/services?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Doorsteps Nepal",
    description:
      "Connect with verified professionals for plumbing, electrical, cleaning, beauty, repairs and more. Quality home services in Nepal.",
    url: "https://www.doorstepsnepal.com",
    telephone: "+977-9851407706",
    email: "doorstepnepal@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.7172,
      longitude: 85.3240,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "21:00",
    },
    priceRange: "₨₨",
    areaServed: {
      "@type": "City",
      name: "Kathmandu",
    },
  };
}

export function serviceJsonLd(params: {
  name: string;
  description?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    image: params.image,
    url: params.url,
    provider: {
      "@type": "Organization",
      name: "Doorsteps Nepal",
      url: "https://www.doorstepsnepal.com",
    },
    areaServed: {
      "@type": "City",
      name: "Kathmandu",
    },
  };
}

export function personJsonLd(params: {
  name: string;
  description?: string;
  image?: string;
  url: string;
  jobTitle?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    description: params.description,
    image: params.image,
    url: params.url,
    jobTitle: params.jobTitle ?? "Service Professional",
    worksFor: {
      "@type": "Organization",
      name: "Doorsteps Nepal",
      url: "https://www.doorstepsnepal.com",
    },
  };
}

export function faqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
