import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BridgeSection = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const phrase1Word1Ref = useRef(null);
  const phrase1Word2Ref = useRef(null);
  const phrase2Ref = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // ... o código do useEffect permanece exatamente o mesmo ...
    const sectionEl = sectionRef.current;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;
      gsap.to(backgroundRef.current, {
        x: xPercent * 50,
        y: yPercent * 30,
        duration: 1,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 40%',
        toggleActions: 'play none none reverse',
      }
    });

    entryTl.from([phrase1Word1Ref.current, phrase1Word2Ref.current], {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
      })
      .from(phrase2Ref.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
      }, "-=0.5")
      .add(() => {
        if (textContainerRef.current) {
          textContainerRef.current.classList.add('animated-gradient-text');
        }
      });

    const gradientAnimation = gsap.to('.animated-gradient-text', {
        backgroundPosition: '-200% center',
        ease: 'none',
        duration: 8,
        repeat: -1,
    });


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gradientAnimation.kill();
      if (entryTl) entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full flex items-center justify-center overflow-hidden bg-dark-bg py-24 sm:py-28 md:py-32 lg:py-40"
    >
      <div
        ref={backgroundRef}
        className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-dark-accent/10 via-dark-bg to-dark-bg rounded-full filter blur-3xl"
      />
      
      <div className="relative z-10 text-center w-full px-4">
        <h2 
          ref={textContainerRef}
          // A escala de fonte agora funciona perfeitamente com a palavra mais curta no mobile
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[8.5rem] font-black uppercase text-dark-text tracking-tighter leading-tight"
        >
          {/* --- ALTERAÇÃO PRINCIPAL AQUI --- */}
          <span ref={phrase1Word1Ref} className="inline-block">
            {/* Visível apenas em telas pequenas (mobile-first) */}
            <span className="inline-block sm:hidden">Criando</span>
            {/* Escondido em telas pequenas, visível a partir de `sm` */}
            <span className="hidden sm:inline-block">Transformando</span>
          </span>
          {/* ---------------------------------- */}

          <span ref={phrase1Word2Ref} className="inline-block ml-2 sm:ml-3 md:ml-5 text-dark-accent">Visão</span>
          
          <br/>
          
          <span ref={phrase2Ref} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light normal-case text-dark-subtle tracking-wider block mt-2 sm:mt-3 md:mt-4">
            em Realidade Digital.
          </span>
        </h2>
      </div>
    </section>
  );
};

export default BridgeSection;