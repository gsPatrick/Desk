'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './HeroVid.module.css';

export default function HeroVid() {
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
        <div className={styles.videoContainer}>
            {isMobile ? (
                <img
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5O5S4SZM/giphy.gif"
                    alt="Background Animation"
                    className={styles.video}
                    style={{ objectFit: 'cover' }}
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
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-41131-large.mp4" type="video/mp4" />
                </video>
            )}
            <div className={styles.overlay} />
        </div>
    );
}
