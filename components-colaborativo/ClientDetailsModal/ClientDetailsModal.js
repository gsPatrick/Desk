import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './ClientDetailsModal.module.css';
import { IoPerson, IoBusiness, IoMail, IoLogoWhatsapp, IoCopyOutline, IoCheckmarkCircle, IoArrowForward } from 'react-icons/io5';
import Link from 'next/link';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatWhatsappLink = (phone) => {
    if (!phone) return '#';
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
};

// Componente auxiliar para exibir um item de detalhe
const DetailItem = ({ label, value, isLink = false, linkHref = '#' }) => {
    if (!value) return null;
    return (
        <div className={styles.detailItem}>
            <span className={styles.label}>{label}</span>
            {isLink ? (
                <a href={linkHref} target="_blank" rel="noopener noreferrer" className={styles.valueLink}>{value}</a>
            ) : (
                <span className={styles.value}>{value}</span>
            )}
        </div>
    );
};

export default function ClientDetailsModal({ isOpen, onClose, client }) {
    const [copiedContactEmail, setCopiedContactEmail] = useState(false);
    const [copiedFiscalEmail, setCopiedFiscalEmail] = useState(false);

    // Reseta o estado de "copiado" sempre que o modal abre ou o cliente muda
    useEffect(() => {
        setCopiedContactEmail(false);
        setCopiedFiscalEmail(false);
    }, [isOpen, client]);

    if (!client) return null;

    const handleCopyEmail = (email, type) => {
        if (!email) return;
        navigator.clipboard.writeText(email);
        if (type === 'contact') setCopiedContactEmail(true);
        if (type === 'fiscal') setCopiedFiscalEmail(true);
        setTimeout(() => {
            if (type === 'contact') setCopiedContactEmail(false);
            if (type === 'fiscal') setCopiedFiscalEmail(false);
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={client.tradeName || client.legalName}>
            <div className={styles.detailsContainer}>
                {/* --- SEÇÃO DADOS FISCAIS --- */}
                <div className={styles.section}>
                    <h3>Dados Fiscais</h3>
                    <div className={styles.infoGrid}>
                        <DetailItem label="Razão Social" value={client.legalName} />
                        <DetailItem label="Nome Fantasia" value={client.tradeName} />
                        <DetailItem label="CNPJ / CPF" value={client.cnpj} />
                        <DetailItem label="Inscrição Estadual" value={client.inscricaoEstadual} />
                        <DetailItem label="Inscrição Municipal" value={client.inscricaoMunicipal} />
                    </div>
                </div>

                {/* --- SEÇÃO CONTATOS --- */}
                <div className={styles.section}>
                    <h3>Contatos</h3>
                    <div className={styles.infoGrid}>
                        <DetailItem label="Contato Principal" value={client.contactName} />
                        {client.contactEmail && (
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Email de Contato</span>
                                <div className={styles.interactiveValue}>
                                    <a href={`mailto:${client.contactEmail}`} className={styles.valueLink}>{client.contactEmail}</a>
                                    <button onClick={() => handleCopyEmail(client.contactEmail, 'contact')} className={styles.copyButton} title="Copiar e-mail">
                                        {copiedContactEmail ? <IoCheckmarkCircle className={styles.copiedIcon} /> : <IoCopyOutline />}
                                    </button>
                                </div>
                            </div>
                        )}
                        {client.contactPhone && (
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Telefone / WhatsApp</span>
                                <a href={formatWhatsappLink(client.contactPhone)} target="_blank" rel="noopener noreferrer" className={styles.valueLink}>{client.contactPhone}</a>
                            </div>
                        )}
                        {client.fiscalEmail && (
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Email para Faturamento</span>
                                <div className={styles.interactiveValue}>
                                    <a href={`mailto:${client.fiscalEmail}`} className={styles.valueLink}>{client.fiscalEmail}</a>
                                    <button onClick={() => handleCopyEmail(client.fiscalEmail, 'fiscal')} className={styles.copyButton} title="Copiar e-mail">
                                        {copiedFiscalEmail ? <IoCheckmarkCircle className={styles.copiedIcon} /> : <IoCopyOutline />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- SEÇÃO ENDEREÇO --- */}
                <div className={styles.section}>
                    <h3>Endereço</h3>
                    <div className={styles.infoGrid}>
                        <DetailItem label="CEP" value={client.addressZipCode} />
                        <DetailItem label="Logradouro" value={client.addressStreet} />
                        <DetailItem label="Número" value={client.addressNumber} />
                        <DetailItem label="Complemento" value={client.addressComplement} />
                        <DetailItem label="Bairro" value={client.addressNeighborhood} />
                        <DetailItem label="Cidade" value={client.addressCity} />
                        <DetailItem label="Estado" value={client.addressState} />
                    </div>
                </div>
                
                {client.notes && (
                    <div className={styles.section}>
                        <h3>Observações</h3>
                        <p className={styles.notesText}>{client.notes}</p>
                    </div>
                )}

                {/* --- SEÇÃO DE PROJETOS DO CLIENTE --- */}
                <div className={styles.section}>
                    <h3>Projetos ({client.projectCount})</h3>
                    {client.Projects && client.Projects.length > 0 ? (
                        <ul className={styles.projectList}>
                            {client.Projects.map(project => (
                                <li key={project.id} className={styles.projectItem}>
                                    <Link href={`/colaborativo/projetos/${project.id}`} className={styles.projectLink}>
                                        <span className={styles.projectName}>{project.name}</span>
                                        <span className={styles.projectStatus}>{project.status}</span>
                                        <span className={styles.projectBudget}>{formatCurrency(project.budget)}</span>
                                        <IoArrowForward className={styles.projectLinkIcon} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noProjects}>Nenhum projeto associado ainda.</p>
                    )}
                    <Link href={`/colaborativo/clientes/${client.id}`} className={styles.viewProjectsButton}>
                        Ver todos os projetos deste cliente <IoArrowForward />
                    </Link>
                </div>
            </div>
            <div className={styles.modalFooter}>
                <button onClick={onClose} className={styles.cancelButton}>Fechar</button>
            </div>
        </Modal>
    );
}