// componentsDesk/About/AboutSection.js

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutSection = () => {
  const imageRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateY = 20 * ((mouseX / rect.width) - 0.5);
    const rotateX = -20 * ((mouseY / rect.height) - 0.5);
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const technologies = [
    "React", "Next.js", "JavaScript (ES6+)", "TypeScript",
    "Tailwind CSS", "GSAP", "Framer Motion", "Node.js",
    "Vercel", "Git", "Figma", "PostgreSQL"
  ];

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Coluna da Imagem */}
          <motion.div
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transition: 'transform 0.2s ease-out'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-black/40">
              <Image
                src="/images/perfil.jpg" // Lembre-se de colocar sua foto aqui
                alt="Foto de Patrick Siqueira"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-dark-accent/30 rounded-2xl"></div>
            </div>
          </motion.div>

          {/* Coluna do Texto */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-light-text dark:text-dark-text">
              Minha Filosofia
            </motion.h2>

            <motion.p variants={itemVariants} className="mt-6 text-lg text-light-subtle dark:text-dark-subtle leading-relaxed">
              Acredito que a melhor tecnologia é aquela que se torna invisível, permitindo que a experiência do usuário seja fluida e intuitiva. Meu foco é escrever código limpo, performático e escalável, criando produtos digitais que não apenas funcionam, mas encantam.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10">
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">Ferramentas e Tecnologias:</h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    className="px-4 py-2 text-sm font-medium bg-dark-accent/10 text-dark-accent rounded-full"
                    whileHover={{ y: -2, scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;