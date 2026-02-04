'use client';

import { motion } from 'framer-motion';
import styles from './Business.module.css';

const BENEFITS = [
    {
        title: 'Estrutura Empresarial',
        desc: 'Como Patrick.Developer (CNPJ), ofereço a formalidade de uma empresa, adaptando-me às necessidades do seu negócio.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="9" y1="22" x2="9" y2="22" />
                <line x1="15" y1="22" x2="15" y2="22" />
                <line x1="9" y1="18" x2="9" y2="18" />
                <line x1="15" y1="18" x2="15" y2="18" />
                <line x1="9" y1="14" x2="9" y2="14" />
                <line x1="15" y1="14" x2="15" y2="14" />
                <line x1="9" y1="10" x2="9" y2="10" />
                <line x1="15" y1="10" x2="15" y2="10" />
                <line x1="9" y1="6" x2="9" y2="6" />
                <line x1="15" y1="6" x2="15" y2="6" />
            </svg>
        )
    },
    {
        title: 'Nota Fiscal Disponível',
        desc: 'Para atender às exigências fiscais da sua empresa, a emissão de Nota Fiscal (NF-e) está disponível para todos os projetos.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        )
    },
    {
        title: 'Contratos Flexíveis',
        desc: 'Podemos formalizar nossa parceria através de um contrato de serviço, garantindo clareza e segurança para ambas as partes.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        )
    }
];

export default function Business() {
    return (
        <section className={styles.business}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className={styles.title}>
                        PARCERIA FLEXÍVEL E <span>PROFISSIONAL</span>
                    </h2>
                </motion.div>

                <div className={styles.grid}>
                    {BENEFITS.map((item, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        >
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardDesc}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
