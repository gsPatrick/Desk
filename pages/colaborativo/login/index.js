import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../../services/colaborativo-api';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      
      // Se a API retornou um token, o login foi bem-sucedido
      if (response.data.token) {
        // Salva o token no localStorage para ser usado em futuras requisições
        localStorage.setItem('authToken', response.data.token);
        
        // Redireciona o usuário para o dashboard
        router.push('/colaborativo/dashboard');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    } catch (err) {
      // Pega a mensagem de erro da API (ex: "Credenciais inválidas")
      const errorMessage = err.response?.data?.error || 'Não foi possível fazer login. Verifique seu e-mail e senha.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
          <a href="/colaborativo/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}