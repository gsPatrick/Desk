'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Contact.module.css';

export default function Contact() {
    const sectionRef = useRef(null);
    const { scrollYProgress: contactScroll } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const xPos = useTransform(contactScroll, [0, 1], ["-10%", "10%"]);

    const whatsappUrl = "https://wa.me/5571982862912?text=Olá Patrick, gostaria de conversar sobre um projeto!";

    return (
        <section ref={sectionRef} className={styles.contact} id="contact">
            <motion.div style={{ x: xPos }} className={styles.backgroundText}>CONTATO</motion.div>
            <div className={styles.backgroundGlow} />

            <div className={styles.container}>
                <motion.div
                    className={styles.mainTitleWrapper}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className={styles.ctaTitle}
                        variants={{
                            hidden: { y: 100, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
                        }}
                    >
                        VAMOS CRIAR
                    </motion.h2>
                    <motion.h2
                        className={styles.ctaTitleOutline}
                        variants={{
                            hidden: { y: 100, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] } }
                        }}
                    >
                        ALGO INCRÍVEL
                    </motion.h2>
                    <motion.h2
                        className={styles.ctaTitle}
                        variants={{
                            hidden: { y: 100, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }
                        }}
                    >
                        JUNTOS?
                    </motion.h2>
                </motion.div>

                <motion.div
                    className={styles.ctaActions}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappBtn}
                        whileHover={{ scale: 1.02, backgroundColor: '#00ff00' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        INICIAR CONVERSA NO WHATSAPP
                    </motion.a>
                    <p className={styles.ctaNote}>Resposta instantânea garantida</p>
                </motion.div>
            </div>
        </section>
    );
}
