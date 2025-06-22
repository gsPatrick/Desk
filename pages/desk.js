// pages/desk.js

import Head from 'next/head';
import Header from '../componentsDesk/Header/Header.js';
import Hero from '../componentsDesk/Hero/Hero.js';
import ProjectsSection from '../componentsDesk/Projects/ProjectsSection.js';
import TransitionSection from '../componentsDesk/TransitionSection/TransitionSection.js';
import ContactSection from '../componentsDesk/Contact/ContactSection.js';
import AboutSection from '../componentsDesk/About/AboutSection.js'; 
import Footer from '@/componentsDesk/Footer/Footer.js';
import DeskPortalSection from '../componentsDesk/DeskPortal/DeskPortalSection.js'; // 1. Importar

export default function DeskPage() {
  return (
    <>
      <Head>
        <title>Patrick.Developer | Desenvolvedor Criativo</title>
        <meta name="description" content="Portfólio cinematográfico e centro de controle de projetos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* --- MUDANÇA AQUI --- */}
      {/* Usamos bg-light-surface para ter o fundo branco puro no tema claro */}
      <main className="bg-light-surface dark:bg-dark-bg">
        <Hero />
        <ProjectsSection />
        <TransitionSection />
        <AboutSection />
                <DeskPortalSection />

        <ContactSection />

      </main>
        <Footer />
    </>
  );
}