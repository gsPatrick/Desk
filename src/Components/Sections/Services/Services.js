'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp, FaRocket, FaShoppingCart, FaCode, FaMobileAlt } from 'react-icons/fa';
import styles from './Services.module.css';

const SERVICES = [
    {
        number: '01',
        title: 'Landing Pages',
        desc: 'Páginas focadas em alta conversão. Design cinematográfico que prende a atenção e transforma visitantes em clientes.',
        icon: <FaRocket />
    },
    {
        number: '02',
        title: 'E-commerce',
        desc: 'Lojas virtuais rápidas, seguras e otimizadas para vender. Integração com pagamentos e gestão de estoque.',
        icon: <FaShoppingCart />
    },
    {
        number: '03',
        title: 'Sistemas Web',
        desc: 'Dashboards administrativos, plataformas SaaS e ferramentas internas personalizadas para sua empresa.',
        icon: <FaCode />
    },
    {
        number: '04',
        title: 'Aplicativos',
        desc: 'Desenvolvimento mobile (iOS e Android) com experiência nativa e performance de ponta.',
        icon: <FaMobileAlt />
    }
];

export default function Services() {
    return (
        <section className={styles.services}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>
                        TIRE DO PAPEL
                        <span>FAÇA UM ORÇAMENTO</span>
                    </h2>
                </motion.div>

                <div className={styles.grid}>
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className={styles.cardGlow} />
                            <div className={styles.cardHeader}>
                                <span className={styles.cardNumber}>{service.number}</span>
                                <div className={styles.cardIcon}>{service.icon}</div>
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.ctaWrapper}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <p className={styles.ctaText}>
                        Tem um projeto em mente? Vamos tirar ele do papel.
                    </p>
                    <motion.a
                        href="https://wa.me/5571982862912?text=Olá Patrick, gostaria de solicitar um orçamento!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappBtn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaWhatsapp />
                        SOLICITAR ORÇAMENTO
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
