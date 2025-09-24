import { Fragment } from 'react';
import Image from 'next/image';
import styles from './ProjectCard.module.css';
import { IoBriefcaseOutline, IoEllipsisVertical, IoCalendarClearOutline, IoWarningOutline, IoCheckmarkCircle, IoAlertCircle, IoEllipse, IoPencil, IoTrash } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';
import { differenceInDays, parseISO, isPast } from 'date-fns';
import { STATUS_MAP, getStatusInfo, getPriorityInfo } from '../../utils/colaborativo-helpers';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const getDeadlineInfo = (deadline) => {
    try {
        if (!deadline) return { className: styles.deadlineNormal, text: 'Sem prazo' };
        const deadlineDate = parseISO(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysRemaining = differenceInDays(deadlineDate, today);

        if (isPast(deadlineDate) && daysRemaining < 0) {
            return { className: styles.deadlineOverdue, text: `Atrasado ${Math.abs(daysRemaining)}d` };
        }
        if (daysRemaining <= 7) {
            return { className: styles.deadlineWarning, text: `Vence em ${daysRemaining}d` };
        }
        return { className: styles.deadlineNormal, text: new Intl.DateTimeFormat('pt-BR').format(deadlineDate) };
    } catch (e) {
        return { className: styles.deadlineNormal, text: deadline };
    }
};

const getPaymentStatusInfo = (payment) => {
    if (!payment || !payment.client) return { Icon: IoAlertCircle, className: styles.paymentStatusUnpaid, title: 'Status de pagamento não definido' };
    const { status: clientStatus } = payment.client;
    if (clientStatus === 'paid') {
        return { Icon: IoCheckmarkCircle, className: styles.paymentStatusPaid, title: 'Totalmente pago' };
    }
    if (clientStatus === 'partial') {
        return { Icon: IoEllipse, className: styles.paymentStatusPartial, title: 'Pagamento parcial recebido' };
    }
    return { Icon: IoAlertCircle, className: styles.paymentStatusUnpaid, title: 'Pagamento pendente' };
};

export default function ProjectCard({ project, onOpenModal, onStatusChange, onEdit, onDelete, currentUserRole, priorities }) {
    
    const statusInfo = getStatusInfo(project.status);
    const priorityInfo = getPriorityInfo(project.priorityId, priorities);
    const { className: deadlineClass, text: deadlineText } = getDeadlineInfo(project.deadline);
    const { Icon: PaymentIcon, className: paymentClass, title: paymentTitle } = getPaymentStatusInfo(project.paymentDetails);
    
    const budget = parseFloat(project.budget || 0);
    const paymentDetails = project.paymentDetails?.client || {}; // Acessa o objeto client dentro de paymentDetails
    const amountPaid = parseFloat(paymentDetails.amountPaid || 0);
    const remainingAmount = budget - amountPaid;
    
    // Calcula comissão da plataforma
    const platformCommissionPercent = parseFloat(project.platformCommissionPercent || 0);
    const platformFee = budget * (platformCommissionPercent / 100);

    // Calcula comissão do dono (se houver parceiros)
    const ownerCommissionType = project.ownerCommissionType;
    const ownerCommissionValue = parseFloat(project.ownerCommissionValue || 0);
    let ownerFee = 0;
    if (ownerCommissionType === 'percentage') {
        ownerFee = budget * (ownerCommissionValue / 100);
    } else if (ownerCommissionType === 'fixed') {
        ownerFee = ownerCommissionValue;
    }

    // Lucro do dono (o que sobra do bruto após plataforma e comissão de parceiros)
    let netProfitToShow = budget - platformFee - ownerFee;

    // Se o usuário logado for um PARCEIRO, mostra o lucro dele (comissão)
    const userAsPartner = project.Partners?.find(p => p.id === currentUserRole); // Assumindo currentUserRole é o ID do usuário
    if (userAsPartner) {
        // A comissão do parceiro vem diretamente da ProjectShare
        const partnerShare = userAsPartner.ProjectShare;
        if (partnerShare.commissionType === 'percentage') {
            netProfitToShow = budget * (parseFloat(partnerShare.commissionValue) / 100);
        } else if (partnerShare.commissionType === 'fixed') {
            netProfitToShow = parseFloat(partnerShare.commissionValue);
        }
    }


    const statusOptions = Object.entries(STATUS_MAP).map(([value, { label }]) => ({ value, label }));

    return (
        <div className={`${styles.card} ${priorityInfo.className}`}>
            <div className={styles.cardHeader}>
                <div className={styles.titleGroup} onClick={() => onOpenModal(project)}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <div className={styles.clientInfo}>
                        <IoBriefcaseOutline size={16} color="var(--colab-text-secondary)" />
                        <p className={styles.clientName}>{project.Client ? (project.Client.tradeName || project.Client.legalName) : 'Cliente'}</p>
                    </div>
                </div>
                <div className={styles.actionsMenu}>
                     <Menu as="div">
                        <Menu.Button className={styles.menuButton}><IoEllipsisVertical size={20} /></Menu.Button>
                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className={styles.menuItems}>
                                <div className={styles.menuSection}>
                                    <Menu.Item><button className={`${styles.menuItem} ${styles.menuItemIcon}`} onClick={() => onEdit(project)}><IoPencil /><span>Editar</span></button></Menu.Item>
                                    <Menu.Item><button className={`${styles.menuItem} ${styles.menuItemIcon} ${styles.menuItemDanger}`} onClick={() => onDelete(project.id)}><IoTrash /><span>Excluir</span></button></Menu.Item>
                                </div>
                                <div>
                                    <p className={styles.menuLabel}>Alterar Status</p>
                                    {statusOptions.map(option => (
                                        <Menu.Item key={option.value}><button className={styles.menuItem} onClick={() => onStatusChange(project.id, option.value)}><span>{option.label}</span></button></Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            <div className={styles.financialSection} onClick={() => onOpenModal(project)}>
                <div className={styles.financialRow}>
                    <span className={styles.label}>Valor Total</span>
                    <span className={styles.value}>{formatCurrency(budget)}</span>
                </div>
                <div className={styles.paymentDetails}>
                    {paymentDetails.status === 'paid' && (
                        <div className={styles.financialRow}><span className={styles.label}>Pagamento Total</span><span className={`${styles.paymentValue} ${styles.paymentPaid}`}>{formatCurrency(budget)}</span></div>
                    )}
                    {paymentDetails.status === 'partial' && (
                        <>
                            <div className={styles.financialRow}><span className={styles.label}>Recebido</span><span className={`${styles.paymentValue} ${styles.paymentPaid}`}>{formatCurrency(amountPaid)}</span></div>
                            <div className={styles.financialRow}><span className={styles.label}>Falta Receber</span><span className={`${styles.paymentValue} ${styles.paymentRemaining}`}>{formatCurrency(remainingAmount)}</span></div>
                        </>
                    )}
                </div>
                <div className={`${styles.financialRow} ${styles.profitRow}`}>
                    <span className={styles.label}>Seu Lucro Líquido</span>
                    <span className={styles.profitValue}>{formatCurrency(netProfitToShow)}</span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                    <div className={`${styles.priorityIndicator} ${priorityInfo.textClass}`} title={`Prioridade ${priorityInfo.name}`}><IoWarningOutline /></div>
                    <div className={`${styles.deadline} ${deadlineClass}`} title="Prazo"><IoCalendarClearOutline size={16} /><span>{deadlineText}</span></div>
                    <div className={`${styles.paymentStatusIcon} ${paymentClass}`} title={paymentTitle}><PaymentIcon size={18} /></div>
                    <div className={`${styles.statusIndicator} ${styles[statusInfo.className]}`}>{statusInfo.label}</div>
                </div>
                {/* --- EXIBIÇÃO DA PLATAFORMA --- */}
                {project.AssociatedPlatform && (
                    <div className={styles.platformLogoContainer}>
                        {project.AssociatedPlatform.logoUrl && (
                            <img src={project.AssociatedPlatform.logoUrl} alt={`Logo ${project.AssociatedPlatform.name}`} className={styles.platformLogo} />
                        )}
                        {!project.AssociatedPlatform.logoUrl && (
                            <span className={styles.platformNameText}>{project.AssociatedPlatform.name}</span>
                        )}
                    </div>
                )}
                {!project.AssociatedPlatform && project.platformCommissionPercent > 0 && (
                    <div className={styles.platformLogoContainer}>
                        <span className={styles.platformNameText}>Plataforma Externa ({project.platformCommissionPercent}%)</span>
                    </div>
                )}
            </div>
        </div>
    );
}