// componentsDesk/Professional/ProfessionalSection.js (VERSÃO "MAGNETIC PILLARS")

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { DocumentTextIcon, BuildingOffice2Icon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Componente para um único pilar de benefício, agora com lógica magnética
const BenefitPillar = ({ benefit }) => {
  const pillarRef = useRef(null);

  // Valores de movimento do Framer Motion para x e y
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Aplica uma animação de mola (spring) aos valores de movimento
  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!pillarRef.current) return;
    const rect = pillarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calcula a distância do centro do pilar para o mouse
    const distanceX = (mouseX - rect.width / 2) * 0.1;
    const distanceY = (mouseY - rect.height / 2) * 0.1;
    
    // Atualiza os valores de movimento
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    // Reseta os valores ao afastar o mouse
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={pillarRef}
      className="benefit-card h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }} // Aplica os valores suavizados
    >
      <div className="gradient-border-container rounded-3xl h-full shadow-xl shadow-black/20">
        <div className="relative bg-light-surface/80 dark:bg-dark-surface/50 rounded-3xl p-8 h-full flex flex-col items-center text-center">
          <div className="flex-shrink-0 bg-light-text/5 dark:bg-dark-text/10 p-4 rounded-full mb-6">
            {benefit.icon}
          </div>
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{benefit.title}</h3>
          <p className="mt-2 text-light-subtle dark:text-dark-subtle">{benefit.description}</p>
        </div>
        <div className="gradient-border-bg rounded-3xl"></div>
      </div>
    </motion.div>
  );
};


const ProfessionalSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.to('.main-title-reveal', {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.2
    });

    tl.from('.benefit-card', {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out'
    }, "-=0.5");
    
    return () => {
        if(tl) tl.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  }, []);

  const CustomIcon = ({ iconType: Icon }) => (
    <Icon className="h-8 w-8 text-light-text dark:text-dark-text" />
  );
  
  const benefits = [
    { icon: <CustomIcon iconType={BuildingOffice2Icon} />, title: 'Estrutura Empresarial', description: 'Como Patrick.Developer (CNPJ), ofereço a formalidade de uma empresa, adaptando-me às necessidades do seu negócio.' },
    { icon: <CustomIcon iconType={DocumentTextIcon} />, title: 'Nota Fiscal Disponível', description: 'Para atender às exigências fiscais da sua empresa, a emissão de Nota Fiscal (NF-e) está disponível para todos os projetos.' },
    { icon: <CustomIcon iconType={WrenchScrewdriverIcon} />, title: 'Contratos Flexíveis', description: 'Podemos formalizar nossa parceria através de um contrato de serviço, garantindo clareza e segurança para ambas as partes.' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-24 sm:py-32">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-20">
          <div className="overflow-hidden"><h2 className="main-title-reveal text-reveal-mask text-4xl sm:text-5xl font-extrabold tracking-tighter text-light-text dark:text-dark-text" style={{transform: 'translateY(100%)'}}>Parceria Flexível e Profissional</h2></div>
          <div className="overflow-hidden mt-2"><p className="main-title-reveal text-reveal-mask text-lg text-light-subtle dark:text-dark-subtle" style={{transform: 'translateY(100%)'}}>Minha estrutura se adapta às suas necessidades, da agilidade de um freelancer à formalidade de uma empresa.</p></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitPillar key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSection;