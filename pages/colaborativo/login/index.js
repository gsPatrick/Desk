import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../../services/colaborativo-api';
import LoadingModal from '../../../components-colaborativo/LoadingModal/LoadingModal';
import styles from './Login.module.css';
import Link from 'next/link'; // Adicionar esta importação no topo


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLabel, setUserLabel] = useState('dev'); // Para a animação: assume 'dev' ou busca do user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Pega o tipo de usuário do retorno da API para a animação
        setUserLabel(response.data.user.label); 
        
        // Simula um pequeno delay para a animação ser visível e suave
        setTimeout(() => {
          router.push('/colaborativo/dashboard');
        }, 3000); // Exibe o modal por 3 segundos para a animação
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
        setIsLoading(false); // Esconde o modal de loading em caso de erro
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Não foi possível fazer login. Verifique seu e-mail e senha.';
      setError(errorMessage);
      setIsLoading(false); // Esconde o modal de loading em caso de erro
    }
  };

  return (
    <div className={`colab-theme ${styles.pageContainer}`}>
      <Head>
        <title>Login | Sistema Colaborativo</title>
      </Head>
      
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Acessar Plataforma</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.footerText}>
          Não tem uma conta?{' '}
<Link href="/colaborativo/register">Cadastre-se</Link>
        </p>
      </div>
      
      {/* --- MODAL DE LOADING --- */}
      <LoadingModal isOpen={isLoading} userType={userLabel} />
    </div>
  );
}