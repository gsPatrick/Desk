  import { useState } from 'react';
  import Head from 'next/head';
  import { useRouter } from 'next/router';
  import api from '../../../services/colaborativo-api';
  import styles from '../login/Login.module.css';
  import { AnimatePresence, motion } from 'framer-motion';

  // Estado inicial do formulário
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    companyName: '',
    companyFantasyName: '',
    companyCnpj: '',
  };

  export default function RegisterPage() {
    const router = useRouter();
    const [label, setLabel] = useState('dev'); // 'dev' ou 'agency'
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setIsLoading(true);

      const dataToSend = {
        ...formData,
        label,
      };

      try {
        await api.post('/users/register', dataToSend);
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          router.push('/colaborativo/login');
        }, 2000);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Não foi possível realizar o cadastro.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className={`colab-theme ${styles.pageContainer}`}>
        <Head>
          <title>Cadastro | Sistema Colaborativo</title>
        </Head>
        
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Criar Nova Conta</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
              {/* --- SELEÇÃO DE TIPO DE CONTA --- */}
              <div className={styles.inputGroup}>
                  <label className={styles.label}>Tipo de Conta</label>
                  <div className={styles.radioToggle}>
                      <label className={label === 'dev' ? styles.active : ''}>
                          <input type="radio" name="label" value="dev" checked={label === 'dev'} onChange={(e) => setLabel(e.target.value)} />
                          Desenvolvedor
                      </label>
                      <label className={label === 'agency' ? styles.active : ''}>
                          <input type="radio" name="label" value="agency" checked={label === 'agency'} onChange={(e) => setLabel(e.target.value)} />
                          Agência
                      </label>
                  </div>
              </div>

              {/* --- DADOS PESSOAIS (COMUNS A AMBOS) --- */}
              <div className={styles.inputGroup}><label htmlFor="name" className={styles.label}>Nome Completo</label><input type="text" id="name" name="name" className={styles.input} value={formData.name} onChange={handleChange} required autoFocus /></div>
              <div className={styles.inputGroup}><label htmlFor="email" className={styles.label}>E-mail</label><input type="email" id="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} required /></div>
              <div className={styles.inputGroup}><label htmlFor="password" className={styles.label}>Senha (mín. 6 caracteres)</label><input type="password" id="password" name="password" className={styles.input} value={formData.password} onChange={handleChange} required minLength="6" /></div>
              <div className={styles.inputGroup}><label htmlFor="cpf" className={styles.label}>CPF</label><input type="text" id="cpf" name="cpf" className={styles.input} value={formData.cpf} onChange={handleChange} /></div>
              <div className={styles.inputGroup}><label htmlFor="phone" className={styles.label}>Telefone / WhatsApp</label><input type="text" id="phone" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} /></div>

              {/* --- DADOS DA EMPRESA (APENAS PARA AGÊNCIA) --- */}
              <AnimatePresence>
                  {label === 'agency' && (
                      <motion.div
                          className={styles.agencyFields}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                      >
                          <h3 className={styles.sectionTitle}>Dados da Empresa</h3>
                          <div className={styles.inputGroup}><label htmlFor="companyName" className={styles.label}>Razão Social</label><input type="text" id="companyName" name="companyName" className={styles.input} value={formData.companyName} onChange={handleChange} /></div>
                          <div className={styles.inputGroup}><label htmlFor="companyFantasyName" className={styles.label}>Nome Fantasia</label><input type="text" id="companyFantasyName" name="companyFantasyName" className={styles.input} value={formData.companyFantasyName} onChange={handleChange} /></div>
                          <div className={styles.inputGroup}><label htmlFor="companyCnpj" className={styles.label}>CNPJ</label><input type="text" id="companyCnpj" name="companyCnpj" className={styles.input} value={formData.companyCnpj} onChange={handleChange} /></div>
                      </motion.div>
                  )}
              </AnimatePresence>

              {error && <p className={styles.errorMessage}>{error}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}

              <button type="submit" className={styles.button} disabled={isLoading || success}>{isLoading ? 'Cadastrando...' : 'Criar Conta'}</button>
          </form>

          <p className={styles.footerText}>Já tem uma conta?{' '}<a href="/colaborativo/login">Faça login</a></p>
        </div>
      </div>
    );
  }