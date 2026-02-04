'use client';

import { motion } from 'framer-motion';
import styles from './RevealImage.module.css';

export default function RevealImage({ src, alt }) {
    return (
        <div className={styles.revealContainer}>
            <motion.div
                className={styles.mask}
                initial={{ y: '0%' }}
                whileInView={{ y: '-101%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.img
                src={src}
                alt={alt}
                className={styles.image}
                initial={{ scale: 1.4 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
}
