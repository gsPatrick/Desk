'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './ImpactSection.module.css';

const PILLARS = [
    {
        index: '01',
        title: 'ESTRATÉGIA',
        text: 'Entendo o negócio antes do código. Cada decisão técnica nasce de um objetivo claro: resolver um problema real e gerar valor.',
    },
    {
        index: '02',
        title: 'EXECUÇÃO',
        text: 'Desenvolvo do front ao deploy com padrão de produção. Você recebe um produto completo, performático e pronto para escalar.',
    },
];

const METRICS = [
    { value: 'MAIS DE 60', label: 'Projetos entregues' },
    { value: 'Full Stack', label: 'Front · Back · DevOps' },
    { value: 'End to End', label: 'Do conceito ao deploy' },
];

const reveal = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function ImpactSection() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const videoScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.92, 1, 0.92]);
    const headlineY = useTransform(scrollYProgress, [0, 1], [30, -30]);

    return (
        <section ref={containerRef} className={styles.impact} id="about">
            <div className={styles.letterboxTop} aria-hidden="true" />
            <div className={styles.letterboxBottom} aria-hidden="true" />
            <div className={styles.filmGrain} aria-hidden="true" />
            <div className={styles.spotlight} aria-hidden="true" />

            <div className={styles.bgWord} aria-hidden="true">DEVELOPER</div>

            <div className={styles.container}>
                <motion.header
                    className={styles.headerBlock}
                    style={{ y: headlineY }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                >
                    <motion.span className={styles.eyebrow} variants={reveal} custom={0}>
                        Patrick Gomes Siqueira
                    </motion.span>
                    <motion.h2 className={styles.headline} variants={reveal} custom={0.1}>
                        QUEM ESTÁ POR TRÁS
                    </motion.h2>
                    <motion.h2 className={styles.headline} variants={reveal} custom={0.2}>
                        DO SEU PROJETO.
                    </motion.h2>
                    <motion.p className={styles.lead} variants={reveal} custom={0.35}>
                        Desenvolvedor Full Stack com CNPJ. Transformo ideias em produtos digitais
                        completos — da arquitetura ao pixel final.
                    </motion.p>
                </motion.header>

                <div className={styles.stage}>
                    <motion.aside
                        className={styles.pillar}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={reveal}
                        custom={0.2}
                    >
                        <span className={styles.pillarIndex}>{PILLARS[0].index}</span>
                        <h3 className={styles.pillarTitle}>{PILLARS[0].title}</h3>
                        <div className={styles.pillarLine} />
                        <p className={styles.pillarText}>{PILLARS[0].text}</p>
                    </motion.aside>

                    <motion.div
                        className={styles.avatarWrapper}
                        style={{ scale: videoScale }}
                        initial={{ opacity: 0, scale: 0.88 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.frameBarLeft} aria-hidden="true" />
                        <div className={styles.frameBarRight} aria-hidden="true" />

                        <div className={styles.videoFrame}>
                            {isMobile ? (
                                <img
                                    src="/patrikc-confident.gif"
                                    className={styles.video}
                                    alt="Patrick Siqueira — Desenvolvedor Full Stack"
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    className={styles.video}
                                    src="/patrick-confident.webm"
                                />
                            )}
                            <div className={styles.videoVignette} aria-hidden="true" />
                        </div>

                        <div className={styles.identityBadge}>
                            <span className={styles.badgeBrand}>PATRICK.DEVELOPER</span>
                            <span className={styles.badgeRole}>Sites · Sistemas · Produtos digitais</span>
                        </div>
                    </motion.div>

                    <motion.aside
                        className={`${styles.pillar} ${styles.pillarRight}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={reveal}
                        custom={0.3}
                    >
                        <span className={styles.pillarIndex}>{PILLARS[1].index}</span>
                        <h3 className={styles.pillarTitle}>{PILLARS[1].title}</h3>
                        <div className={styles.pillarLine} />
                        <p className={styles.pillarText}>{PILLARS[1].text}</p>
                    </motion.aside>
                </div>

                <motion.div
                    className={styles.metrics}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                    }}
                >
                    {METRICS.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            className={styles.metricItem}
                            variants={reveal}
                            custom={0.1 + i * 0.1}
                        >
                            <span className={styles.metricValue}>{metric.value}</span>
                            <span className={styles.metricLabel}>{metric.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
