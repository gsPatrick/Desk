// pages/dashboard.js (COMPLETO E RESPONSIVO)

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Header from '../componentsDesk/Header/Header'; // Ajuste se componentsDesk estiver em /src
import DeskWelcomeScreen from '../componentsDesk/DeskWelcome/DeskWelcomeScreen'; // Ajuste se componentsDesk estiver em /src
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import DeskHubScreen from '@/componentsDesk/DeskHub/DeskHubScreen';
import Footer from '@/componentsDesk/Footer/Footer.js';

// Dados do nosso sistema principal
const financeSystem = {
  id: 'finance-freelancer',
  name: 'FINANCE OS',
  heroTextLine1: "Organização",
  heroTextLine2: "financeira.",
  tagline: 'Sua liberdade financeira, simplificada e com estilo.',
  description: 
    'Assuma o controle total das suas finanças de freelancer com uma ferramenta que combina poder e design. Rastreie ganhos, despesas e projete seu futuro financeiro de forma clara e visualmente atraente.',
  imageHero: "/images/mao.png", // Certifique-se que esta imagem existe em public/images/
  mainTextColor: 'text-light-text dark:text-dark-text',
  accentColor1: 'text-pink-500', 
  accentColor2: 'text-green-500', // Verde para outros destaques, se necessário
  buttonBgColor: 'bg-pink-500 hover:bg-pink-600',
  buttonTextColor: 'text-white',
  link: '#', // Substitua pelo link real
};

// Componente para a seção de um sistema
const SystemSection = ({ system, isFirst }) => {
  const sectionRef = useRef(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768); // md breakpoint
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Animações ajustadas para responsividade
  const imageBaseY = isSmallScreen ? 20 : 50; // Menor deslocamento em telas pequenas
  const imageEndY = isSmallScreen ? -20 : -50;
  const imageScale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.85, 1, 0.95, 0.9]); // Mais sutil
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [imageBaseY, imageEndY]);

  const textBaseY = isSmallScreen ? 30 : 60;
  const text1Y = useTransform(scrollYProgress, [0.1, 0.4], [textBaseY, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9, 1], [0, 1, 1, 0]);
  
  const text2Y = useTransform(scrollYProgress, [0.15, 0.45], [textBaseY, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.15, 0.45, 0.9, 1], [0, 1, 1, 0]);
  
  const descY = useTransform(scrollYProgress, [0.25, 0.55], [textBaseY, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.25, 0.55, 0.9, 1], [0, 1, 1, 0]);

  const buttonY = useTransform(scrollYProgress, [0.35, 0.65], [textBaseY, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
        
        {/* Coluna do Texto */}
        <div className="w-full md:w-1/2 md:order-1 text-center md:text-left">
          <motion.div style={{ opacity: text1Opacity, y: text1Y }}>
            <h1 className={`text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black ${system.mainTextColor} tracking-tighter leading-none`}>
              {system.heroTextLine1}
            </h1>
          </motion.div>
          <motion.div style={{ opacity: text2Opacity, y: text2Y }}>
            <h1 className={`text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black ${system.accentColor1} tracking-tighter leading-none mt-1 mb-6 sm:mb-8`}>
              {system.heroTextLine2}
            </h1>
          </motion.div>
          
          <motion.p 
            className={`text-md sm:text-lg ${system.mainTextColor} opacity-80 dark:opacity-70 mb-8 sm:mb-10 max-w-md mx-auto md:mx-0 leading-relaxed`}
            style={{ opacity: descOpacity, y: descY }}
          >
            {system.description}
          </motion.p>

          <motion.div style={{ opacity: buttonOpacity, y: buttonY }}>
            <Link href={system.link} passHref legacyBehavior>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-x-2 px-6 py-3 sm:px-8 sm:py-3.5 text-base sm:text-md font-semibold ${system.buttonTextColor} ${system.buttonBgColor} rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg`}
              >
                Novidades em breve!
                <ArrowRightIcon className="h-5 w-5" />
              </a>
            </Link>
          </motion.div>
        </div>

        {/* Coluna da Imagem */}
        <motion.div
            className="w-4/5 sm:w-3/5 md:w-1/2 md:order-2 mt-10 md:mt-0" // Tamanho relativo e margem
            style={{ 
                scale: imageScale,
                opacity: imageOpacity,
                y: imageY 
            }}
        >
            <div className="relative w-full aspect-[1/1] max-w-[300px] sm:max-w-[350px] md:max-w-none mx-auto"> 
                <Image 
                    src={system.imageHero} 
                    alt="Ilustração do sistema Finance OS" 
                    layout="fill" 
                    objectFit="contain" 
                    priority={isFirst} 
                    className="drop-shadow-2xl"
                />
            </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Array de projetos/sistemas. Por agora, apenas o financeiro.
const projects = [financeSystem]; 

export default function DashboardPage() {
  const [bootComplete, setBootComplete] = useState(false);
  // Não precisamos mais do hubVisible separadamente se o conteúdo principal aparece após o boot
  // const [hubVisible, setHubVisible] = useState(false); 

  useEffect(() => {
    if (bootComplete) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden'; 
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [bootComplete]);

  return (
    <>
      <Head>
        <title>Desk OS | Patrick.Developer</title>
        <meta name="description" content="Acessando o centro de controle de soluções por Patrick Siqueira." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {bootComplete && <Header pageType="dashboard" />} 

      <main className="bg-light-bg dark:bg-dark-bg relative">
        <AnimatePresence>
          {!bootComplete && (
            <motion.div
              key="welcomeScreen"
              exit={{ opacity: 0, scale:0.98, y:-20, transition: { duration: 0.4, ease: 'circIn' } }}
            >
              <DeskWelcomeScreen onBootComplete={() => setBootComplete(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        {bootComplete && (
          // O DeskHubScreen e os Systems podem ser agrupados aqui se o DeskHub for uma introdução fixa
          // Para o seu pedido de "antes dos projetos", vamos colocar o DeskHubScreen aqui
          <>
            <motion.div // Wrapper para o DeskHubScreen ter sua própria animação de entrada
                key="deskHubContent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }} // Delay para aparecer após a welcome screen
            >
                <DeskHubScreen />
            </motion.div>

            <motion.div
              key="systemsContent"
              initial={{ opacity: 0 }} // Sistemas entram depois do Hub
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }} // Delay maior
            >
              {projects.map((system, index) => (
                <SystemSection 
                  key={system.id} 
                  system={system} 
                  isFirst={index === 0}
                />
              ))}
            </motion.div>
          </>
        )}
              <Footer />
      </main>

    </>
  );
}