import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
import { company } from "@/data/company";
import { CookieConsent, Footer, Header, WhatsAppFloat } from "@/components/site/Chrome";

const title = "Glassmaxi Indústria | Vidros temperados, laminados e especiais em Fortaleza";
const description =
  "Indústria de beneficiamento de vidros em Fortaleza, Ceará: temperados, laminados, fachadas e projetos especiais. Explore os produtos em 3D e monte seu orçamento.";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: title, template: "%s | Glassmaxi" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Glassmaxi Indústria", title, description, url: "/", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Glassmaxi Indústria" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: "#122366", width: "device-width", initialScale: 1 };

const a = company.address;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${company.siteUrl}/#empresa`,
  name: company.fullName,
  url: company.siteUrl,
  logo: `${company.siteUrl}/brand/glassmaxi-logo-azul.png`,
  image: `${company.siteUrl}/og.png`,
  description,
  telephone: company.phone.number,
  email: company.email,
  address: { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city, addressRegion: a.state, postalCode: a.zip, addressCountry: "BR" },
  geo: { "@type": "GeoCoordinates", latitude: a.geo.lat, longitude: a.geo.lng },
  openingHours: company.hours.schema,
  areaServed: [{ "@type": "City", name: "Fortaleza" }, { "@type": "AdministrativeArea", name: "Ceará" }, { "@type": "AdministrativeArea", name: "Região Nordeste" }],
  sameAs: [company.instagram.url],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  );
}
