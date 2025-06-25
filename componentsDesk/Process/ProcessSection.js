// componentsDesk/Process/ProcessSection.js (VERSÃO "FOCUS FLOW")

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { LightBulbIcon, PencilSquareIcon, CodeBracketSquareIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const processSteps = [
    { icon: LightBulbIcon, title: 'Imersão & Estratégia', description: 'Mergulhamos na sua visão para definir um plano de ação claro e focado em resultados.', color: '#0a0a0a' },
    { icon: PencilSquareIcon, title: 'Design & Prototipagem', description: 'Criamos interfaces intuitivas e experiências de usuário memoráveis que dão vida à sua ideia.', color: '#1a1a2e' },
    { icon: CodeBracketSquareIcon, title: 'Desenvolvimento Ágil', description: 'Com código limpo e tecnologias modernas, construímos um produto robusto e escalável.', color: '#16213e' },
    { icon: RocketLaunchIcon, title: 'Lançamento & Evolução', description: 'Acompanhamos o lançamento e analisamos dados para garantir crescimento e evolução contínua.', color: '#0f3460' },
];

const ProcessSection = () => {
    const sectionRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        const panels = gsap.utils.toArray(".process-panel");
        const sectionEl = sectionRef.current;
        
        // Animação da barra de progresso
        gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionEl,
                scrub: 1,
                start: "top top",
                end: "bottom bottom",
            }
        });

        // Animação dos painéis e mudança de cor de fundo
        panels.forEach((panel, i) => {
            ScrollTrigger.create({
                trigger: panel,
                start: "top top",
                pin: true, 
                pinSpacing: false,
                onEnter: () => gsap.to(sectionEl, { backgroundColor: processSteps[i].color, duration: 1, ease: 'power2.inOut' }),
                onEnterBack: () => gsap.to(sectionEl, { backgroundColor: processSteps[i].color, duration: 1, ease: 'power2.inOut' }),
            });

            // Animação de entrada do conteúdo de cada painel
            gsap.from(panel.querySelectorAll('.panel-content'), {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panel,
                    start: "top 70%",
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Garantir que a cor final permaneça
        ScrollTrigger.create({
            trigger: sectionEl,
            start: "bottom bottom",
            onEnter: () => gsap.to(sectionEl, { backgroundColor: processSteps[processSteps.length - 1].color, overwrite: 'auto' }),
        });

    }, []);

    return (
        <section ref={sectionRef} className="relative bg-dark-bg">
            {/* Barra de Progresso Fixa */}
            <div className="sticky top-0 left-0 w-full h-1.5 z-50">
                <div ref={progressRef} className="h-full w-full bg-dark-accent origin-left" style={{transform: 'scaleX(0)'}}></div>
            </div>

            {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <div key={index} className="process-panel h-screen w-full flex items-center justify-center relative overflow-hidden">
                        {/* Ícone gigante de fundo */}
                        <Icon className="absolute w-2/3 h-2/3 text-white/5 -z-10" />

                        <div className="panel-content text-center max-w-2xl mx-auto px-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-dark-accent mb-4">ETAPA {`0${index + 1}`}</h3>
                            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">{step.title}</h2>
                            <p className="mt-6 text-lg text-gray-300">{step.description}</p>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default ProcessSection;