import { useState, useEffect, useMemo } from 'react';
import Modal from '../Modal/Modal';
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
    // Dados de comissão e plataforma
    platformId: '', 
    platformCommissionPercent: '',
    ownerCommissionType: 'percentage', // Padrão
    ownerCommissionValue: '',
    // Dados do parceiro
    partnerId: '',
    commissionType: 'percentage', // Padrão
    commissionValue: '',
};

export default function ProjectFormModal({ isOpen, onClose, onSave, projectToEdit, clients, collaborators, currentUserId, fixedClient, platforms }) {
    const [formData, setFormData] = useState(initialFormData);

    const partnerList = useMemo(() => {
        if (!collaborators || !currentUserId) return [];
        return collaborators
            .map(collab => {
                // O parceiro é o outro usuário na colaboração
                return collab.requesterId === currentUserId ? collab.Addressee : collab.Requester;
            })
            .filter(Boolean); // Filtra qualquer resultado nulo
    }, [collaborators, currentUserId]);

    useEffect(() => {
        setFormData(initialFormData); // Reseta o formulário
        if (projectToEdit) {
            // Ao editar, preenche com os dados existentes do projeto
            // Converte valores numéricos e garante que IDs de select sejam string vazia se null
            setFormData({
                ...initialFormData,
                ...projectToEdit,
                clientId: projectToEdit.clientId || '',
                budget: parseFloat(projectToEdit.budget) || '',
                platformId: projectToEdit.platformId || '',
                platformCommissionPercent: parseFloat(projectToEdit.platformCommissionPercent) || '',
                ownerCommissionType: projectToEdit.ownerCommissionType || 'percentage',
                ownerCommissionValue: parseFloat(projectToEdit.ownerCommissionValue) || '',
                // Para parceiros, se houver um, preenche a comissão dele
                partnerId: projectToEdit.Partners?.[0]?.id || '',
                commissionType: projectToEdit.Partners?.[0]?.ProjectShare?.commissionType || 'percentage',
                commissionValue: parseFloat(projectToEdit.Partners?.[0]?.ProjectShare?.commissionValue) || ''
            });
        } else if (fixedClient) {
            // Ao criar a partir da página de cliente, já preenche o clientId
            setFormData(prev => ({ ...prev, clientId: fixedClient.id }));
        }
    }, [projectToEdit, isOpen, fixedClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Lógica para preencher comissão padrão da plataforma
        if (name === 'platformId' && value) {
            const selectedPlatform = platforms.find(p => p.id === parseInt(value));
            if (selectedPlatform) {
                setFormData(prev => ({ 
                    ...prev, 
                    platformId: value, 
                    platformCommissionPercent: selectedPlatform.defaultCommissionPercent 
                }));
                return;
            }
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSave = () => {
        const dataToSend = { ...formData };
        
        // Converte valores para numérico antes de enviar para o backend
        dataToSend.budget = parseFloat(dataToSend.budget) || 0;
        dataToSend.platformCommissionPercent = parseFloat(dataToSend.platformCommissionPercent) || 0;
        dataToSend.ownerCommissionValue = parseFloat(dataToSend.ownerCommissionValue) || 0;
        dataToSend.commissionValue = parseFloat(dataToSend.commissionValue) || 0;

        // Garante que IDs de select sejam null se forem string vazia
        dataToSend.clientId = dataToSend.clientId === '' ? null : parseInt(dataToSend.clientId, 10);
        dataToSend.platformId = dataToSend.platformId === '' ? null : parseInt(dataToSend.platformId, 10);
        dataToSend.partnerId = dataToSend.partnerId === '' ? null : parseInt(dataToSend.partnerId, 10);
        
        // Remove dados de parceiro se nenhum parceiro foi selecionado
        if (!dataToSend.partnerId) {
            delete dataToSend.commissionType;
            delete dataToSend.commissionValue;
        }

        onSave(dataToSend);
    };

    const modalTitle = projectToEdit ? "Editar Projeto" : "Criar Novo Projeto";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
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
                    <label className={formStyles.label} htmlFor="budget">Orçamento Total (R$)*</label>
                    <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} className={formStyles.input} placeholder="Ex: 5000.00" required/>
                </div>
                {/* --- SELEÇÃO DE PLATAFORMA --- */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="platformId">Plataforma (Opcional)</label>
                    <select id="platformId" name="platformId" value={formData.platformId} onChange={handleChange} className={formStyles.select}>
                        <option value="">Venda Direta / Nenhuma</option>
                        {platforms.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="platformCommissionPercent">Comissão Plataforma (%)</label>
                    <input type="number" id="platformCommissionPercent" name="platformCommissionPercent" value={formData.platformCommissionPercent} onChange={handleChange} className={formStyles.input} placeholder="Ex: 10"/>
                </div>
                
                <h3 className={formStyles.sectionTitle}>Colaboração</h3>
                {/* --- COMISSÃO DO DONO (SE HOUVER PARCEIROS) --- */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="ownerCommissionValue">Sua Comissão (se tiver parceiro) (%)</label>
                    <input type="number" id="ownerCommissionValue" name="ownerCommissionValue" value={formData.ownerCommissionValue} onChange={handleChange} className={formStyles.input} placeholder="Ex: 50" />
                </div>
                {/* --- SELEÇÃO DE PARCEIRO --- */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="partnerId">Parceiro</label>
                    <select id="partnerId" name="partnerId" value={formData.partnerId} onChange={handleChange} className={formStyles.select}>
                        <option value="">Nenhum</option>
                        {partnerList.map(partner => (
                            <option key={partner.id} value={partner.id}>{partner.name}</option>
                        ))}
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="commissionValue">Comissão do Parceiro (%)</label>
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