'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './HeroVid.module.css';

export default function HeroVid() {
    const videoRefA = useRef(null);
    const videoRefB = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeVideo, setActiveVideo] = useState('A');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const activeElement = activeVideo === 'A' ? videoRefA.current : videoRefB.current;
        if (activeElement && activeElement.paused && !isTransitioning) {
            activeElement.play().catch(e => console.log("Initial play blocked", e));
        }
    }, [isMobile, activeVideo, isTransitioning]);

    useEffect(() => {
        if (isMobile) return;

        const videoA = videoRefA.current;
        const videoB = videoRefB.current;

        const handleTimeUpdate = () => {
            const currentVideo = activeVideo === 'A' ? videoA : videoB;
            const nextVideo = activeVideo === 'A' ? videoB : videoA;

            if (currentVideo && nextVideo && !isTransitioning) {
                // Iniciar cross-fade 1.5 segundos antes do fim
                if (currentVideo.currentTime > currentVideo.duration - 1.5) {
                    setIsTransitioning(true);
                    nextVideo.currentTime = 0;
                    nextVideo.play().then(() => {
                        // O fade acontece via CSS baseado na prop activeVideo e isTransitioning
                        setTimeout(() => {
                            setActiveVideo(activeVideo === 'A' ? 'B' : 'A');
                            setIsTransitioning(false);
                            currentVideo.pause();
                        }, 1000); // Duração do fade
                    }).catch(e => console.error("Video play failed", e));
                }
            }
        };

        const activeElement = activeVideo === 'A' ? videoA : videoB;
        if (activeElement) {
            activeElement.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (activeElement) {
                activeElement.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [activeVideo, isTransitioning, isMobile]);

    const videoSrc = "/patrick-hero.webm";

    return (
        <div className={styles.videoContainer}>
            {isMobile ? (
                <img
                    src="/patrick-hero.gif"
                    alt="Background Animation"
                    className={styles.video}
                    style={{ objectFit: 'cover' }}
                />
            ) : (
                <>
                    <video
                        ref={videoRefA}
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        className={`${styles.video} ${activeVideo === 'A' ? styles.active : styles.inactive}`}
                        src={videoSrc}
                    />
                    <video
                        ref={videoRefB}
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        className={`${styles.video} ${activeVideo === 'B' ? styles.active : styles.inactive}`}
                        src={videoSrc}
                    />
                </>
            )}
            <div className={styles.overlay} />
        </div>
    );
}
