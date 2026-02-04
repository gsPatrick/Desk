'use client';

import { motion } from 'framer-motion';
import styles from './Workflow.module.css';

const STEPS = [
    {
        id: '01',
        title: 'IMERSÃO',
        description: 'Mergulho profundo no seu modelo de negócio para identificar gargalos e oportunidades estratégicas.'
    },
    {
        id: '02',
        title: 'ESTRATÉGIA & UX',
        description: 'Planejamento da arquitetura e design de interfaces focadas em retenção e conversão de usuários.'
    },
    {
        id: '03',
        title: 'EXECUÇÃO ELITE',
        description: 'Desenvolvimento Full-Stack com tecnologias de ponta, foco em performance brutal e animações fluidas.'
    },
    {
        id: '04',
        title: 'ENTREGA & ESCALA',
        description: 'Lançamento otimizado com suporte a SEO e infraestrutura preparada para o crescimento do seu projeto.'
    }
];

export default function Workflow() {
    return (
        <section className={styles.workflow} id="process">
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className={styles.sectionTitle}>MEU PROCESSO</h2>
                </motion.div>

                <div className={styles.grid}>
                    {STEPS.map((step, index) => (
                        <motion.div
                            key={step.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className={styles.number}>{step.id}</span>
                            <h3 className={styles.title}>{step.title}</h3>
                            <p className={styles.description}>{step.description}</p>
                            <div className={styles.glow} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
