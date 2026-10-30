import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Dental Laboratory in San Francisco, USA | Dental Concepts",
  description:
    "Partner with a San Francisco dental lab for ceramic crowns, implant restorations, digital planning, and custom shade matching. Connect with our dental laboratory team.",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/apple-touch-icon.png",
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
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/features.css" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="home">
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <Script src="/app.js" strategy="afterInteractive" />
        <Script src="/features.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
