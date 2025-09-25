import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './SessionExpiredPage.module.css'; // Estilos para a página
import { IoAlertCircleOutline } from 'react-icons/io5';

export default function SessionExpiredPage() {
  const router = useRouter();

  useEffect(() => {
    // Garante que o token seja limpo ao carregar esta página
    localStorage.removeItem('authToken');
  }, []);

  const handleRedirectToLogin = () => {
    router.push('/colaborativo/login');
  };

  return (
    <div className={`colab-theme ${styles.pageContainer}`}>
      <Head>
        <title>Sessão Expirada | Sistema Colaborativo</title>
      </Head>
      
      <div className={styles.contentCard}>
        <div className={styles.iconWrapper}>
          <IoAlertCircleOutline size={80} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Sua sessão expirou!</h1>
        <p className={styles.description}>
          Para sua segurança, você foi desconectado(a). Por favor, faça login novamente para continuar.
        </p>
        <button onClick={handleRedirectToLogin} className={styles.loginButton}>
          Fazer Login
        </button>
      </div>
    </div>
  );
}