'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaFileDownload } from 'react-icons/fa';
import styles from './Hiring.module.css';

export default function Hiring() {
    return (
        <section className={styles.hiring} id="hiring">
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.label}>EMPRESAS & RECRUTADORES</span>
                    <h2 className={styles.title}>
                        BUSCANDO UM DEVELOPER
                        <span>DE ALTA PERFORMANCE?</span>
                    </h2>
                    <p className={styles.description}>
                        Disponível para projetos estratégicos ou posições full-time em times de elite.
                        Especialista em arquitetura Next.js/Java com foco em escalabilidade e UI proprietária.
                    </p>

                    <div className={styles.actions}>
                        <motion.a
                            href="/CV_Patrick_Gomes_Siqueira_PT_Final.pdf"
                            download
                            className={styles.cvBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaFileDownload style={{ marginRight: '10px' }} />
                            DOWNLOAD CV (PTBR)
                        </motion.a>

                        <motion.a
                            href="/CV_Patrick_Gomes_Siqueira_EN_Final.pdf"
                            download
                            className={styles.cvBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaFileDownload style={{ marginRight: '10px' }} />
                            DOWNLOAD CV (EN)
                        </motion.a>

                        <motion.a
                            href="mailto:patricksiqueira.developer@gmail.com"
                            className={styles.mailBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaEnvelope style={{ marginRight: '10px' }} />
                            patricksiqueira.developer@gmail.com
                        </motion.a>

                        <motion.a
                            href="https://wa.me/5571982862912?text=Olá Patrick, vi seu portfólio e gostaria de conversar sobre uma oportunidade!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaWhatsapp style={{ marginRight: '10px' }} />
                            CHAMAR NO WHATSAPP
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
