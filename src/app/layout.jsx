import { Cinzel, Manrope, Marcellus } from "next/font/google";
import { brand } from "@/data/site";
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

// Marcellus and Cinzel give the SBFT wordmark its flared Roman capitals
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: `${brand.short} — ${brand.full}`,
    template: `%s · ${brand.short}`,
  },
  description:
    "Compare and secure personal, home, business and education loans from 17 partner banks and NBFCs, with one advisor from application to disbursal.",
};

// the site opens light regardless of the system setting, so the browser UI
// should match that rather than the visitor's OS preference
export const viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${manrope.variable} ${marcellus.variable} ${cinzel.variable} antialiased`}>
      <head>
        <ThemeScript />
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
