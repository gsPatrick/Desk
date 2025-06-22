// componentsDesk/Hero/Hero.js (VERSÃO FINAL COM ANIMAÇÃO GARANTIDA)

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { offsetLeft, offsetTop } = heroElement;
      
      gsap.to(glowRef.current, {
        x: clientX - offsetLeft,
        y: clientY - offsetTop,
        duration: 1.5,
        ease: 'power3.out',
      });
    };
    
    heroElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const headlineLine1 = "Design &";
  const headlineLine2 = "Tecnologia para a Web";
  const subheadline = "Construindo interfaces digitais que encantam usuários e impulsionam negócios.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.5 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };
  
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section 
      id="about" 
      ref={heroRef}
      className="relative flex items-center justify-center h-[85vh] md:min-h-screen text-center overflow-hidden px-4"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-64 -top-64 h-[32rem] w-[32rem] rounded-full bg-dark-accent/10 dark:bg-dark-accent/20 blur-3xl filter"
      />
      
      <motion.div
        className="z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-light-text dark:text-dark-text"
          aria-label={`${headlineLine1} ${headlineLine2}`}
        >
          <span className="block md:inline">
            {headlineLine1.split("").map((char, index) => (
              <motion.span key={`l1-${index}`} className="inline-block" variants={letterVariants}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
          <span className="hidden md:inline-block"> </span>
          <span className="block md:inline">
            {headlineLine2.split("").map((char, index) => (
              <motion.span key={`l2-${index}`} className="inline-block" variants={letterVariants}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p 
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-light-subtle dark:text-dark-subtle"
          variants={lineVariants}
        >
          {subheadline}
        </motion.p>
        
        <motion.div variants={lineVariants} className="mt-12">
          <Link href="#projects" passHref legacyBehavior>
            <motion.a
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full 
                         px-8 py-4 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-105
                         bg-light-surface dark:bg-dark-accent
                         text-light-text dark:text-dark-text
                         shadow-xl shadow-light-accent/30 dark:shadow-lg dark:shadow-dark-accent/30"
              whileTap={{ scale: 0.95 }}
            >
              {/* --- A CORREÇÃO FINAL E GARANTIDA ESTÁ AQUI --- */}
              <span className="absolute inset-0 -translate-x-full transform skew-x-[-20deg] 
                               bg-gradient-to-r from-transparent to-transparent 
                               transition-transform duration-700 group-hover:translate-x-full
                               
                               /* Tema Claro: Gradiente preto com 20% de opacidade */
                               via-black opacity-20
                               
                               /* Tema Escuro: Gradiente branco com 15% de opacidade */
                               dark:via-white dark:opacity-15">
              </span>
              
              <span className="relative z-10 inline-flex items-center gap-x-3">
                 Ver meus projetos
                 <ArrowDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
            </motion.a>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;