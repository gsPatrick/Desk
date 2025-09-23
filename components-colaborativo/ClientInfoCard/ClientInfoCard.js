import { useState } from 'react';
import styles from './ClientInfoCard.module.css';
import { IoPerson, IoBusiness, IoMail, IoLogoWhatsapp, IoCopyOutline, IoCheckmarkCircle } from 'react-icons/io5';

// Helper para formatar o número de telefone para o link do WhatsApp
const formatWhatsappLink = (phone) => {
    if (!phone) return '#';
    const cleaned = phone.replace(/\D/g, ''); // Remove tudo que não for dígito
    return `https://wa.me/${cleaned}`;
};

export default function ClientInfoCard({ client }) {
    const [copied, setCopied] = useState(false);

    if (!client) return null;

    const handleCopyEmail = (email) => {
        if (!email) return;
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reseta o ícone após 2 segundos
    };

    return (
        <div className={styles.section}>
            <h2>{client.tradeName || client.legalName}</h2>
            <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                    <IoBusiness className={styles.icon} />
                    <div>
                        <span className={styles.label}>Razão Social</span>
                        <p className={styles.value}>{client.legalName}</p>
                    </div>
                </li>
                {client.cnpj && (
                     <li className={styles.infoItem}>
                        <div className={styles.iconPlaceholder}></div> {/* Espaçador para alinhamento */}
                        <div>
                            <span className={styles.label}>CNPJ / CPF</span>
                            <p className={styles.value}>{client.cnpj}</p>
                        </div>
                    </li>
                )}
                {client.contactName && (
                    <li className={styles.infoItem}>
                        <IoPerson className={styles.icon} />
                        <div>
                            <span className={styles.label}>Contato Principal</span>
                            <p className={styles.value}>{client.contactName}</p>
                        </div>
                    </li>
                )}
                {client.contactEmail && (
                    <li className={styles.infoItem}>
                        <IoMail className={styles.icon} />
                        <div>
                            <span className={styles.label}>Email de Contato</span>
                            <div className={styles.interactiveValue}>
                                <a href={`mailto:${client.contactEmail}`} className={styles.valueLink}>{client.contactEmail}</a>
                                <button onClick={() => handleCopyEmail(client.contactEmail)} className={styles.copyButton} title="Copiar e-mail">
                                    {copied ? <IoCheckmarkCircle className={styles.copiedIcon} /> : <IoCopyOutline />}
                                </button>
                            </div>
                        </div>
                    </li>
                )}
                {client.contactPhone && (
                    <li className={styles.infoItem}>
                        <IoLogoWhatsapp className={styles.icon} />
                        <div>
                            <span className={styles.label}>Telefone / WhatsApp</span>
                            <a href={formatWhatsappLink(client.contactPhone)} target="_blank" rel="noopener noreferrer" className={styles.valueLink}>
                                {client.contactPhone}
                            </a>
                        </div>
                    </li>
                )}
                 {client.fiscalEmail && (
                    <li className={styles.infoItem}>
                        <IoMail className={styles.icon} />
                        <div>
                            <span className={styles.label}>Email para Faturamento</span>
                            <div className={styles.interactiveValue}>
                                <a href={`mailto:${client.fiscalEmail}`} className={styles.valueLink}>{client.fiscalEmail}</a>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}