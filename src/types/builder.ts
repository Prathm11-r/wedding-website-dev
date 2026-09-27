// ─────────────────────────────────────────────────────────────────────────────
// Page Builder Types & JSON Schemas
// ─────────────────────────────────────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "our_story"
  | "schedule"
  | "gallery"
  | "registry"
  | "rsvp"
  | "countdown"
  | "contact"
  | "text";

export interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  date_text?: string;
  location_text?: string;
  image_url?: string;
  overlay_opacity?: number; // 0 to 100
  cta_text?: string;
  cta_link?: string;
}

export interface OurStorySectionProps {
  heading: string;
  subheading?: string;
  body: string;
  image_url?: string;
  quote?: string;
}

export interface ScheduleEventItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description?: string;
  dress_code?: string;
}

export interface ScheduleSectionProps {
  heading: string;
  subheading?: string;
  events: ScheduleEventItem[];
}

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption?: string;
}

export interface GallerySectionProps {
  heading: string;
  subheading?: string;
  images: GalleryPhotoItem[];
}

export interface RegistryLinkItem {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export interface RegistrySectionProps {
  heading: string;
  subheading?: string;
  note?: string;
  registries: RegistryLinkItem[];
}

export interface RsvpSectionProps {
  heading: string;
  subheading?: string;
  deadline_text?: string;
  allow_plus_ones: boolean;
  meal_options: string[];
}

export interface CountdownSectionProps {
  heading: string;
  subheading?: string;
  target_date: string; // ISO string
}

export interface ContactSectionProps {
  heading: string;
  subheading?: string;
  email?: string;
  phone?: string;
  note?: string;
}

export interface TextSectionProps {
  heading?: string;
  body: string;
  align?: "left" | "center" | "right";
}

export type SectionPropsMap = {
  hero: HeroSectionProps;
  our_story: OurStorySectionProps;
  schedule: ScheduleSectionProps;
  gallery: GallerySectionProps;
  registry: RegistrySectionProps;
  rsvp: RsvpSectionProps;
  countdown: CountdownSectionProps;
  contact: ContactSectionProps;
  text: TextSectionProps;
};

export interface PageSectionModel<T extends SectionType = SectionType> {
  id: string;
  type: T;
  props: SectionPropsMap[T];
  sort_order: number;
  is_visible: boolean;
}

export interface WeddingPageModel {
  id: string;
  wedding_id: string;
  title: string;
  slug: string;
  is_home: boolean;
  is_published: boolean;
  sort_order: number;
  sections: PageSectionModel[];
}

// Default initial sections for freshly spawned wedding websites
export const DEFAULT_PAGE_SECTIONS: PageSectionModel[] = [
  {
    id: "sec-hero",
    type: "hero",
    sort_order: 0,
    is_visible: true,
    props: {
      headline: "Sarah & James",
      subheadline: "We're getting married!",
      date_text: "Saturday, June 19, 2027",
      location_text: "Napa Valley, California",
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
      heading: "Counting Down The Moments",
      subheading: "Until we say I do",
      target_date: "2027-06-19T16:30:00.000Z",
    },
  },
  {
    id: "sec-story",
    type: "our_story",
    sort_order: 2,
    is_visible: true,
    props: {
      heading: "Our Story",
      subheading: "How forever began",
      body: "We met on a crisp autumn evening in 2021. What began as a simple coffee conversation turned into hours of sharing dreams, passions, and laughter. Five years and countless adventures later, we cannot wait to begin this next chapter together.",
    },
  },
  {
    id: "sec-schedule",
    type: "schedule",
    sort_order: 3,
    is_visible: true,
    props: {
      heading: "Wedding Day Schedule",
      subheading: "Celebrate each moment with us",
      events: [
        {
          id: "ev-1",
          title: "Ceremony",
          time: "4:30 PM",
          location: "The Oak Meadow",
          description: "Please arrive 15 minutes early to be seated comfortably.",
          dress_code: "Black Tie Optional",
        },
        {
          id: "ev-2",
          title: "Cocktails & Canapés",
          time: "5:30 PM",
          location: "The Rose Garden Courtyard",
          description: "Enjoy sunset drinks and acoustic music.",
        },
        {
          id: "ev-3",
          title: "Dinner & Dancing",
          time: "7:00 PM",
          location: "The Grand Pavilion",
          description: "Speeches, formal dinner, cake cutting, and dance floor.",
        },
      ],
    },
  },
  {
    id: "sec-registry",
    type: "registry",
    sort_order: 4,
    is_visible: true,
    props: {
      heading: "Gift Registry",
      subheading: "Your presence is our favorite gift",
      note: "For friends and family who have expressed an interest in offering a gift to celebrate our marriage, we have curated registries below.",
      registries: [
        {
          id: "reg-1",
          name: "Crate & Barrel",
          url: "https://www.crateandbarrel.com",
          description: "Home essentials & dinnerware",
        },
        {
          id: "reg-2",
          name: "Honeymoon Adventure Fund",
          url: "https://www.travelersjoy.com",
          description: "Help us make unforgettable memories on our honeymoon in Italy",
        },
      ],
    },
  },
  {
    id: "sec-rsvp",
    type: "rsvp",
    sort_order: 5,
    is_visible: true,
    props: {
      heading: "Kindly RSVP",
      subheading: "Please respond by May 1st, 2027",
      deadline_text: "May 1, 2027",
      allow_plus_ones: true,
      meal_options: ["Filet Mignon", "Wild Mushroom Risotto (V)", "Pan-Seared Sea Bass"],
    },
  },
];
