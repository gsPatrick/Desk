'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './ImpactSection.module.css';

export default function ImpactSection() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

    return (
        <section ref={containerRef} className={styles.impact}>
            <div className={styles.container}>
                {/* Background numbers 4 - 4 */}
                <div className={styles.bgNumberWrapper}>
                    <motion.div style={{ y: yLeft }} className={styles.bgNumber}>4</motion.div>
                    <motion.div style={{ y: yRight }} className={styles.bgNumber}>4</motion.div>
                </div>

                <div className={styles.grid}>
                    {/* Left Column */}
                    <motion.div
                        className={styles.column}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h3 className={styles.subtitle}>ESTRATÉGIA DE VALOR</h3>
                        <p className={styles.text}>
                            Não entrego apenas código, construo **ativos digitais**. Minha abordagem une análise de mercado e UX para transformar sua visão em uma ferramenta poderosa de conversão e lucro.
                        </p>
                    </motion.div>

                    {/* Center Column: Avatar Video */}
                    <motion.div
                        className={styles.avatarWrapper}
                        style={{ scale }}
                    >
                        <div className={styles.videoPlaceholder}>
                            <div className={styles.glow} />
                            {isMobile ? (
                                <img
                                    key="gif-avatar"
                                    src="/patrikc-confident.gif"
                                    className={styles.video}
                                    style={{ filter: 'none' }}
                                    alt="Patrick Confiante"
                                />
                            ) : (
                                <video
                                    key="video-avatar"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={styles.video}
                                    style={{ filter: 'none' }}
                                    src="/patrick-confident.webm"
                                />
                            )}
                            <div className={styles.videoOverlay}>
                                <span>PATRICK.DEVELOPER</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        className={styles.column}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    >
                        <h3 className={styles.subtitle}>EXECUÇÃO DE ELITE</h3>
                        <p className={styles.text}>
                            Performance brutal e estética premium. Utilizo o que há de mais moderno em **Next.js e IA** para criar experiências fluidas que prendem a atenção do primeiro ao último pixel.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
