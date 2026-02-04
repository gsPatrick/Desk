'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import styles from './Footer.module.css';

const CONTACT_CARDS = [
    {
        name: 'LinkedIn',
        value: 'in/patrick-siqueira',
        url: 'https://linkedin.com/in/patrick-siqueira-2833a4264',
        color: '#0077B5'
    },
    {
        name: 'GitHub',
        value: 'gsPatrick',
        url: 'https://github.com/gsPatrick',
        color: '#333'
    },
    {
        name: 'WhatsApp',
        value: '+55 71 98286-2912',
        url: 'https://wa.me/5571982862912',
        color: '#25D366'
    },
    {
        name: 'E-mail',
        value: 'patrick@siqueira.dev',
        url: 'mailto:patrick@siqueira.dev',
        color: '#00ffff'
    }
];

const SocialIcons = () => (
    <div className={styles.socialIcons}>
        <a href="https://github.com/gsPatrick" target="_blank" rel="noopener noreferrer">
            <FaGithub size={20} />
        </a>
        <a href="https://linkedin.com/in/patrick-siqueira-2833a4264" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={20} />
        </a>
        <a href="https://wa.me/5571982862912" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={22} />
        </a>
    </div>
);

export default function Footer() {
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
        <footer className={styles.footer}>
            <div className={styles.bgVideo}>
                {isMobile ? (
                    <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnhhZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqZndqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlS8H4k5y_vD_S0/giphy.gif"
                        alt="Footer Animation"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }}
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
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-animation-of-white-moving-particles-on-black-background-41133-large.mp4" type="video/mp4" />
                    </video>
                )}
            </div>

            <div className={styles.top}>
                <div className={styles.ctaWrapper}>
                    <motion.h2
                        className={styles.cta}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        ENTRE EM <br /> CONTATO
                    </motion.h2>
                </div>

                <div className={styles.cardGrid}>
                    {CONTACT_CARDS.map((card, index) => (
                        <motion.a
                            key={card.name}
                            href={card.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                            whileHover={{ y: -5 }}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.cardName}>{card.name}</span>
                                <div className={styles.cardDot} style={{ backgroundColor: card.color }} />
                            </div>
                            <span className={styles.cardValue}>{card.value}</span>
                            <div className={styles.cardArrow}>→</div>
                        </motion.a>
                    ))}
                </div>
            </div>

            <div className={styles.bottom}>
                <SocialIcons />
                <div className={styles.legalInfo}>
                    <span className={styles.copyright}>© 2026 Patrick.Developer. Todos os direitos reservados.</span>
                    <span className={styles.cnpj}>CNPJ: 58.315.507/0001-14</span>
                </div>
            </div>
        </footer>
    );
}
