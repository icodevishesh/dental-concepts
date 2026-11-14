import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const SITE_URL = process.env.SITE_URL || "https://dentalconceptssf.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dental Laboratory in San Francisco, USA | Dental Concepts",
  description:
    "Partner with a San Francisco dental lab for ceramic crowns, implant restorations, digital planning, and custom shade matching. Connect with our dental laboratory team.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Dental Concepts",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        {/* Google tag (gtm.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5HHPV6HW"
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/features.css" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="home">
        <ScrollToTop />
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <Script src="/app.js" strategy="afterInteractive" />
        <Script src="/features.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
