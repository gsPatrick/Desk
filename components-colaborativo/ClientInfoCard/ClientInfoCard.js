import { useState } from 'react';
import styles from './ClientInfoCard.module.css';
import { 
    IoPersonOutline, IoBusinessOutline, IoMailOutline, IoLogoWhatsapp, 
    IoCopyOutline, IoCheckmarkCircle, IoArrowForwardOutline, IoInformationCircleOutline,
    IoAtOutline, IoLocationOutline, IoCallOutline // Novos ícones para telefone/contato
} from 'react-icons/io5';

// Helper para formatar o número de telefone para o link do WhatsApp
const formatWhatsappLink = (phone) => {
    if (!phone) return '#';
    const cleaned = phone.replace(/\D/g, ''); // Remove tudo que não for dígito
    return `https://wa.me/${cleaned}`;
};

export default function ClientInfoCard({ client, onOpenClientDetails }) { // `onOpenClientDetails` é a nova prop
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedFiscalEmail, setCopiedFiscalEmail] = useState(false);

    if (!client) return null;

    const handleCopyEmail = (email, type) => {
        if (!email) return;
        navigator.clipboard.writeText(email);
        if (type === 'contact') setCopiedEmail(true);
        if (type === 'fiscal') setCopiedFiscalEmail(true);
        setTimeout(() => {
            if (type === 'contact') setCopiedEmail(false);
            if (type === 'fiscal') setCopiedFiscalEmail(false);
        }, 2000);
    };

    // Função auxiliar para formatar o CNPJ/CPF (pode ser movida para um helper global)
    const formatCnpjCpf = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, '');
        if (value.length === 11) { // CPF
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length === 14) { // CNPJ
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return value;
    };

    // Função auxiliar para formatar o telefone
    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) { // (DD) 9XXXX-XXXX
            return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (cleaned.length === 10) { // (DD) XXXX-XXXX
            return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return phone;
    };

    const fullAddress = [
        client.addressStreet,
        client.addressNumber,
        client.addressComplement,
        client.addressNeighborhood,
        client.addressCity,
        client.addressState,
        client.addressZipCode
    ].filter(Boolean).join(', ');

    return (
        <div className={styles.section}>
            <h2>{client.tradeName || client.legalName}</h2>
            <ul className={styles.infoList}>
                {client.cnpj && (
                     <li className={styles.infoItem}>
                        <IoBusinessOutline className={styles.icon} />
                        <div>
                            <span className={styles.label}>CNPJ / CPF</span>
                            <p className={styles.value}>{formatCnpjCpf(client.cnpj)}</p>
                        </div>
                    </li>
                )}
                {client.contactName && (
                    <li className={styles.infoItem}>
                        <IoPersonOutline className={styles.icon} />
                        <div>
                            <span className={styles.label}>Contato Principal</span>
                            <p className={styles.value}>{client.contactName}</p>
                        </div>
                    </li>
                )}
                {client.contactEmail && (
                    <li className={styles.infoItem}>
                        <IoMailOutline className={styles.icon} />
                        <div>
                            <span className={styles.label}>Email de Contato</span>
                            <div className={styles.interactiveValue}>
                                <a href={`mailto:${client.contactEmail}`} className={styles.valueLink}>{client.contactEmail}</a>
                                <button onClick={() => handleCopyEmail(client.contactEmail, 'contact')} className={styles.copyButton} title="Copiar e-mail">
                                    {copiedEmail ? <IoCheckmarkCircle className={styles.copiedIcon} /> : <IoCopyOutline />}
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
                                {formatPhone(client.contactPhone)}
                            </a>
                        </div>
                    </li>
                )}
                 {client.fiscalEmail && (
                    <li className={styles.infoItem}>
                        <IoAtOutline className={styles.icon} />
                        <div>
                            <span className={styles.label}>Email para Faturamento</span>
                            <div className={styles.interactiveValue}>
                                <a href={`mailto:${client.fiscalEmail}`} className={styles.valueLink}>{client.fiscalEmail}</a>
                                <button onClick={() => handleCopyEmail(client.fiscalEmail, 'fiscal')} className={styles.copyButton} title="Copiar e-mail">
                                    {copiedFiscalEmail ? <IoCheckmarkCircle className={styles.copiedIcon} /> : <IoCopyOutline />}
                                </button>
                            </div>
                        </div>
                    </li>
                )}
                {fullAddress && (
                    <li className={styles.infoItem}>
                        <IoLocationOutline className={styles.icon} />
                        <div>
                            <span className={styles.label}>Endereço Fiscal</span>
                            <p className={styles.value}>{fullAddress}</p>
                        </div>
                    </li>
                )}
            </ul>
            <button onClick={() => onOpenClientDetails(client)} className={styles.detailsButton}>
                Ver Detalhes Completos <IoArrowForwardOutline />
            </button>
        </div>
    );
}