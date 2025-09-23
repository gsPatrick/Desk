import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import formStyles from '../ProjectFormModal/ProjectFormModal.module.css';
import shareStyles from './ClientFormModal.module.css';
import api from '../../services/colaborativo-api';
import { IoCloseCircle } from 'react-icons/io5';

const initialFormData = {
    id: null,
    legalName: '',
    tradeName: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    fiscalEmail: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressZipCode: '',
    notes: '',
    SharedWith: [],
};

// --- FUNÇÃO DE MÁSCARA PARA CNPJ / CPF ---
const maskCnpjCpf = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (value.length <= 11) { // Formata como CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else { // Formata como CNPJ
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
};


export default function ClientFormModal({ isOpen, onClose, onSave, clientToEdit, collaborators }) {
    const [formData, setFormData] = useState(initialFormData);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState('');

    useEffect(() => {
        if (clientToEdit) {
            // Garante que a máscara seja aplicada ao carregar um cliente existente
            const maskedCnpj = clientToEdit.cnpj ? maskCnpjCpf(clientToEdit.cnpj) : '';
            setFormData({ ...initialFormData, ...clientToEdit, cnpj: maskedCnpj });
        } else {
            setFormData(initialFormData);
        }
        setCepError('');
    }, [clientToEdit, isOpen]);
    
    // --- LÓGICA DE BUSCA DE CEP ---
    const handleCepChange = async (e) => {
        const cepRaw = e.target.value;
        const cep = cepRaw.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, addressZipCode: cepRaw })); // Mantém a máscara no campo
        setCepError('');

        if (cep.length === 8) {
            setIsCepLoading(true);
            try {
                const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
                const data = await response.json();
                if (response.ok) {
                    setFormData(prev => ({
                        ...prev,
                        addressStreet: data.street || '',
                        addressNeighborhood: data.neighborhood || '',
                        addressCity: data.city || '',
                        addressState: data.state || '',
                    }));
                } else {
                    throw new Error(data.message || 'CEP não encontrado.');
                }
            } catch (error) {
                setCepError(error.message);
                console.error("Erro ao buscar CEP:", error);
            } finally {
                setIsCepLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cnpj') {
            setFormData(prev => ({ ...prev, [name]: maskCnpjCpf(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleShareWith = async (collaboratorId) => {
        if (!formData.id) {
            alert("Salve o cliente primeiro antes de compartilhar.");
            return;
        }
        const partner = (collaborators || [])
            .map(collab => collab.requesterId === 1 ? collab.Addressee : collab.Requester)
            .find(c => c && c.id === parseInt(collaboratorId));
        if (!partner) return;
        
        try {
            await api.post(`/clients/${formData.id}/share`, { partnerEmail: partner.email });
            setFormData(prev => ({
                ...prev,
                SharedWith: [...(prev.SharedWith || []), { id: partner.id, name: partner.name }]
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao compartilhar cliente.");
        }
    };
    
    const handleStopSharing = async (partnerId) => {
        try {
            await api.delete(`/clients/${formData.id}/share/${partnerId}`);
            setFormData(prev => ({
                ...prev,
                SharedWith: (prev.SharedWith || []).filter(p => p.id !== partnerId)
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao remover compartilhamento.");
        }
    };
    
    const handleSave = () => {
        // Envia o CNPJ/CPF sem a máscara para o backend
        const dataToSend = {
            ...formData,
            cnpj: formData.cnpj.replace(/\D/g, ''),
        };
        onSave(dataToSend);
    };

    const modalTitle = clientToEdit ? "Editar Cliente" : "Adicionar Novo Cliente";

    const availableCollaborators = (collaborators || [])
        .map(collab => collab.requesterId === 1 ? collab.Addressee : collab.Requester) // Simulação, ajuste conforme a estrutura do seu usuário logado
        .filter(c => c && !(formData.SharedWith || []).some(sw => sw.id === c.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <div className={formStyles.formGrid}>
                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Dados Fiscais</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="legalName">Razão Social / Nome Completo*</label>
                    <input type="text" id="legalName" name="legalName" value={formData.legalName} onChange={handleChange} className={formStyles.input} required autoFocus />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="tradeName">Nome Fantasia</label>
                    <input type="text" id="tradeName" name="tradeName" value={formData.tradeName} onChange={handleChange} className={formStyles.input} />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="cnpj">CNPJ / CPF</label>
                    <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} className={formStyles.input} maxLength="18" />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="inscricaoEstadual">Inscrição Estadual</label>
                    <input type="text" id="inscricaoEstadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} className={formStyles.input} />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="inscricaoMunicipal">Inscrição Municipal</label>
                    <input type="text" id="inscricaoMunicipal" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} className={formStyles.input} />
                </div>

                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Contato</h3>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="contactName">Nome do Contato Principal</label><input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="contactEmail">Email de Contato</label><input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="contactPhone">Telefone / WhatsApp</label><input type="text" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={formStyles.input} placeholder="5511999998888" /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="fiscalEmail">Email para Faturamento (NF)</label><input type="email" id="fiscalEmail" name="fiscalEmail" value={formData.fiscalEmail} onChange={handleChange} className={formStyles.input} /></div>
                
                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Endereço Fiscal</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="addressZipCode">CEP</label>
                    <input type="text" id="addressZipCode" name="addressZipCode" value={formData.addressZipCode} onChange={handleCepChange} className={formStyles.input} maxLength="9" />
                    {isCepLoading && <small className={formStyles.helperText}>Buscando...</small>}
                    {cepError && <small className={formStyles.errorText}>{cepError}</small>}
                </div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label} htmlFor="addressStreet">Logradouro</label><input type="text" id="addressStreet" name="addressStreet" value={formData.addressStreet} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="addressNumber">Número</label><input type="text" id="addressNumber" name="addressNumber" value={formData.addressNumber} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="addressComplement">Complemento</label><input type="text" id="addressComplement" name="addressComplement" value={formData.addressComplement} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="addressNeighborhood">Bairro</label><input type="text" id="addressNeighborhood" name="addressNeighborhood" value={formData.addressNeighborhood} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="addressCity">Cidade</label><input type="text" id="addressCity" name="addressCity" value={formData.addressCity} onChange={handleChange} className={formStyles.input} /></div>
                <div className={formStyles.formGroup}><label className={formStyles.label} htmlFor="addressState">Estado</label><input type="text" id="addressState" name="addressState" value={formData.addressState} onChange={handleChange} className={formStyles.input} /></div>
            </div>
            
            {formData.id && (
                <div className={shareStyles.shareSection}>
                    <h3 className={formStyles.sectionTitle}>Acesso Colaborativo</h3>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Compartilhar com:</label>
                        <select className={formStyles.select} onChange={(e) => handleShareWith(e.target.value)} value="">
                            <option value="" disabled>Selecione um colaborador para adicionar...</option>
                            {availableCollaborators.map(collab => (
                                <option key={collab.id} value={collab.id}>{collab.name}</option>
                            ))}
                        </select>
                    </div>
                    {(formData.SharedWith || []).length > 0 && (
                        <div className={shareStyles.sharedList}>
                            {formData.SharedWith.map(collab => (
                                <div key={collab.id} className={shareStyles.sharedTag}>
                                    <span>{collab.name}</span>
                                    <button onClick={() => handleStopSharing(collab.id)} className={shareStyles.removeButton}><IoCloseCircle size={18} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            <div className={formStyles.modalFooter}>
                <button onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                <button onClick={handleSave} className={formStyles.saveButton}>Salvar Cliente</button>
            </div>
        </Modal>
    );
}