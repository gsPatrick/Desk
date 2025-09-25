import { Fragment } from 'react';
import Image from 'next/image';
import styles from './ProjectCard.module.css';
import { IoBriefcaseOutline, IoEllipsisVertical, IoCalendarClearOutline, IoWarningOutline, IoCheckmarkCircle, IoAlertCircle, IoEllipse, IoPencil, IoTrash, IoCodeSlashOutline, IoPeopleOutline } from 'react-icons/io5';
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
    const clientPayment = payment?.client;
    if (!clientPayment) return { Icon: IoAlertCircle, className: styles.paymentStatusUnpaid, title: 'Status de pagamento do cliente não definido' };
    
    const { status } = clientPayment;
    if (status === 'paid') {
        return { Icon: IoCheckmarkCircle, className: styles.paymentStatusPaid, title: 'Cliente pagou o valor total' };
    }
    if (status === 'partial') {
        return { Icon: IoEllipse, className: styles.paymentStatusPartial, title: 'Cliente pagou parcialmente' };
    }
    return { Icon: IoAlertCircle, className: styles.paymentStatusUnpaid, title: 'Cliente não pagou' };
};

export default function ProjectCard({ project, onOpenModal, onStatusChange, onEdit, onDelete, currentUserRole, currentUserId, priorities }) {
    
    const statusInfo = getStatusInfo(project.status);
    const priorityInfo = getPriorityInfo(project.priorityId, priorities);
    const { className: deadlineClass, text: deadlineText } = getDeadlineInfo(project.deadline);
    const { Icon: PaymentIcon, className: paymentClass, title: paymentTitle } = getPaymentStatusInfo(project.paymentDetails);
    
    // --- CORREÇÃO AQUI: USA OS VALORES PRÉ-CALCULADOS DO BACKEND ---
    // project.budget já é o valor bruto
    const budget = parseFloat(project.budget || 0); 
    const amountPaidByClient = parseFloat(project.paymentDetails?.client?.amountPaid || 0);
    const yourTotalToReceive = parseFloat(project.yourTotalToReceive || 0);
    const yourAmountReceived = parseFloat(project.yourAmountReceived || 0);
    const yourRemainingToReceive = parseFloat(project.yourRemainingToReceive || 0);
    
    // Calcula comissão da plataforma para exibição (usando % e valor)
    const platformCommissionPercent = parseFloat(project.platformCommissionPercent || 0);
    const platformFee = budget * (platformCommissionPercent / 100);

    // Lista de comissões de parceiros para exibição
    const partnersCommissionsList = project.partnersCommissionsList || []; // Pega a lista já calculada do backend
    
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
                {/* --- ITENS FINANCEIROS PARA O CARD (CORRIGIDO PARA USAR OS VALORES DA API) --- */}
                <div className={styles.financialRow}>
                    <span className={styles.label}>Valor Bruto</span>
                    <span className={styles.value}>{formatCurrency(budget)}</span>
                </div>
                <div className={styles.financialRow}>
                    <span className={styles.label}>Recebido (Cliente)</span>
                    <span className={`${styles.value} ${amountPaidByClient > 0 ? styles.valuePaid : ''}`}>{formatCurrency(amountPaidByClient)}</span>
                </div>
                 <div className={styles.financialRow}>
                    <span className={styles.label}>Seu Líquido Total</span>
                    <span className={`${styles.value} ${yourTotalToReceive > 0 ? styles.valueProfit : ''}`}>{formatCurrency(yourTotalToReceive)}</span>
                </div>
                <div className={styles.financialRow}>
                    <span className={styles.label}>Seu Líquido Restante</span>
                    <span className={`${styles.value} ${yourRemainingToReceive > 0 ? styles.valueRemaining : ''}`}>{formatCurrency(yourRemainingToReceive)}</span>
                </div>
                {/* --- FIM DOS NOVOS ITENS FINANCEIROS --- */}
                
                {/* --- EXIBIÇÃO DE COMISSÕES --- */}
                {(platformFee > 0 || partnersCommissionsList.length > 0) && (
                    <div className={styles.costsSection}>
                        {platformFee > 0 && (
                            <div className={styles.costItem}>
                                <span className={styles.costLabel}><IoCodeSlashOutline /> Plataforma ({platformCommissionPercent}%)</span>
                                <span className={styles.costValue}>- {formatCurrency(platformFee)}</span>
                            </div>
                        )}
                        {partnersCommissionsList.map(partner => (
                            <div key={partner.id} className={styles.costItem}>
                                <span className={styles.costLabel}><IoPeopleOutline /> {partner.name} ({partner.shareDetails.commissionValue}{partner.shareDetails.commissionType === 'percentage' ? '%' : ''})</span>
                                <span className={styles.costValue}>- {formatCurrency(partner.expectedAmount)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                    <div className={`${styles.priorityIndicator} ${priorityInfo.textClass}`} title={`Prioridade ${priorityInfo.name}`}><IoWarningOutline /></div>
                    <div className={`${styles.deadline} ${deadlineClass}`} title="Prazo"><IoCalendarClearOutline size={16} /><span>{deadlineText}</span></div>
                    <div className={`${styles.paymentStatusIcon} ${paymentClass}`} title={paymentTitle}><PaymentIcon size={18} /></div>
                    <div className={`${styles.statusIndicator} ${styles[statusInfo.className]}`}>{statusInfo.label}</div>
                </div>
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
                {!project.AssociatedPlatform && platformCommissionPercent > 0 && ( // Caso seja uma plataforma externa sem registro
                    <div className={styles.platformLogoContainer}>
                        <span className={styles.platformNameText}>Plataforma Externa ({platformCommissionPercent}%)</span>
                    </div>
                )}
            </div>
        </div>
    );
}