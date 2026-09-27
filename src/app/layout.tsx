import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://everafter.com"
  ),
  title: {
    default: "EverAfter — Beautiful Wedding Websites",
    template: "%s | EverAfter",
  },
  description:
    "Create a stunning, personalised wedding website in minutes. Share your story, manage RSVPs, and give your guests everything they need — all in one place.",
  keywords: [
    "wedding website",
    "wedding builder",
    "RSVP management",
    "wedding planning",
    "online invitations",
  ],
  authors: [{ name: "EverAfter" }],
  creator: "EverAfter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://everafter.com",
    siteName: "EverAfter",
    title: "EverAfter — Beautiful Wedding Websites",
    description:
      "Create a stunning, personalised wedding website in minutes. Share your story, manage RSVPs, and give your guests everything they need.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EverAfter — Beautiful Wedding Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EverAfter — Beautiful Wedding Websites",
    description:
      "Create a stunning, personalised wedding website in minutes.",
    images: ["/og-image.jpg"],
    creator: "@everafterhq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#C9A96E",
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, playfairDisplay.variable)}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          "selection:bg-primary/20 selection:text-primary-dark"
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
