import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/colaborativo-api';
import styles from './Header.module.css';
import { IoBriefcase, IoPeople, IoFolder, IoGrid, IoReceiptOutline, IoShareSocial,IoPerson, IoEye, IoEyeOff, IoExitOutline, IoSyncCircleOutline } from 'react-icons/io5'; // IoSyncCircleOutline para recorrências
import { useRouter } from 'next/router';

const NavLink = ({ href, icon, label, isActive }) => (
    <Link href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default function Header({ activePage }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // --- NOVO ESTADO PARA VISIBILIDADE DE DOCUMENTOS ---
    const [showDoc, setShowDoc] = useState(true); // Padrão visível

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário no header:", error);
                // Redirecionar para o login se não houver token ou for inválido
                if (!localStorage.getItem('authToken') && !router.pathname.startsWith('/colaborativo/login') && !router.pathname.startsWith('/colaborativo/register')) {
                    router.push('/colaborativo/login');
                }
            }
        };
        fetchUser();

        // --- PERSISTÊNCIA: Carrega estado do localStorage ---
        const storedShowDoc = localStorage.getItem('showDocInHeader');
        if (storedShowDoc !== null) {
            setShowDoc(JSON.parse(storedShowDoc));
        }
    }, [router.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // --- NOVO HANDLER PARA TOGGLE DO CPF/CNPJ ---
    const toggleShowDoc = () => {
        const newState = !showDoc;
        setShowDoc(newState);
        localStorage.setItem('showDocInHeader', JSON.stringify(newState)); // Salva no localStorage
    };

    // --- NOVO HANDLER PARA LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Limpa o token
        router.push('/colaborativo/login'); // Redireciona para o login
    };

    const formatCnpjCpfForDisplay = (doc) => {
        if (!doc) return '';
        doc = doc.replace(/\D/g, ''); // Remove não dígitos
        if (doc.length === 11) { // CPF
            return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (doc.length === 14) { // CNPJ
            return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return doc;
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link href="/colaborativo/dashboard" className={styles.logo}>OS</Link>
                
                <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Abrir menu de navegação">
                    <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <div className={styles.separator}></div>
<nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
    <NavLink href="/colaborativo/dashboard" label="Dashboard" icon={<IoGrid size={20} />} isActive={activePage === 'dashboard'} />
    <NavLink href="/colaborativo/projetos" label="Projetos" icon={<IoFolder size={20} />} isActive={activePage === 'projetos'} />
    <NavLink href="/colaborativo/clientes" label="Clientes" icon={<IoBriefcase size={20} />} isActive={activePage === 'clientes'} />
    <NavLink href="/colaborativo/despesas" label="Despesas" icon={<IoReceiptOutline size={20} />} isActive={activePage === 'despesas'} />
    {/* --- NOVO LINK --- */}
    <NavLink href="/colaborativo/recorrencias" label="Recorrências" icon={<IoSyncCircleOutline size={20} />} isActive={activePage === 'recorrencias'} />
    <NavLink href="/colaborativo/plataformas" label="Plataformas" icon={<IoShareSocial size={20} />} isActive={activePage === 'plataformas'} />
    <NavLink href="/colaborativo/colaboradores" label="Colaboradores" icon={<IoPeople size={20} />} isActive={activePage === 'colaboradores'} />
</nav>
            </div>

            <div className={styles.rightSection}>
                {user ? (
                    <Link href="/colaborativo/perfil" className={`${styles.userProfile} ${activePage === 'perfil' ? styles.profileActive : ''}`}>
                        <div className={styles.userAvatar}>
                            {(user.name || 'U').substring(0, 1)}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                            {/* --- EXIBIÇÃO DINÂMICA E BOTÃO DE TOGGLE --- */}
                            {user.label === 'agency' && (user.companyCnpj || user.companyFantasyName) && (
                                <div className={styles.docInfoWrapper}>
                                    <span className={styles.userDocLabel}>
                                        {showDoc ? (user.companyCnpj ? formatCnpjCpfForDisplay(user.companyCnpj) : user.companyFantasyName) : '•••.•••.•••-••'}
                                    </span>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowDoc(); }} className={styles.toggleDocButton}>
                                        {showDoc ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                                    </button>
                                </div>
                            )}
                            {user.label === 'dev' && user.cpf && (
                                <div className={styles.docInfoWrapper}>
                                    <span className={styles.userDocLabel}>
                                        {showDoc ? formatCnpjCpfForDisplay(user.cpf) : '•••.•••.•••-••'}
                                    </span>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowDoc(); }} className={styles.toggleDocButton}>
                                        {showDoc ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* --- BOTÃO DE LOGOUT --- */}
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLogout(); }} className={styles.logoutButton} title="Sair da conta">
                            <IoExitOutline size={20} />
                        </button>
                    </Link>
                ) : (
                    <div className={styles.userProfilePlaceholder}>
                        <IoPerson size={20} color="var(--colab-text-secondary)" />
                    </div>
                )}
            </div>
        </header>
    );
}