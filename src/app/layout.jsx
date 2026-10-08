import { Cinzel, Manrope } from "next/font/google";
import { brand, contact, siteUrl } from "@/data/site";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Cinzel gives the SBFT wordmark its flared Roman capitals
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const description =
  "Compare and secure personal, home, business and education loans from 250+ partner banks and NBFCs, with one advisor from application to disbursal.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.full} (${brand.short}) — Loans from 250+ banks & NBFCs, Delhi`,
    template: `%s · ${brand.full}`,
  },
  description,
  applicationName: brand.full,
  keywords: [
    brand.full,
    "Shree Balaji Fintech",
    brand.short,
    "loan DSA Delhi",
    "personal loan",
    "home loan",
    "business loan",
    "loan against property",
    "Madhu Vihar",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: brand.full,
    title: brand.full,
    description,
  },
  robots: { index: true, follow: true },
  // Google Search Console's "HTML tag" check — set the code in Vercel's
  // environment variables; leave it unset if the domain is verified via DNS
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// tells Google who the business is and where it is, for the knowledge panel
// and local results
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: brand.full,
  alternateName: [brand.short, "Shree Balaji Fintech"],
  url: siteUrl,
  logo: `${siteUrl}/brand/bala-ji-logo.png`,
  image: `${siteUrl}/brand/bala-ji-logo.png`,
  telephone: contact.phoneHref.replace("tel:", ""),
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Madhu Vihar",
    addressLocality: "Delhi",
    postalCode: "110092",
    addressCountry: "IN",
  },
  areaServed: "IN",
};

// the site opens light regardless of the system setting, so the browser UI
// should match that rather than the visitor's OS preference
export const viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${manrope.variable} ${cinzel.variable} antialiased`}>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-on-saffron focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
