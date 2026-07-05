'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Projects.module.css';
import PROJECTS from '@/data/projects.json';

const ease = [0.22, 1, 0.36, 1];

const INTRO_HEIGHT = { mobile: 55, desktop: 100 };
const PROJECT_HEIGHT = { mobile: 92, desktop: 100 };
const TAIL_HEIGHT = { mobile: 65, desktop: 100 };

function getScrollMetrics(total, isMobile) {
    const introHeight = isMobile ? INTRO_HEIGHT.mobile : INTRO_HEIGHT.desktop;
    const projectHeight = isMobile ? PROJECT_HEIGHT.mobile : PROJECT_HEIGHT.desktop;
    const tailHeight = isMobile ? TAIL_HEIGHT.mobile : TAIL_HEIGHT.desktop;

    const segmentHeights = isMobile
        ? [introHeight, ...Array.from({ length: total - 1 }, () => projectHeight), tailHeight]
        : [introHeight, ...Array.from({ length: total }, () => PROJECT_HEIGHT.desktop)];

    const totalScrollHeight = segmentHeights.reduce((sum, height) => sum + height, 0);

    let cumulative = 0;
    const segments = segmentHeights.map((height) => {
        const start = cumulative / totalScrollHeight;
        cumulative += height;
        return { start, end: cumulative / totalScrollHeight, step: height / totalScrollHeight };
    });

    return {
        introHeight,
        totalScrollHeight,
        introEnd: segments[0].end,
        projectRanges: segments.slice(1),
    };
}

function IntroContent({ lines, animateOnMount = false }) {
    return (
        <motion.div
            className={styles.textStack}
            initial="hidden"
            animate={animateOnMount ? 'visible' : undefined}
            whileInView={animateOnMount ? undefined : 'visible'}
            viewport={{ once: true }}
        >
            {lines.map((line) => (
                <div key={line.text} className={styles.line}>
                    {line.text.split('').map((char, i) => (
                        <motion.span
                            key={`${line.text}-${i}`}
                            variants={{
                                hidden: { y: '100%', opacity: 0 },
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        duration: 0.8,
                                        delay: line.delay + i * 0.03,
                                        ease,
                                    },
                                },
                            }}
                            style={{
                                display: 'inline-block',
                                whiteSpace: char === ' ' ? 'pre' : 'normal',
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
            ))}
        </motion.div>
    );
}

const ProjectCard = ({ project, index, scrollYProgress, total, isMobile, scrollMetrics }) => {
    const [viewMode, setViewMode] = useState('desktop');
    const videoRef = useRef(null);

    useEffect(() => {
        if (isMobile) setViewMode('mobile');
    }, [isMobile]);

    const currentUrl = viewMode === 'mobile' && project.urlMobile ? project.urlMobile : project.url;
    const currentType = viewMode === 'mobile' && project.typeMobile ? project.typeMobile : project.type;
    const currentPoster =
        viewMode === 'mobile' && project.posterMobile ? project.posterMobile : project.poster;

    const { introEnd, projectRanges } = scrollMetrics;
    const { start, end: nextStart, step: projectStep } = projectRanges[index] ?? projectRanges[0];
    const entranceRange = projectStep * 0.45;
    const isLast = index === total - 1;

    const yInput =
        isMobile && index === 0
            ? [introEnd, introEnd + entranceRange]
            : [Math.max(introEnd, start - entranceRange), start];

    const y = useTransform(scrollYProgress, yInput, ['100%', '0%']);

    const scale = useTransform(
        scrollYProgress,
        [nextStart - projectStep * 0.2, nextStart],
        [1, isLast || isMobile ? 1 : 0.94]
    );

    const cardOpacity = useTransform(scrollYProgress, (progress) => {
        if (isMobile && index === 0 && progress < introEnd) return 0;

        const fadeStart = nextStart - projectStep * 0.2;
        if (!isLast && !isMobile && progress > fadeStart) {
            const t = Math.min(1, (progress - fadeStart) / (projectStep * 0.2));
            return 1 - t * 0.65;
        }

        return 1;
    });

    const dimOverlay = useTransform(
        scrollYProgress,
        [nextStart - projectStep * 0.2, nextStart],
        [0, isLast || isMobile ? 0 : 0.6]
    );

    useEffect(() => {
        if (currentType !== 'video') return;

        let playTimeout;

        const handlePlayback = (progress) => {
            const margin = 0.04;
            const isActive = progress >= start - margin && progress < nextStart + margin;

            if (isActive) {
                if (videoRef.current?.paused) {
                    clearTimeout(playTimeout);
                    playTimeout = setTimeout(() => {
                        videoRef.current?.play().catch(() => {});
                    }, isMobile ? 500 : 1200);
                }
            } else if (videoRef.current && !videoRef.current.paused) {
                clearTimeout(playTimeout);
                videoRef.current.pause();
            }
        };

        handlePlayback(scrollYProgress.get());
        return scrollYProgress.on('change', handlePlayback);
    }, [scrollYProgress, start, nextStart, currentType, currentUrl, isMobile]);

    return (
        <motion.div
            className={styles.cardWrapper}
            style={{ y, scale, opacity: cardOpacity, zIndex: index }}
        >
            <motion.div className={styles.dimLayer} style={{ opacity: dimOverlay }} aria-hidden="true" />

            <div className={styles.card} style={{ backgroundColor: project.color }}>
                <span className={styles.mobileIndexBg} aria-hidden="true">
                    0{project.id}
                </span>

                <div className={styles.imageContainer}>
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={styles.mediaFrame}
                    >
                        {currentType === 'video' ? (
                            <video
                                key={currentUrl}
                                ref={videoRef}
                                muted
                                loop
                                playsInline
                                preload="none"
                                className={styles.image}
                                poster={currentPoster}
                                src={currentUrl}
                                style={{
                                    objectFit: project.objectFit || 'cover',
                                    objectPosition: project.objectPosition || 'center top',
                                }}
                            />
                        ) : (
                            <img
                                src={currentUrl}
                                alt={project.title}
                                className={styles.image}
                                loading="lazy"
                                style={{
                                    objectFit: project.objectFit || 'cover',
                                    objectPosition: project.objectPosition || 'center top',
                                }}
                            />
                        )}
                    </motion.div>
                    <div className={styles.overlay} />
                    <div className={styles.mobileMediaFade} aria-hidden="true" />
                </div>

                <div className={styles.info}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <span className={styles.number}>0{project.id}</span>
                            <span className={styles.mobileCounter}>
                                0{project.id} / 0{total}
                            </span>
                        </div>
                        <div className={styles.viewToggle}>
                            <button
                                type="button"
                                className={clsx(styles.toggleBtn, viewMode === 'desktop' && styles.active)}
                                onClick={() => setViewMode('desktop')}
                            >
                                Desktop
                            </button>
                            <button
                                type="button"
                                className={clsx(styles.toggleBtn, viewMode === 'mobile' && styles.active)}
                                onClick={() => setViewMode('mobile')}
                            >
                                Mobile
                            </button>
                        </div>
                    </div>

                    <span className={styles.mobileCategory}>{project.category}</span>
                    <h2 className={styles.title}>{project.title}</h2>
                    <p className={styles.description}>{project.description}</p>

                    <div className={styles.tags}>
                        <span className={styles.categoryTag}>{project.category}</span>
                        {project.tags?.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Projects() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    );

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const scrollMetrics = getScrollMetrics(PROJECTS.length, isMobile);
    const unit = isMobile ? 'svh' : 'vh';

    const introOpacity = useTransform(
        scrollYProgress,
        [0, scrollMetrics.introEnd * 0.55, scrollMetrics.introEnd],
        [1, 1, 0]
    );

    const lines = [
        { text: 'VEJA OS', delay: 0 },
        { text: 'PROJETOS', delay: 0.4 },
        { text: 'QUE REALIZEI', delay: 0.8 },
    ];

    return (
        <section
            ref={containerRef}
            className={styles.projects}
            id="work"
            style={{ height: `${scrollMetrics.totalScrollHeight}${unit}` }}
        >
            {!isMobile && (
                <div className={styles.introSection}>
                    <div className={styles.introGlow} />
                    <IntroContent lines={lines} />
                </div>
            )}

            <div className={styles.stickyContainer}>
                {isMobile && (
                    <motion.div
                        className={styles.introOverlay}
                        style={{ opacity: introOpacity }}
                        aria-hidden="true"
                    >
                        <div className={styles.introGlow} />
                        <IntroContent lines={lines} animateOnMount />
                    </motion.div>
                )}

                {PROJECTS.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        total={PROJECTS.length}
                        isMobile={isMobile}
                        scrollMetrics={scrollMetrics}
                    />
                ))}
            </div>
        </section>
    );
}
