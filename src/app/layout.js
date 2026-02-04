import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Patrick Gomes Siqueira | Patrick.Developer | Desenvolvedor Full Stack & CNPJ",
  description: "Portfólio oficial de Patrick Gomes Siqueira (Patrick Dev). Especialista Full Stack (Next.js, React, Node). Soluções de alta performance para empresas (Patrick.Developer CNPJ).",
  keywords: [
    "Patrick Siqueira",
    "Patrick Gomes Siqueira",
    "Patrick Dev",
    "Patrick Desenvolvedor",
    "CodeByPatrick",
    "Patrick.Developer",
    "Desenvolvedor Full Stack",
    "Programador Next.js",
    "Auttoma",
    "Tersio Idbas",
    "G5 Futebol",
    "Kajoi",
    "Blendskin",
    "Super Odds"
  ],
  authors: [{ name: "Patrick Gomes Siqueira", url: "https://www.codebypatrick.dev" }],
  creator: "Patrick Gomes Siqueira",
  publisher: "Patrick.Developer",
  openGraph: {
    title: "Patrick Gomes Siqueira | Patrick.Developer",
    description: "Desenvolvimento de software de elite. Interfaces cinematográficas e sistemas robustos. Contrate Patrick Siqueira (CNPJ).",
    url: "https://www.codebypatrick.dev",
    siteName: "CodeByPatrick",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://www.codebypatrick.dev/og-image.png", // Ensure you have an OG image eventually
        width: 1200,
        height: 630,
        alt: "Patrick.Developer Portfolio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.codebypatrick.dev',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png', // Assuming you'll have a logo.png, Google loves this for mobile results
  },
  verification: {
    google: '78_G3RXc60vhuNH3nCPFAUSBmvvAwFFhCdDF7qvPeZ8',
  },
  manifest: '/manifest.json',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.codebypatrick.dev/#person",
      "name": "Patrick Gomes Siqueira",
      "url": "https://www.codebypatrick.dev",
      "alternateName": ["Patrick Dev", "Patrick Siqueira", "CodeByPatrick"],
      "jobTitle": "Senior Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Patrick.Developer"
      },
      "sameAs": [
        "https://github.com/gsPatrick",
        "https://wa.me/5571982862912",
        "https://instagram.com/codebypatrick"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://www.codebypatrick.dev/#organization",
      "name": "Patrick.Developer",
      "legalName": "Patrick.Developer Soluções em Tecnologia",
      "url": "https://www.codebypatrick.dev",
      "logo": "https://www.codebypatrick.dev/logo.png",
      "taxID": "58.315.507/0001-14",
      "founder": {
        "@id": "https://www.codebypatrick.dev/#person"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-71-98286-2912",
        "contactType": "sales",
        "areaServed": "BR",
        "availableLanguage": ["Portuguese", "English"]
      }
    },
    {
      "@type": "ItemList",
      "@id": "https://www.codebypatrick.dev/#projects",
      "name": "Projetos Desenvolvidos por Patrick Siqueira",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "name": "Auttoma",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "author": { "@id": "https://www.codebypatrick.dev/#person" }
        },
        {
          "@type": "SoftwareApplication",
          "name": "Tersio Idbas",
          "applicationCategory": "LegalApplication",
          "operatingSystem": "Web",
          "author": { "@id": "https://www.codebypatrick.dev/#person" }
        },
        {
          "@type": "SoftwareApplication",
          "name": "G5 Futebol",
          "applicationCategory": "SportsApplication",
          "operatingSystem": "Web",
          "author": { "@id": "https://www.codebypatrick.dev/#person" }
        },
        {
          "@type": "SoftwareApplication",
          "name": "Super Odds",
          "applicationCategory": "SportsApplication",
          "operatingSystem": "Web",
          "author": { "@id": "https://www.codebypatrick.dev/#person" }
        }
      ]
    }
  ]
};

import Header from "@/Components/Layout/Header/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main id="content-root">
          {children}
        </main>
      </body>
    </html>
  );
}
