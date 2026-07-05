'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './Services.module.css';

const SERVICES = [
    {
        number: '01',
        title: 'Sites & Landing Pages',
        desc: 'Páginas rápidas, bonitas e focadas em converter. Ideal para lançar sua marca, campanha ou validar uma ideia.',
    },
    {
        number: '02',
        title: 'E-commerce',
        desc: 'Loja virtual completa com pagamentos, estoque e painel admin. Pronta para vender desde o primeiro dia.',
    },
    {
        number: '03',
        title: 'Sistemas Web',
        desc: 'Dashboards, plataformas internas e SaaS sob medida. Do MVP ao produto escalável.',
    },
    {
        number: '04',
        title: 'Manutenção & Evolução',
        desc: 'Já tem um projeto no ar? Assumo melhorias, correções e novas funcionalidades com agilidade.',
    },
];

const STEPS = [
    { label: '01', text: 'Você me conta a ideia' },
    { label: '02', text: 'Recebe um orçamento claro' },
    { label: '03', text: 'Desenvolvo e entrego' },
];

const ease = [0.22, 1, 0.36, 1];

const reveal = {
    hidden: { opacity: 0, y: 36 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, delay, ease },
    }),
};

export default function Services() {
    return (
        <section className={styles.services} id="services">
            <div className={styles.bgWord} aria-hidden="true">
                FREELANCER
            </div>

            <div className={styles.container}>
                <motion.header
                    className={styles.header}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                >
                    <motion.span className={styles.eyebrow} variants={reveal} custom={0}>
                        Projetos sob medida · Atendimento direto
                    </motion.span>

                    <div className={styles.titleGroup}>
                        <motion.h2 className={styles.titleLine} variants={reveal} custom={0.05}>
                            TIRE DO PAPEL
                        </motion.h2>
                        <motion.h2 className={styles.titleLine} variants={reveal} custom={0.12}>
                            SEU PROJETO
                        </motion.h2>
                        <motion.h2 className={styles.titleLine} variants={reveal} custom={0.2}>
                            COMIGO.
                        </motion.h2>
                    </div>

                    <motion.p className={styles.lead} variants={reveal} custom={0.32}>
                        Sou freelancer Full Stack. Você fala direto com quem desenvolve — sem intermediários,
                        sem burocracia. Do briefing ao deploy, tudo com transparência.
                    </motion.p>
                </motion.header>

                <motion.div
                    className={styles.steps}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
                >
                    {STEPS.map((step) => (
                        <motion.div key={step.label} className={styles.stepItem} variants={reveal}>
                            <span className={styles.stepNumber}>{step.label}</span>
                            <span className={styles.stepText}>{step.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                <div className={styles.grid}>
                    {SERVICES.map((service, index) => (
                        <motion.article
                            key={service.number}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: index * 0.08, ease }}
                        >
                            <span className={styles.cardNumber}>{service.number}</span>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    className={styles.ctaBlock}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease }}
                >
                    <div className={styles.ctaInner}>
                        <h3 className={styles.ctaTitle}>FAÇA UM ORÇAMENTO</h3>
                        <p className={styles.ctaText}>
                            Orçamento gratuito e sem compromisso. Me conta o que precisa — respondo em até 24h.
                        </p>
                        <motion.a
                            href="https://wa.me/5571982862912?text=Olá Patrick, gostaria de solicitar um orçamento para um projeto!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappBtn}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaWhatsapp />
                            CHAMAR NO WHATSAPP
                        </motion.a>
                        <span className={styles.ctaNote}>Patrick.Developer · CNPJ disponível para contrato</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
