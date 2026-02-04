'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './Capabilities.module.css';

export default function Capabilities() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    const categories = [
        {
            title: 'Front End',
            desc: 'Criação de interfaces de alto impacto, performáticas e acessíveis, priorizando a experiência do usuário.',
            techs: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'Tailwind']
        },
        {
            title: 'Back End',
            desc: 'Arquitetura de sistemas resilientes e APIs escaláveis que sustentam aplicações complexas.',
            techs: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'Redis']
        },
        {
            title: 'Dev Ops',
            desc: 'Automação, monitoramento e infraestrutura como código para garantir deploy contínuo e estabilidade.',
            techs: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Security']
        }
    ];

    const techMarquee = [
        'NEXT.JS', 'REACT', 'JAVA', 'SPRING BOOT', 'TYPESCRIPT', 'NODE.JS',
        'POSTGRESQL', 'DOCKER', 'AWS', 'REDIS', 'LINUX', 'CI/CD',
        'SEO', 'FRAMER MOTION', 'CSS MODULES', 'VITE', 'TAILWIND CSS',
        'HTML5', 'JAVASCRIPT', 'UI/UX', 'STRIPE', 'FIREBASE', 'GIT',
        'GITHUB', 'PYTHON', 'PHP', 'WORDPRESS', 'API', 'E-COMMERCE',
        'FULL STACK', 'POSTGRESQL', 'DASHBOARD'
    ];

    const containerVariants = {
        initial: { opacity: 0 },
        whileInView: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const titleVariants = {
        initial: { opacity: 0, y: 50 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 30 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <motion.section
            ref={sectionRef}
            className={styles.capabilities}
            id="capabilities"
            style={{ opacity, y }}
        >
            <div className={styles.transitionGradient} />
            <div className={styles.backgroundText}>SKILLS</div>
            <div className={styles.glow} />

            <div className={styles.content}>
                <motion.div
                    className={styles.titleWrapper}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2 className={styles.title} variants={titleVariants}>
                        CRIANDO EXPERIÊNCIAS
                    </motion.h2>
                    <motion.h2 className={styles.title} variants={titleVariants}>
                        DIGITAIS QUE
                    </motion.h2>
                    <motion.h2 className={styles.title} variants={titleVariants}>
                        CHAMAM A ATENÇÃO.
                    </motion.h2>
                </motion.div>

                {/* Marquee Row */}
                <div className={styles.marqueeContainer}>
                    <motion.div
                        className={styles.marquee}
                        animate={{ x: [0, -2000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    >
                        {techMarquee.concat(techMarquee).map((tech, i) => (
                            <span key={i} className={styles.marqueeItem}>{tech}</span>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.title}
                            className={styles.card}
                            variants={itemVariants}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.index}>0{index + 1}</span>
                                <h3 className={styles.label}>{cat.title}</h3>
                            </div>
                            <p className={styles.cardDesc}>{cat.desc}</p>
                            <div className={styles.tagGrid}>
                                {cat.techs.map(tech => (
                                    <span key={tech} className={styles.tag}>{tech}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.finalNote}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <p>SOU UM DESENVOLVEDOR <span>COMPLETO</span> COM FOCO EM <span>RESOLVER PROBLEMAS</span>.</p>
                </motion.div>
            </div>
        </motion.section>
    );
}
