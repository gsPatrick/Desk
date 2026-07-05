'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import Character from './Character';

export default function Hero() {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section className={styles.hero}>
            <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <div className={styles.columnLeft}>
                    <motion.div className={styles.intro} variants={itemVariants}>
                        Olá, eu sou
                    </motion.div>

                    <div className={styles.nameStack}>
                        <motion.h1 className={styles.massiveText} variants={itemVariants}>
                            Patrick
                        </motion.h1>
                        <motion.h1 className={styles.massiveText} variants={itemVariants}>
                            Siqueira
                        </motion.h1>
                    </div>

                    <motion.h2 className={styles.roleTitle} variants={itemVariants}>
                        Desenvolvedor Full Stack
                    </motion.h2>
                </div>

                <div className={styles.columnRight}>
                    <Character />
                </div>
            </motion.div>
        </section>
    );
}
