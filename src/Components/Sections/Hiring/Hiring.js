'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaFileDownload } from 'react-icons/fa';
import styles from './Hiring.module.css';

const ease = [0.22, 1, 0.36, 1];

const reveal = {
    hidden: { opacity: 0, y: 36 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, delay, ease },
    }),
};

export default function Hiring() {
    return (
        <section className={styles.hiring} id="hiring">
            <div className={styles.bgWord} aria-hidden="true">
                HIRING
            </div>
            <div className={styles.letterboxTop} aria-hidden="true" />
            <div className={styles.letterboxBottom} aria-hidden="true" />

            <div className={styles.container}>
                <motion.header
                    className={styles.header}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                >
                    <motion.span className={styles.eyebrow} variants={reveal} custom={0}>
                        Empresas · Recrutadores · Times de tech
                    </motion.span>

                    <div className={styles.titleGroup}>
                        <motion.h2 className={styles.titleLine} variants={reveal} custom={0.05}>
                            BUSCANDO UM DEVELOPER
                        </motion.h2>
                        <motion.h2 className={styles.titleLine} variants={reveal} custom={0.12}>
                            DE ALTA PERFORMANCE?
                        </motion.h2>
                    </div>

                    <motion.p className={styles.lead} variants={reveal} custom={0.24}>
                        Disponível para posições full-time, projetos estratégicos e squads de produto.
                        Especialista em arquitetura escalável, UI de alto impacto e entrega ponta a ponta.
                    </motion.p>
                </motion.header>

                <motion.div
                    className={styles.actionsBlock}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease }}
                >
                    <p className={styles.actionsLabel}>Baixe meu currículo ou entre em contato</p>

                    <div className={styles.cvRow}>
                        <motion.a
                            href="/CV_Patrick_Gomes_Siqueira_PT_Final.pdf"
                            download
                            className={styles.cvBtnPrimary}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaFileDownload />
                            CV — Português
                        </motion.a>
                        <motion.a
                            href="/CV_Patrick_Gomes_Siqueira_EN_Final.pdf"
                            download
                            className={styles.cvBtnPrimary}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaFileDownload />
                            CV — English
                        </motion.a>
                    </div>

                    <div className={styles.contactRow}>
                        <motion.a
                            href="mailto:patricksiqueira.developer@gmail.com"
                            className={styles.contactBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaEnvelope />
                            patricksiqueira.developer@gmail.com
                        </motion.a>
                        <motion.a
                            href="https://wa.me/5571982862912?text=Olá Patrick, vi seu portfólio e gostaria de conversar sobre uma oportunidade!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactBtn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaWhatsapp />
                            WhatsApp
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
