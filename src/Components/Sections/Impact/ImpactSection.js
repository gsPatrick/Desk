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
                        <h3 className={styles.subtitle}>ESTRATÉGIA</h3>
                        <p className={styles.text}>
                            Não entrego apenas código. Entrego soluções que resolvem gargalos de negócio e potencializam a visão da sua marca.
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
                                    src="/patrikc-confident.gif"
                                    className={styles.video}
                                    alt="Patrick Confidente"
                                />
                            ) : (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={styles.video}
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
                        <h3 className={styles.subtitle}>EXECUÇÃO</h3>
                        <p className={styles.text}>
                            Alta performance e design cinemático. Cada pixel é pensado para prender a atenção e converter visitantes em clientes.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
