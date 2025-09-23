import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/colaborativo-api';
import styles from './Header.module.css';
import { IoBriefcase, IoPeople, IoFolder, IoGrid, IoReceiptOutline } from 'react-icons/io5';

const NavLink = ({ href, icon, label, isActive }) => (
    <Link href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default function Header({ activePage }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário no header:", error);
                // Em um app de produção, um erro aqui (ex: token inválido)
                // deveria redirecionar para a página de login.
                // Ex: window.location.href = '/colaborativo/login';
            }
        };
        fetchUser();
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link href="/colaborativo/dashboard" className={styles.logo}>OS</Link>
                <div className={styles.separator}></div>
                <nav className={styles.navLinks}>
                    <NavLink href="/colaborativo/dashboard" label="Dashboard" icon={<IoGrid size={20} />} isActive={activePage === 'dashboard'} />
                    <NavLink href="/colaborativo/projetos" label="Projetos" icon={<IoFolder size={20} />} isActive={activePage === 'projetos'} />
                    <NavLink href="/colaborativo/clientes" label="Clientes" icon={<IoBriefcase size={20} />} isActive={activePage === 'clientes'} />
                    <NavLink href="/colaborativo/despesas" label="Despesas" icon={<IoReceiptOutline size={20} />} isActive={activePage === 'despesas'} />
                    <NavLink href="/colaborativo/colaboradores" label="Colaboradores" icon={<IoPeople size={20} />} isActive={activePage === 'colaboradores'} />
                </nav>
            </div>

            <div className={styles.rightSection}>
                {user ? (
                    <Link href="/colaborativo/perfil" className={styles.userProfile}>
                        <div className={styles.userAvatar}>
                            {(user.name || 'U').substring(0, 1).toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                            {user.label === 'agency' && user.companyFantasyName && (
                                <span className={styles.userRole}>{user.companyFantasyName}</span>
                            )}
                             {user.label === 'agency' && !user.companyFantasyName && user.companyCnpj && (
                                <span className={styles.userRole}>CNPJ: {user.companyCnpj}</span>
                            )}
                        </div>
                    </Link>
                ) : (
                    // Placeholder para evitar que o layout "pule" enquanto os dados carregam
                    <div className={styles.userProfile} style={{ minWidth: '150px' }}>
                        <div className={styles.userAvatar} style={{ backgroundColor: 'var(--colab-surface)' }}></div>
                    </div>
                )}
            </div>
        </header>
    );
}