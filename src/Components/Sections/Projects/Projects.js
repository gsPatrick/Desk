'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './Projects.module.css';
import PROJECTS from '@/data/projects.json';

const ProjectCard = ({ project, index, scrollYProgress, total }) => {
    const [viewMode, setViewMode] = useState('desktop');
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mobile detection for initial state/layout
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    // Determine current media based on viewMode and device
    const currentUrl = viewMode === 'mobile' && project.urlMobile ? project.urlMobile : project.url;
    const currentType = viewMode === 'mobile' && project.typeMobile ? project.typeMobile : project.type;

    // Dynamic increments based on number of projects
    const step = 1 / (total + 1);
    const start = isMobile ? (0.12 + index * 0.15) : (step + index * step);
    const nextStart = isMobile ? (0.12 + (index + 1) * 0.15) : (start + step);
    const entranceRange = isMobile ? 0.1 : step * 0.5;

    // Entrance: Linear y transform for Desktop only
    const y = useTransform(
        scrollYProgress,
        [Math.max(0, start - entranceRange), start],
        [isMobile ? "0%" : "100%", "0%"]
    );

    const isLast = index === total - 1;

    // Exit: Subtle scale for Desktop only
    const scaleTransform = useTransform(
        scrollYProgress,
        [nextStart - (step * 0.2), nextStart],
        [1, isLast ? 1 : 0.92]
    );
    const scale = isMobile ? 1 : scaleTransform;

    // Opacity based depth
    const cardOpacityTransform = useTransform(
        scrollYProgress,
        [nextStart - (step * 0.2), nextStart],
        [1, isLast || !isMobile ? 1 : 0.5]
    );
    const cardOpacity = isMobile ? 1 : cardOpacityTransform;

    // Filter
    const brightnessTransform = useTransform(
        scrollYProgress,
        [nextStart - (step * 0.2), nextStart],
        ["brightness(1)", isLast ? "brightness(1) " : "brightness(0.3)"]
    );
    const brightness = isMobile ? "none" : brightnessTransform;

    // Logic for playing video only when "parked"
    useEffect(() => {
        if (currentType !== 'video') return;

        let playTimeout;
        const handlePlayback = (progress) => {
            // Check if the card is in the active focus range
            const margin = isMobile ? 0.1 : 0.05;
            const isVisible = progress >= (start - margin) && progress < (nextStart + margin);

            if (isVisible) {
                // User is parked: wait 2.5s before playing
                if (videoRef.current && videoRef.current.paused) {
                    clearTimeout(playTimeout);
                    playTimeout = setTimeout(() => {
                        if (videoRef.current && videoRef.current.paused) {
                            videoRef.current.play().catch(() => { });
                        }
                    }, 2500); // 2.5 seconds delay
                }
            } else {
                // Scroll away: pause immediately
                clearTimeout(playTimeout);
                if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause();
                    // Optional: Reset to start to show "thumb" again
                    // videoRef.current.currentTime = 0; 
                }
            }
        };

        // Initial check
        handlePlayback(scrollYProgress.get());

        const unsubscribe = scrollYProgress.on("change", handlePlayback);
        return () => {
            unsubscribe();
            clearTimeout(playTimeout);
        };
    }, [scrollYProgress, start, nextStart, currentType, isMobile]);

    return (
        <motion.div
            className={styles.cardWrapper}
            initial={isMobile ? { opacity: 0, y: 50 } : {}}
            whileInView={isMobile ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
                y: isMobile ? 0 : y,
                scale,
                opacity: cardOpacity,
                filter: brightness,
                zIndex: index
            }}
        >
            <div className={styles.card} style={{ backgroundColor: project.color }}>
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
                                key={currentUrl} // Forces re-render when switching Desktop/Mobile
                                ref={videoRef}
                                muted
                                loop
                                playsInline
                                webkit-playsinline="true"
                                preload="none" // Optimization: We have a poster, so we don't need to load video immediately
                                className={styles.image}
                                poster={viewMode === 'mobile' && project.posterMobile ? project.posterMobile : project.poster}
                                src={currentUrl}
                                style={{
                                    objectFit: project.objectFit || 'cover',
                                    objectPosition: project.objectPosition || 'center center',
                                    opacity: 1, // Ensures visibility
                                    backgroundColor: '#000' // Fail-safe background
                                }}
                            />
                        ) : (
                            <img
                                src={currentUrl}
                                alt={project.title}
                                className={styles.image}
                                style={{
                                    objectFit: project.objectFit || 'cover',
                                    objectPosition: project.objectPosition || 'center center'
                                }}
                            />
                        )}
                    </motion.div>
                    <div className={styles.overlay} />
                </div>

                <div className={styles.info}>
                    <div className={styles.header}>
                        <span className={styles.number}>0{project.id}</span>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.toggleBtn} ${viewMode === 'desktop' ? styles.active : ''}`}
                                onClick={() => setViewMode('desktop')}
                            >
                                Desktop
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${viewMode === 'mobile' ? styles.active : ''}`}
                                onClick={() => setViewMode('mobile')}
                            >
                                Mobile
                            </button>
                        </div>
                    </div>

                    <h2 className={styles.title}>{project.title}</h2>
                    <p className={styles.description}>{project.description}</p>

                    <div className={styles.tags}>
                        <span className={styles.categoryTag}>{project.category}</span>
                        {project.tags && project.tags.map((tag, i) => (
                            <span key={i} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Projects() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const lines = [
        { text: "VEJA OS", type: "solid", delay: 0 },
        { text: "PROJETOS", type: "solid", delay: 0.4 },
        { text: "QUE REALIZEI", type: "outline", delay: 0.8 }
    ];

    return (
        <section
            ref={containerRef}
            className={styles.projects}
            id="work"
            style={{ height: `${(PROJECTS.length + 1) * 100}vh` }}
        >
            <div className={styles.introSection}>
                <div className={styles.introGlow} />
                <motion.div
                    className={styles.textStack}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {lines.map((line, lineIndex) => (
                        <div key={lineIndex} className={line.type === "solid" ? styles.line : styles.lineSub}>
                            {line.text.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: { y: "100%", opacity: 0 },
                                        visible: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: line.delay + (i * 0.03),
                                                ease: [0.22, 1, 0.36, 1]
                                            }
                                        }
                                    }}
                                    style={{
                                        display: 'inline-block',
                                        whiteSpace: char === " " ? 'pre' : 'normal'
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className={styles.stickyContainer}>
                {PROJECTS.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        total={PROJECTS.length}
                    />
                ))}
            </div>
        </section>
    );
}
