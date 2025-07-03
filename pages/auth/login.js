// pages/auth/login.js (COMPLETO)

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mensagens de erro ESPECÍFICAS DESTE FORMULÁRIO DE LOGIN
  const [error, setError] = useState(null);

  // Obter funções e estado de autenticação global
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirecionamento se já estiver autenticado é feito em _app.js pelo AuthWrapper.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Limpa erros locais anteriores

    try {
      const user = await login(formData.email, formData.password);
      console.log('Login realizado com sucesso:', user.email);
       // O AuthWrapper em _app.js irá detectar a autenticação e redirecionar,
       // mas um push explícito aqui garante o redirecionamento imediato
      router.push('/finance/dashboard');
    } catch (err) {
      console.error('Erro no login (UI):', err.message); // Loga a mensagem tratada
      // O erro capturado AQUI é o erro (string) lançado pelo AuthContext.login
      setError(err.message); // Exibe a mensagem de erro tratada para o usuário
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login | Finance OS</title></Head>

      <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-black/5 dark:border-white/10"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Acessar Conta</h1>

           {/* Exibe o erro local do formulário */}
           {error && (
             <motion.p
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-red-500 text-sm text-center mb-4"
             >
                 {error}
             </motion.p>
           )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                 disabled={isLoading}
                className="w-full p-3 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                 disabled={isLoading}
                className="w-full p-3 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
            </div>
             {/* TODO: Link para "Esqueceu sua senha?" */}
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-finance-pink text-white font-semibold rounded-lg shadow-lg transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              {!isLoading && <ArrowRightIcon className="h-5 w-5"/>}
            </motion.button>
          </form>

          <p className="text-center text-sm text-light-subtle dark:text-dark-subtle mt-6">
            Não tem uma conta?{' '}
            <Link href="/auth/register" className="text-blue-500 hover:underline">
              Registre-se
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}