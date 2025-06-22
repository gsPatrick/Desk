// componentsDesk/Projects/ProjectsSection.js (VERSÃO RESPONSIVA CORRIGIDA)

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import { projects } from './projectsData';
import ProjectCard from './ProjectCard';
import ExpandedCard from './ExpandedCard';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const [selectedId, setSelectedId] = useState(null);
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  
  const selectedProject = selectedId && projects.find(p => p.id === selectedId);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const horizontalScroll = gsap.to(horizontalTrackRef.current, {
        x: () => `-${horizontalTrackRef.current.scrollWidth - sectionRef.current.offsetWidth + 200}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${horizontalTrackRef.current.scrollWidth - sectionRef.current.offsetWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      const cards = gsap.utils.toArray('.project-card-wrapper');
      cards.forEach((card, index) => {
        const yPercent = index % 2 === 0 ? -10 : 5;
        gsap.to(card, {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            containerAnimation: horizontalScroll,
            trigger: card,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      });

      return () => {
        horizontalScroll.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden bg-light-bg dark:bg-dark-bg py-20 md:py-0">
      
      <div ref={triggerRef} className="h-auto md:h-[50vh]">
        
        {/* ----- AQUI ESTÁ A MUDANÇA ----- */}
        {/* 'sticky' e 'h-screen' agora são aplicados apenas em desktop (md:) */}
        <div className="md:sticky top-0 md:h-screen flex flex-col md:flex-row">
          
          {/* --- COLUNA 1: TEXTO --- */}
          <div className="w-full md:w-[30%] h-auto md:h-full flex flex-col justify-center px-6 md:px-12 py-16 md:py-0 text-center md:text-left z-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-light-text dark:text-dark-text">
              Projetos Selecionados
            </h2>
            <p className="mt-4 text-base md:text-lg text-light-subtle dark:text-dark-subtle max-w-md mx-auto md:mx-0">
              Uma amostra do meu trabalho. Clique em um projeto para inspecionar os detalhes e a tecnologia por trás.
            </p>
          </div>

          {/* --- COLUNA 2: GALERIA --- */}
          <div className="w-full md:w-[70%] h-full flex items-center md:overflow-x-hidden">
            
            <div ref={horizontalTrackRef} className="flex flex-col md:flex-row items-center md:items-start gap-12 px-6 md:px-0 md:pr-12 w-full md:w-auto">
              {projects.map((project) => (
                <div key={project.id} className="project-card-wrapper pt-0 md:pt-16"> 
                  <ProjectCard project={project} setSelectedId={setSelectedId} />
                </div>
              ))}
              <div className="hidden md:block flex-shrink-0 w-48"></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedId && <ExpandedCard project={selectedProject} setSelectedId={setSelectedId} />}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;