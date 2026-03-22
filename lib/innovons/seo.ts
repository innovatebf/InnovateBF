export function needToStructuredData(need: {
  titre: string;
  slug: string;
  domaine: string;
  resume?: string;
  created_at: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: need.titre,
    description: need.resume ?? need.titre,
    datePublished: need.created_at,
    url: `https://innovatebf.org/fr/innovons/besoins/${need.slug}`,
    author: {
      "@type": "Organization",
      name: "InnovateBF",
    },
    publisher: {
      "@type": "Organization",
      name: "InnovateBF",
      logo: {
        "@type": "ImageObject",
        url: "https://innovatebf.org/images/logo.png",
      },
    },
    about: {
      "@type": "Thing",
      name: need.domaine,
    },
  };
}

export function callToStructuredData(call: {
  titre: string;
  domaine: string;
  description?: string;
  deadline: string;
  budget?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: call.titre,
    description: call.description ?? call.titre,
    endDate: call.deadline,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "InnovateBF",
      url: "https://innovatebf.org",
    },
    location: {
      "@type": "VirtualLocation",
      url: "https://innovatebf.org/fr/innovons/appels",
    },
    offers: call.budget
      ? {
          "@type": "Offer",
          price: call.budget,
          priceCurrency: "XOF",
        }
      : undefined,
  };
}

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "InnovateBF",
  url: "https://innovatebf.org",
  description:
    "Thinktank dédié à la promotion de la technologie endogène au Burkina Faso",
  foundingLocation: {
    "@type": "Place",
    name: "Burkina Faso",
  },
  sameAs: [
    "https://github.com/innovatebf",
  ],
};
