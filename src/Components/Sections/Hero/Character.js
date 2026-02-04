'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import styles from './Character.module.css';

export default function Character() {
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay blocked:", error);
            });
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={styles.characterContainer}>
            <div className={styles.videoWrapper}>
                {isMobile ? (
                    <img
                        src="/patrick-hero.gif"
                        alt="Patrick Developer"
                        className={styles.video}
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        className={styles.video}
                        key="hero-video"
                    >
                        <source src="/patrick-hero.webm" type="video/webm" />
                        <source src="/patrick.mp4" type="video/mp4" />
                    </video>
                )}
            </div>
        </div>
    );
}
