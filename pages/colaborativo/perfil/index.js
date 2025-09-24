import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../../services/colaborativo-api';
import Header from '../../../components-colaborativo/Header/Header';
import styles from './Perfil.module.css';
import { IoCheckmarkCircle, IoWarningOutline, IoSettingsOutline, IoLockClosedOutline, IoWalletOutline, IoRocketOutline } from 'react-icons/io5'; // Novos ícones

const InfoItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className={styles.infoItem}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    );
};

export default function PerfilPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pessoal');
    const [integrations, setIntegrations] = useState({ enotasCompanyId: '', enotasApiKey: '' });
    const [integrationMessage, setIntegrationMessage] = useState(''); // Mensagem de feedback da integração
    const [integrationError, setIntegrationError] = useState(''); // Erro da integração

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/users/me');
            setUser(response.data);
            setIntegrations({
                enotasCompanyId: response.data.enotasCompanyId || '',
                enotasApiKey: response.data.enotasApiKey || ''
            });
        } catch (error) {
            console.error("Erro ao buscar dados do perfil", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleIntegrationChange = (e) => {
        setIntegrations({ ...integrations, [e.target.name]: e.target.value });
    };

    const handleSaveIntegrations = async (e) => {
        e.preventDefault();
        setIntegrationMessage('');
        setIntegrationError('');
        try {
            await api.patch('/users/me', integrations); // Usa a rota de atualização do usuário
            setIntegrationMessage("Credenciais salvas com sucesso!");
            setTimeout(() => setIntegrationMessage(''), 3000);
            fetchUser(); // Recarrega o usuário para garantir que o estado seja o mais recente
        } catch (error) {
            setIntegrationError(error.response?.data?.message || "Erro ao salvar credenciais.");
            setTimeout(() => setIntegrationError(''), 3000);
        }
    };
    
    if (isLoading || !user) {
        return <div className="colab-theme"><Header activePage="perfil" /><div className={styles.loading}>Carregando perfil...</div></div>;
    }

    // Função auxiliar para formatar CNPJ/CPF
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

    return (
        <div className="colab-theme">
            <Head><title>Meu Perfil | Sistema Colaborativo</title></Head>
            <Header activePage="perfil" />

            <main className={styles.pageWrapper}>
                <h1 className={styles.pageTitle}>{user.name}</h1>
                <p className={styles.pageSubtitle}>{user.email}</p>

                <div className={styles.tabs}>
                    <button className={`${styles.tabButton} ${activeTab === 'pessoal' ? styles.active : ''}`} onClick={() => setActiveTab('pessoal')}><IoSettingsOutline /> Dados Pessoais</button>
                    <button className={`${styles.tabButton} ${activeTab === 'plano' ? styles.active : ''}`} onClick={() => setActiveTab('plano')}><IoRocketOutline /> Plano e Assinatura</button>
                    <button className={`${styles.tabButton} ${activeTab === 'integracoes' ? styles.active : ''}`} onClick={() => setActiveTab('integracoes')}><IoWalletOutline /> Integrações</button>
                    <button className={`${styles.tabButton} ${activeTab === 'seguranca' ? styles.active : ''}`} onClick={() => setActiveTab('seguranca')}><IoLockClosedOutline /> Segurança</button>
                </div>

                <div className={styles.tabContent}>
                    {/* --- Aba: Dados Pessoais --- */}
                    {activeTab === 'pessoal' && (
                        <div className={styles.section}>
                            <h2>Suas Informações</h2>
                            <div className={styles.infoGrid}>
                                <InfoItem label="Nome Completo" value={user.name} />
                                <InfoItem label="Email" value={user.email} />
                                <InfoItem label="CPF" value={formatCnpjCpf(user.cpf)} />
                                <InfoItem label="Telefone" value={user.phone} />
                            </div>

                            {user.label === 'agency' && (
                                <>
                                    <h2 className={styles.subTitle}>Dados da Empresa</h2>
                                    <div className={styles.infoGrid}>
                                        <InfoItem label="Razão Social" value={user.companyName} />
                                        <InfoItem label="Nome Fantasia" value={user.companyFantasyName} />
                                        <InfoItem label="CNPJ" value={formatCnpjCpf(user.companyCnpj)} />
                                    </div>
                                </>
                            )}
                            <button className={styles.editButton} disabled>Editar Dados (Em Breve)</button>
                        </div>
                    )}

                    {/* --- Aba: Plano e Assinatura --- */}
                    {activeTab === 'plano' && (
                        <div className={styles.section}>
                            <h2>Seu Plano Atual</h2>
                            <p>Você está no plano <strong>{user.label === 'dev' ? 'Desenvolvedor' : 'Agência'}</strong>.</p>
                            <p>Aqui você poderá visualizar detalhes da sua assinatura, histórico de faturas e opções para mudar de plano.</p>
                            <button className={styles.actionButton} disabled>Gerenciar Assinatura (Em Breve)</button>
                        </div>
                    )}

                    {/* --- Aba: Integrações --- */}
                    {activeTab === 'integracoes' && (
                        <div className={styles.section}>
                            <h2>Integrações Disponíveis</h2>
                            <p className={styles.sectionDescription}>Conecte seu sistema a outras ferramentas para automatizar processos e expandir funcionalidades.</p>

                            {/* Cartão de Integração: eNotas */}
                            <div className={styles.integrationCard}>
                                <div className={styles.integrationHeader}>
                                    <img src="/enotas.png" alt="Logo eNotas" className={styles.integrationLogo} />
                                    <h3>eNotas - Emissão de NF-e</h3>
                                    {integrations.enotasCompanyId && integrations.enotasApiKey ? (
                                        <span className={styles.integrationStatus}><IoCheckmarkCircle /> Conectado</span>
                                    ) : (
                                        <span className={`${styles.integrationStatus} ${styles.statusWarning}`}><IoWarningOutline /> Não Conectado</span>
                                    )}
                                </div>
                                <p className={styles.integrationDescription}>
                                    O eNotas é uma plataforma de automação para emissão de Notas Fiscais de Serviço (NFS-e) e de Produtos (NF-e). Conecte sua conta para gerar notas fiscais diretamente dos seus projetos e clientes.
                                </p>
                                <form className={styles.integrationForm} onSubmit={handleSaveIntegrations}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="enotasCompanyId" className={styles.label}>ID da Empresa no eNotas</label>
                                        <input type="text" id="enotasCompanyId" name="enotasCompanyId" value={integrations.enotasCompanyId} onChange={handleIntegrationChange} className={styles.input} placeholder="Seu Company ID do eNotas" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="enotasApiKey" className={styles.label}>Chave de API (Token)</label>
                                        <input type="password" id="enotasApiKey" name="enotasApiKey" value={integrations.enotasApiKey} onChange={handleIntegrationChange} className={styles.input} placeholder="Sua chave de API do eNotas" />
                                    </div>
                                    {integrationError && <p className={styles.errorMessage}>{integrationError}</p>}
                                    {integrationMessage && <p className={styles.successMessage}>{integrationMessage}</p>}
                                    <button className={styles.actionButton} type="submit">Salvar Credenciais</button>
                                </form>
                            </div>
                            
                            {/* Você pode adicionar mais cards de integração aqui no futuro */}
                            <div className={styles.integrationCard} style={{opacity: 0.5}}>
                                <div className={styles.integrationHeader}>
                                    {/* <img src="/integrations/github-logo.png" alt="Logo GitHub" className={styles.integrationLogo} /> */}
                                    <h3>GitHub</h3>
                                    <span className={`${styles.integrationStatus} ${styles.statusWarning}`}><IoWarningOutline /> Em Breve</span>
                                </div>
                                <p className={styles.integrationDescription}>Conecte seu GitHub para sincronizar repositórios e monitorar o progresso dos seus projetos.</p>
                                <button className={styles.actionButton} disabled>Conectar (Em Breve)</button>
                            </div>

                        </div>
                    )}

                    {/* --- Aba: Segurança --- */}
                    {activeTab === 'seguranca' && (
                        <div className={styles.section}>
                            <h2>Alterar Senha</h2>
                            <p>Para sua segurança, recomendamos o uso de senhas fortes e únicas.</p>
                            <form className={styles.form}>
                                <div className={styles.formGroup}><label className={styles.label}>Senha Atual</label><input type="password" disabled /></div>
                                <div className={styles.formGroup}><label className={styles.label}>Nova Senha</label><input type="password" disabled /></div>
                                <div className={styles.formGroup}><label className={styles.label}>Confirmar Nova Senha</label><input type="password" disabled /></div>
                                <button className={styles.actionButton} disabled>Salvar Nova Senha (Em Breve)</button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}