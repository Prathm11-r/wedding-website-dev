import type { PageSectionModel } from "@/types/builder";

export interface TemplateModel {
  id: string;
  name: string;
  vibe: string;
  category: "Estate" | "Garden" | "Editorial" | "Coastal" | "Modern";
  description: string;
  coverImage: string;
  palette: string[];
  fonts: {
    display: string;
    body: string;
  };
  sampleCouple: string;
  sampleDate: string;
  sampleLocation: string;
  sections: PageSectionModel[];
}

export const TEMPLATES: TemplateModel[] = [
  {
    id: "chateau",
    name: "The Grand Château",
    vibe: "French Neoclassical & Champagne Gold",
    category: "Estate",
    description:
      "Playfair Display serifs, deckle-edge paper borders, and champagne gold foil accents designed for stately châteaux, European estates, and formal black-tie celebrations.",
    coverImage:
      "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
    palette: ["#C9A96E", "#F4EBD9", "#1C1C1C", "#FAF7F2"],
    fonts: {
      display: "Playfair Display",
      body: "Inter",
    },
    sampleCouple: "Geneviève & Julian",
    sampleDate: "Saturday, September 18, 2027",
    sampleLocation: "Château de Chantilly • Oise, France",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        sort_order: 0,
        is_visible: true,
        props: {
          headline: "Geneviève & Julian",
          subheadline: "Request the honour of your presence",
          date_text: "Saturday, September 18, 2027",
          location_text: "Château de Chantilly, France",
          image_url:
            "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
          cta_text: "RSVP With Pleasure",
          cta_link: "#rsvp",
        },
      },
      {
        id: "sec-countdown",
        type: "countdown",
        sort_order: 1,
        is_visible: true,
        props: {
          heading: "Counting Down The Moments",
          subheading: "Until we say I do",
          target_date: "2027-09-18T16:00:00.000Z",
        },
      },
      {
        id: "sec-story",
        type: "our_story",
        sort_order: 2,
        is_visible: true,
        props: {
          heading: "Our Love Story",
          subheading: "How forever began",
          body: "Our journey began on an autumn afternoon along the Seine in Paris. Through travels across five continents and quiet Sunday mornings over espresso, our devotion deepened into an enduring promise.",
          image_url:
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
          quote: "To love and be loved is to feel the sun from both sides.",
        },
      },
      {
        id: "sec-schedule",
        type: "schedule",
        sort_order: 3,
        is_visible: true,
        props: {
          heading: "Wedding Day Schedule",
          subheading: "Celebrate every milestone with us",
          events: [
            {
              id: "ev-1",
              title: "Sacred Ceremony & Vows",
              time: "4:00 PM",
              location: "The Formal Orangery",
              dress_code: "Black Tie",
            },
            {
              id: "ev-2",
              title: "Champagne & Caviar Reception",
              time: "5:30 PM",
              location: "The Grand Parterre Lawn",
              dress_code: "Black Tie",
            },
            {
              id: "ev-3",
              title: "Banquet & Midnight Revelry",
              time: "7:30 PM",
              location: "The Galerie des Cerfs",
              dress_code: "Black Tie",
            },
          ],
        },
      },
      {
        id: "sec-gallery",
        type: "gallery",
        sort_order: 4,
        is_visible: true,
        props: {
          heading: "Captured Moments",
          subheading: "Memories along our journey",
          images: [
            {
              id: "g1",
              url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
              caption: "Golden hour in Paris",
            },
            {
              id: "g2",
              url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
              caption: "The evening proposal",
            },
            {
              id: "g3",
              url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
              caption: "Champagne celebration",
            },
          ],
        },
      },
      {
        id: "sec-registry",
        type: "registry",
        sort_order: 5,
        is_visible: true,
        props: {
          heading: "Curated Gift Registry",
          subheading: "Your presence is our most cherished present",
          registries: [
            {
              id: "r1",
              name: "Amalfi Coast Honeymoon Voyage",
              url: "https://www.zola.com",
              description: "Cliffside dining and Mediterranean yachting fund.",
            },
            {
              id: "r2",
              name: "Williams Sonoma Heirloom Collection",
              url: "https://www.williams-sonoma.com",
              description: "Culinary copper and artisanal table settings.",
            },
          ],
        },
      },
      {
        id: "sec-rsvp",
        type: "rsvp",
        sort_order: 6,
        is_visible: true,
        props: {
          heading: "Celebrate With Us",
          subheading: "Kindly respond by August 1st, 2027",
          deadline_text: "August 1, 2027",
          allow_plus_ones: true,
          meal_options: [
            "Chilean Sea Bass & Caviar Velouté",
            "Truffle Morels & Forest Risotto (V)",
            "Prime Beef Tenderloin",
          ],
        },
      },
    ],
  },
  {
    id: "tuscan",
    name: "Tuscan Garden",
    vibe: "Olive Groves, Travertine & Cypress",
    category: "Garden",
    description:
      "Earthy sage botanicals, warm travertine textures, and relaxed romantic typography suited for vineyard gatherings, Italian villas, and outdoor sunset soirees.",
    coverImage:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    palette: ["#7A8F74", "#EAEFE6", "#1E241E", "#F5F7F3"],
    fonts: {
      display: "Playfair Display",
      body: "Inter",
    },
    sampleCouple: "Alessia & Matteo",
    sampleDate: "Sunday, June 14, 2027",
    sampleLocation: "Villa La Foce • Val d'Orcia, Tuscany",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        sort_order: 0,
        is_visible: true,
        props: {
          headline: "Alessia & Matteo",
          subheadline: "Under the Tuscan olive boughs",
          date_text: "Sunday, June 14, 2027",
          location_text: "Val d'Orcia, Tuscany, Italy",
          image_url:
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
          cta_text: "RSVP Now",
          cta_link: "#rsvp",
        },
      },
      {
        id: "sec-countdown",
        type: "countdown",
        sort_order: 1,
        is_visible: true,
        props: {
          heading: "Countdown to Tuscany",
          subheading: "Until we gather in the vineyards",
          target_date: "2027-06-14T17:00:00.000Z",
        },
      },
      {
        id: "sec-story",
        type: "our_story",
        sort_order: 2,
        is_visible: true,
        props: {
          heading: "Our Journey to Forever",
          subheading: "From Florence to Val d'Orcia",
          body: "What began as an afternoon in the Uffizi Gallery bloomed into a lifetime partnership. We invite you to join us where the rolling hills meet the Italian sun.",
          image_url:
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
          quote: "Love is the bridge between two hearts.",
        },
      },
      {
        id: "sec-schedule",
        type: "schedule",
        sort_order: 3,
        is_visible: true,
        props: {
          heading: "Celebration Itinerary",
          subheading: "A weekend of romance and revelry",
          events: [
            {
              id: "ev-1",
              title: "Welcome Pizza & Chianti Party",
              time: "6:00 PM (Friday)",
              location: "The Villa Courtyard",
              dress_code: "Italian Chic",
            },
            {
              id: "ev-2",
              title: "Sunset Ceremony",
              time: "5:00 PM (Saturday)",
              location: "The Cypress Avenue",
              dress_code: "Summer Cocktail Attire",
            },
            {
              id: "ev-3",
              title: "Al Fresco Dinner & Dancing",
              time: "7:00 PM (Saturday)",
              location: "The Olive Orchard",
              dress_code: "Cocktail",
            },
          ],
        },
      },
      {
        id: "sec-rsvp",
        type: "rsvp",
        sort_order: 4,
        is_visible: true,
        props: {
          heading: "Join Us in Tuscany",
          subheading: "Please respond by April 15, 2027",
          deadline_text: "April 15, 2027",
          allow_plus_ones: true,
          meal_options: ["Fresh Tagliolini with Truffles", "Pan-Seared Sea Bream", "Florentine Steak"],
        },
      },
    ],
  },
  {
    id: "noir",
    name: "Midnight Velvet",
    vibe: "Metropolitan Editorial & Liquid Gold",
    category: "Editorial",
    description:
      "Deep obsidian canvas, metallic gold foil typography, and high-fashion editorial layouts tailored for penthouse receptions, modern art museums, and evening black-tie galas.",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    palette: ["#ECC880", "#18171B", "#DFB76C", "#0A0A0C"],
    fonts: {
      display: "Playfair Display",
      body: "Inter",
    },
    sampleCouple: "Sienna & Alexander",
    sampleDate: "Friday, October 29, 2027",
    sampleLocation: "The Pierre Penthouse • Manhattan, New York",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        sort_order: 0,
        is_visible: true,
        props: {
          headline: "Sienna & Alexander",
          subheadline: "Black tie evening in Manhattan",
          date_text: "Friday, October 29, 2027",
          location_text: "The Pierre Penthouse • New York",
          image_url:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          cta_text: "RSVP Online",
          cta_link: "#rsvp",
        },
      },
      {
        id: "sec-countdown",
        type: "countdown",
        sort_order: 1,
        is_visible: true,
        props: {
          heading: "Countdown to Midnight",
          subheading: "Until we dance beneath the Manhattan skyline",
          target_date: "2027-10-29T19:00:00.000Z",
        },
      },
      {
        id: "sec-story",
        type: "our_story",
        sort_order: 2,
        is_visible: true,
        props: {
          heading: "A New York Love Story",
          subheading: "Two lives intertwined",
          body: "Under the glowing city lights of Manhattan, what started as a chance meeting at a gallery opening became our greatest adventure.",
          image_url:
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
          quote: "Together is our favorite place to be.",
        },
      },
      {
        id: "sec-rsvp",
        type: "rsvp",
        sort_order: 3,
        is_visible: true,
        props: {
          heading: "Join Us for Black Tie",
          subheading: "Kindly respond by September 15th, 2027",
          deadline_text: "September 15, 2027",
          allow_plus_ones: true,
          meal_options: ["Filet Mignon & Lobster", "Wild Mushroom Risotto", "Pan-Seared Halibut"],
        },
      },
    ],
  },
  {
    id: "riviera",
    name: "Côte d'Azur",
    vibe: "Mediterranean Azure & Deckle Ivory",
    category: "Coastal",
    description:
      "Sun-drenched Mediterranean coastal hues, maritime typography, and crisp breezy layouts ideal for seaside villas in Saint-Tropez, Amalfi, or Mallorca.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    palette: ["#4A7C8A", "#E4EFF2", "#1C2E33", "#F8FBFC"],
    fonts: {
      display: "Playfair Display",
      body: "Inter",
    },
    sampleCouple: "Camille & Sébastien",
    sampleDate: "Saturday, July 10, 2027",
    sampleLocation: "Hôtel du Cap-Eden-Roc • Antibes, France",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        sort_order: 0,
        is_visible: true,
        props: {
          headline: "Camille & Sébastien",
          subheadline: "A Mediterranean Celebration",
          date_text: "Saturday, July 10, 2027",
          location_text: "Antibes • French Riviera",
          image_url:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          cta_text: "Confirm Attendance",
          cta_link: "#rsvp",
        },
      },
      {
        id: "sec-countdown",
        type: "countdown",
        sort_order: 1,
        is_visible: true,
        props: {
          heading: "Counting Down to the Riviera",
          subheading: "Until we toast beside the Mediterranean sea",
          target_date: "2027-07-10T16:00:00.000Z",
        },
      },
      {
        id: "sec-rsvp",
        type: "rsvp",
        sort_order: 2,
        is_visible: true,
        props: {
          heading: "Celebrate on the Coast",
          subheading: "Please respond by May 1st, 2027",
          deadline_text: "May 1, 2027",
          allow_plus_ones: true,
          meal_options: ["Grilled Mediterranean Bass", "Provençal Ratatouille (V)", "Herb-Crusted Lamb"],
        },
      },
    ],
  },
  {
    id: "minimalist",
    name: "Modernist Atelier",
    vibe: "High-Fashion Editorial & Stark Monochromes",
    category: "Modern",
    description:
      "Minimalist architecture, ample whitespace, striking portrait framing, and modern typography curated for architectural loft spaces and contemporary design lovers.",
    coverImage:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    palette: ["#18181B", "#E4E4E7", "#71717A", "#FAFAFA"],
    fonts: {
      display: "Playfair Display",
      body: "Inter",
    },
    sampleCouple: "Elena & Marcus",
    sampleDate: "Saturday, November 20, 2027",
    sampleLocation: "The Glass Pavilion • London, UK",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        sort_order: 0,
        is_visible: true,
        props: {
          headline: "Elena & Marcus",
          subheadline: "Architectural & Contemporary Vows",
          date_text: "Saturday, November 20, 2027",
          location_text: "The Glass Pavilion • London",
          image_url:
            "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
          cta_text: "Submit RSVP",
          cta_link: "#rsvp",
        },
      },
      {
        id: "sec-rsvp",
        type: "rsvp",
        sort_order: 1,
        is_visible: true,
        props: {
          heading: "Celebrate With Us",
          subheading: "Kindly respond by October 1st, 2027",
          deadline_text: "October 1, 2027",
          allow_plus_ones: true,
          meal_options: ["Seasonal Degustation Course", "Plant-Based Tasting Menu"],
        },
      },
    ],
  },
];

export function getTemplateById(id: string): TemplateModel | undefined {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
