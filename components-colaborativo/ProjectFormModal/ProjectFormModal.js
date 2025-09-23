import { useState, useEffect, useMemo } from 'react';
import Modal from '../Modal/Modal';
// --- CORREÇÃO AQUI: Importa como `formStyles` ---
import formStyles from './ProjectFormModal.module.css';

const initialFormData = {
    id: null,
    name: '',
    clientId: '',
    budget: '',
    deadline: '',
    status: 'in_progress',
    description: '',
    briefing: '',
    notes: '',
    attachments: '',
    partnerId: '',
    commissionType: 'percentage',
    commissionValue: '',
    platformCommissionPercent: ''
};

export default function ProjectFormModal({ isOpen, onClose, onSave, projectToEdit, clients, collaborators, currentUserId, fixedClient }) {
    const [formData, setFormData] = useState(initialFormData);

    const partnerList = useMemo(() => {
        if (!collaborators || !currentUserId) return [];
        return collaborators
            .map(collab => {
                return collab.requesterId === currentUserId ? collab.Addressee : collab.Requester;
            })
            .filter(Boolean);
    }, [collaborators, currentUserId]);

    useEffect(() => {
        setFormData(initialFormData);
        if (projectToEdit) {
            setFormData({ ...initialFormData, ...projectToEdit, clientId: projectToEdit.clientId || '' });
        } else if (fixedClient) {
            setFormData(prev => ({ ...prev, clientId: fixedClient.id }));
        }
    }, [projectToEdit, isOpen, fixedClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const dataToSend = { ...formData };
        if (!dataToSend.partnerId) {
            delete dataToSend.partnerId;
            delete dataToSend.commissionType;
            delete dataToSend.commissionValue;
        }
        onSave(dataToSend);
    };

    const modalTitle = projectToEdit ? "Editar Projeto" : "Criar Novo Projeto";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            {/* Todas as instâncias de `styles` foram trocadas para `formStyles` para corresponder ao import */}
            <div className={formStyles.formGrid}>
                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Detalhes do Projeto</h3>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                    <label className={formStyles.label} htmlFor="name">Nome do Projeto*</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={formStyles.input} required autoFocus />
                </div>

                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                    <label className={formStyles.label} htmlFor="client">Cliente*</label>
                    {fixedClient ? (
                        <input type="text" className={formStyles.input} value={fixedClient.tradeName || fixedClient.legalName} disabled />
                    ) : (
                        <div className={formStyles.clientSelection}>
                            <select id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} className={formStyles.select} required>
                                <option value="" disabled>Selecione um cliente</option>
                                {clients && clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.tradeName || client.legalName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Informações Adicionais</h3>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label}>Descrição</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} className={formStyles.textarea}></textarea></div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label}>Briefing</label><textarea id="briefing" name="briefing" value={formData.briefing} onChange={handleChange} className={formStyles.textarea}></textarea></div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label}>Anotações Técnicas</label><textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className={formStyles.textarea}></textarea></div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label}>Anexos (URLs)</label><input type="text" id="attachments" name="attachments" value={formData.attachments} onChange={handleChange} className={formStyles.input} /></div>

                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Financeiro</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="budget">Orçamento Total (R$)</label>
                    <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} className={formStyles.input} placeholder="Ex: 5000.00"/>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="platformCommissionPercent">Comissão Plataforma (%)</label>
                    <input type="number" id="platformCommissionPercent" name="platformCommissionPercent" value={formData.platformCommissionPercent} onChange={handleChange} className={formStyles.input} placeholder="Ex: 10"/>
                </div>
                
                <h3 className={formStyles.sectionTitle}>Colaboração</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="partnerId">Agência / Sócio</label>
                    <select id="partnerId" name="partnerId" value={formData.partnerId} onChange={handleChange} className={formStyles.select}>
                        <option value="">Nenhum (Projeto Solo)</option>
                        {partnerList.map(partner => (
                            <option key={partner.id} value={partner.id}>{partner.name}</option>
                        ))}
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="commissionValue">Comissão Sócio (%)</label>
                    <input type="number" id="commissionValue" name="commissionValue" value={formData.commissionValue} onChange={handleChange} className={formStyles.input} placeholder="Ex: 20" disabled={!formData.partnerId} />
                </div>

                <h3 className={formStyles.sectionTitle}>Outros Detalhes</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="deadline">Prazo Final</label>
                    <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} className={formStyles.input} />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="status">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className={formStyles.select}>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluído</option>
                        <option value="paused">Pausado</option>
                        <option value="draft">Rascunho</option>
                    </select>
                </div>
            </div>
            
            <div className={formStyles.modalFooter}>
                <button onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                <button onClick={handleSave} className={formStyles.saveButton}>Salvar Projeto</button>
            </div>
        </Modal>
    );
}