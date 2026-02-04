'use client';

import { motion } from 'framer-motion';
import styles from './Workflow.module.css';

const STEPS = [
    {
        id: '01',
        title: 'IMERSÃO ESTRATÉGICA',
        subtitle: 'CRIANDO A FUNDAÇÃO',
        description: 'Mergulho profundo no seu modelo de negócio para identificar gargalos e oportunidades estratégicas que outros ignoram.'
    },
    {
        id: '02',
        title: 'ESTRATÉGIA & UX',
        subtitle: 'MOLDANDO A EXPERIÊNCIA',
        description: 'Planejamento da arquitetura e design de interfaces focadas em retenção, navegabilidade e conversão extrema.'
    },
    {
        id: '03',
        title: 'EXECUÇÃO DE ELITE',
        description: 'Desenvolvimento Full-Stack com tecnologias de ponta, foco em performance brutal e animações que encantam.'
    },
    {
        id: '04',
        title: 'ENTREGA & ESCALA',
        subtitle: 'DOMINANDO O MERCADO',
        description: 'Lançamento otimizado com suporte a SEO e infraestrutura preparada para o crescimento exponencial do seu projeto.'
    }
];

export default function Workflow() {
    return (
        <section className={styles.workflow} id="process">
            <div className={styles.stickyContainer}>
                <div className={styles.verticalTrack}>
                    <div className={styles.progressLine} />
                    {STEPS.map((step, index) => (
                        <div key={step.id} className={styles.stepBlock}>
                            <motion.div
                                className={styles.content}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.5 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span className={styles.number}>{step.id}</span>
                                <h4 className={styles.stepSubtitle}>{step.subtitle}</h4>
                                <h3 className={styles.title}>{step.title}</h3>
                                <p className={styles.description}>{step.description}</p>
                            </motion.div>
                            <div className={styles.visualColumn}>
                                <motion.div
                                    className={styles.circle}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ amount: 0.5 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
