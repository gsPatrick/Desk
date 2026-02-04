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
  title: "Patrick Siqueira | Patrick.Developer | Desenvolvedor Full Stack & CNPJ",
  description: "Especialista Full Stack Patrick Siqueira. Contrate como Pessoa Física ou Jurídica (Patrick.Developer CNPJ). Projetos de alta performance com Next.js, React e IA. CodeByPatrick.",
  keywords: ["Patrick Siqueira", "Patrick Dev", "Patrick.Developer", "CodeByPatrick", "Patrick Siqueira CNPJ", "Desenvolvedor Full Stack", "Freelance Developer"],
  authors: [{ name: "Patrick Siqueira" }],
  openGraph: {
    title: "Patrick Siqueira | Patrick.Developer Full Stack",
    description: "Transformando ideias em interfaces cinematográficas e sistemas robustos com a formalidade de uma empresa.",
    url: "https://codebypatrick.com",
    siteName: "CodeByPatrick",
    locale: "pt_BR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://codebypatrick.com/#person",
      "name": "Patrick Siqueira",
      "url": "https://codebypatrick.com",
      "sameAs": [
        "https://github.com/gsPatrick",
        "https://wa.me/5571982862912"
      ],
      "jobTitle": "Full Stack Developer"
    },
    {
      "@type": "Organization",
      "@id": "https://codebypatrick.com/#organization",
      "name": "Patrick.Developer",
      "url": "https://codebypatrick.com",
      "taxID": "CNPJ",
      "logo": "https://codebypatrick.com/logo.png"
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://codebypatrick.com/#service",
      "name": "Patrick.Developer | Consultoria de Software & CNPJ",
      "url": "https://codebypatrick.com",
      "telephone": "+5571982862912",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Brasil",
        "addressRegion": "BA"
      },
      "image": "https://codebypatrick.com/logo.png",
      "description": "Desenvolvimento de software de alta performance, Landing Pages cinematográficas e soluções Full Stack para empresas e pessoas físicas com emissão de Nota Fiscal."
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
