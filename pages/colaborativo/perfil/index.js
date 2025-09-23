import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../../services/colaborativo-api';
import Header from '../../../components-colaborativo/Header/Header';
import styles from './Perfil.module.css';
import { IoPersonOutline, IoKeypadOutline, IoRocketOutline } from 'react-icons/io5';

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

    // Estado para os campos do formulário de integrações
    const [integrations, setIntegrations] = useState({ 
        enotasCompanyId: '', 
        enotasApiKey: '' 
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/users/me');
                setUser(response.data);
                // Preenche o formulário com os dados de integração existentes
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
        fetchUser();
    }, []);

    const handleIntegrationChange = (e) => {
        setIntegrations({ ...integrations, [e.target.name]: e.target.value });
    };

    const handleSaveIntegrations = async (e) => {
        e.preventDefault();
        try {
            // Usa o endpoint de atualização do usuário para salvar os novos campos de integração
            await api.patch('/users/me', integrations);
            alert("Credenciais de integração salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar integrações:", error);
            alert("Não foi possível salvar as credenciais. Tente novamente.");
        }
    };

    if (isLoading || !user) {
        return (
            <div className="colab-theme">
                <Header activePage="perfil" />
                <main className={styles.pageWrapper}>
                    <div className={styles.loading}>Carregando perfil...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="colab-theme">
            <Head><title>Meu Perfil | Sistema Colaborativo</title></Head>
            <Header activePage="perfil" />

            <main className={styles.pageWrapper}>
                <h1 className={styles.pageTitle}>{user.name}</h1>
                <p className={styles.pageSubtitle}>{user.email}</p>

                <div className={styles.tabs}>
                    <button className={`${styles.tabButton} ${activeTab === 'pessoal' ? styles.active : ''}`} onClick={() => setActiveTab('pessoal')}>
                        <IoPersonOutline /> Dados Pessoais
                    </button>
                    <button className={`${styles.tabButton} ${activeTab === 'plano' ? styles.active : ''}`} onClick={() => setActiveTab('plano')}>
                        <IoKeypadOutline /> Plano e Assinatura
                    </button>
                    {/* --- NOVA ABA DE INTEGRAÇÕES --- */}
                    <button className={`${styles.tabButton} ${activeTab === 'integracoes' ? styles.active : ''}`} onClick={() => setActiveTab('integracoes')}>
                        <IoRocketOutline /> Integrações
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'pessoal' && (
                        <div className={styles.section}>
                            <h2>Suas Informações</h2>
                            <div className={styles.infoGrid}>
                                <InfoItem label="Nome Completo" value={user.name} />
                                <InfoItem label="Email" value={user.email} />
                                <InfoItem label="CPF" value={user.cpf} />
                                <InfoItem label="Telefone" value={user.phone} />
                            </div>

                            {user.label === 'agency' && (
                                <>
                                    <h2 className={styles.sectionTitle}>Dados da Empresa</h2>
                                    <div className={styles.infoGrid}>
                                        <InfoItem label="Razão Social" value={user.companyName} />
                                        <InfoItem label="Nome Fantasia" value={user.companyFantasyName} />
                                        <InfoItem label="CNPJ" value={user.companyCnpj} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'plano' && (
                        <div className={styles.section}>
                            <h2>Seu Plano Atual</h2>
                            <p>Você está no plano <strong>{user.label === 'dev' ? 'Desenvolvedor' : 'Agência'}</strong>.</p>
                            <p>Aqui estarão as informações sobre sua assinatura, faturas e opções de upgrade/downgrade.</p>
                            <button className={styles.actionButton} disabled>Gerenciar Assinatura (Em Breve)</button>
                        </div>
                    )}

                    {activeTab === 'integracoes' && (
                        <div className={styles.section}>
                            <h2>eNotas - Emissão de NF-e</h2>
                            <p>Conecte sua conta do eNotas para emitir Notas Fiscais de Serviço (NFS-e) diretamente dos seus projetos.</p>
                            <form className={styles.form} onSubmit={handleSaveIntegrations}>
                                <div className={styles.formGroup}>
                                    <label>ID da Empresa no eNotas</label>
                                    <input 
                                        type="text" 
                                        name="enotasCompanyId" 
                                        value={integrations.enotasCompanyId} 
                                        onChange={handleIntegrationChange}
                                        className={styles.input}
                                        placeholder="Ex: 0a1b2c3d-..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Chave de API (Token)</label>
                                    <input 
                                        type="password" 
                                        name="enotasApiKey" 
                                        value={integrations.enotasApiKey} 
                                        onChange={handleIntegrationChange}
                                        className={styles.input}
                                        placeholder="Cole sua chave de API aqui"
                                    />
                                </div>
                                <button className={styles.actionButton} type="submit">Salvar Credenciais</button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}