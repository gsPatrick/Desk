import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/colaborativo-api';
import styles from './Header.module.css';
import { IoBriefcase, IoPeople, IoFolder, IoGrid, IoReceiptOutline, IoPerson, IoShareSocial } from 'react-icons/io5';

const NavLink = ({ href, icon, label, isActive }) => (
    <Link href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default function Header({ activePage }) {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário no header:", error);
                // Em caso de erro (ex: token inválido), redirecionar para o login
                // if (typeof window !== 'undefined' && window.location.pathname !== '/colaborativo/login' && window.location.pathname !== '/colaborativo/register') {
                //     window.location.href = '/colaborativo/login';
                // }
            }
        };
        fetchUser();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                            {user.label === 'agency' && user.companyFantasyName && (
                                <span className={styles.userRole}>{user.companyFantasyName}</span>
                            )}
                            {user.label === 'dev' && user.cpf && (
                                <span className={styles.userRole}>CPF: {user.cpf}</span>
                            )}
                        </div>
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