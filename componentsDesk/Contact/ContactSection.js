// componentsDesk/Contact/ContactSection.js (VERSÃO COM BOTÃO FINAL CORRIGIDO E ERRO DE PARSE CORRIGIDO)

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';

// Registra o plugin do GSAP se estiver no client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactLinks = [
  { icon: <EnvelopeIcon className="h-8 w-8" />, title: 'E-mail', handle: 'patricksiqueira.developer@gmail.com', href: 'mailto:patricksiqueira.developer@gmail.com' },
  { icon: <FaLinkedin className="h-8 w-8" />, title: 'LinkedIn', handle: '/in/patrick-siqueira-2833a4264', href: 'https://www.linkedin.com/in/patrick-siqueira-2833a4264/' },
  { icon: <FaGithub className="h-8 w-8" />, title: 'GitHub', handle: '/gsPatrick', href: 'https://github.com/gsPatrick' },
  { icon: <FaWhatsapp className="h-8 w-8" />, title: 'WhatsApp', handle: '+55 71 98286-2912', href: 'https://wa.me/5571982862912' },
];

const ContactSection = () => {
  const sectionRef = useRef(null);
  const spotlightRef = useRef(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // --- ANIMAÇÃO 1: TÍTULO CINÉTICO COM SCROLLTRIGGER ---
    const titleSpans = titleRef.current.querySelectorAll('span > span');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 60%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    });
    tl.from(titleSpans, {
      yPercent: 100,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });

    // --- ANIMAÇÃO 2: SPOTLIGHT E CARDS MAGNÉTICOS ---
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { top, left } = sectionEl.getBoundingClientRect();

      // Mover o Spotlight
      gsap.to(spotlightRef.current, {
        x: clientX - left,
        y: clientY - top,
        duration: 1.5,
        ease: 'power3.out',
      });

      // Mover os Cards (efeito magnético)
      cardRefs.current.forEach(card => {
        const { left: cardLeft, top: cardTop, width, height } = card.getBoundingClientRect();
        const cardCenterX = cardLeft + width / 2;
        const cardCenterY = cardTop + height / 2;

        const deltaX = clientX - cardCenterX;
        const deltaY = clientY - cardCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const maxDistance = 250;
        if (distance < maxDistance) {
          const pullFactor = 1 - (distance / maxDistance);
          gsap.to(card, {
            x: deltaX * 0.2 * pullFactor,
            y: deltaY * 0.2 * pullFactor,
            duration: 0.5,
            ease: 'power3.out',
          });
        } else {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRefs.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    };

    sectionEl.addEventListener('mousemove', handleMouseMove);
    sectionEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sectionEl.removeEventListener('mousemove', handleMouseMove);
      sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    // Seção adaptada para funcionar com ambos os temas
    <section ref={sectionRef} id="contact" className="relative min-h-screen w-full bg-light-surface dark:bg-dark-bg py-24 px-4 flex items-center justify-center overflow-hidden">
      
      {/* O Spotlight que segue o mouse */}
      <div ref={spotlightRef} className="pointer-events-none absolute -left-64 -top-64 h-[32rem] w-[32rem] rounded-full bg-light-accent/10 dark:bg-dark-accent/10 blur-3xl filter -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        {/* Título adaptado para funcionar com ambos os temas */}
        <h2 ref={titleRef} className="text-5xl md:text-6xl font-extrabold tracking-tighter text-light-text dark:text-dark-text">
          <span className="inline-block overflow-hidden"><span className="inline-block">Vamos</span></span>{' '}
          <span className="inline-block overflow-hidden"><span className="inline-block">Criar</span></span>{' '}
          <span className="inline-block overflow-hidden"><span className="inline-block text-light-accent dark:text-dark-accent">Algo</span></span>{' '}
          <span className="inline-block overflow-hidden"><span className="inline-block text-light-accent dark:text-dark-accent">Incrível</span></span>
        </h2>
        
        {/* Parágrafo adaptado para funcionar com ambos os temas */}
        <motion.p 
          className="mt-4 max-w-2xl mx-auto text-lg text-light-subtle dark:text-dark-subtle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          Estou sempre aberto a novas oportunidades e colaborações. Se você tem um projeto em mente ou apenas quer dizer olá, não hesite em me contatar.
        </motion.p>

        {/* Cards adaptados para funcionar com ambos os temas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {contactLinks.map((link) => (
            <motion.a
              ref={addToRefs}
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="group bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-black/10 dark:border-white/10 cursor-pointer text-left shadow-lg"
            >
              <div className="text-light-accent dark:text-dark-accent mb-4">
                {link.icon}
              </div>
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">{link.title}</h3>
              {/* MODIFICAÇÃO AQUI: Adicionado 'break-all' para o handle */}
              <p className="text-sm text-light-subtle dark:text-dark-subtle break-all">{link.handle}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className="mt-20"
        >
            {/* --- BOTÃO ATUALIZADO PARA SER IDÊNTICO AO DO HERO --- */}
            <a 
                href="mailto:patricksiqueira.developer@gmail.com"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full 
                         px-10 py-5 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105
                         bg-light-surface dark:bg-dark-accent
                         text-light-text dark:text-dark-text
                         shadow-xl shadow-light-accent/30 dark:shadow-lg dark:shadow-dark-accent/30"
            >
              <span className="absolute inset-0 -translate-x-full transform skew-x-[-20deg] 
                               bg-gradient-to-r from-transparent to-transparent 
                               transition-transform duration-700 group-hover:translate-x-full
                               via-black opacity-20
                               dark:via-white dark:opacity-15">
              </span>
              
              <span className="relative z-10 inline-flex items-center gap-x-3">
                Iniciar uma Conversa
                <EnvelopeIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;