import '../styles/globals.css';
import '../styles/calendar-custom.css';
import '../styles/colaborativo-global.css';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Removido: SessionExpiredModal e a lógica de setGlobalSessionExpiredModal

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Efeito para controlar o estilo do body e html
  useEffect(() => {
    if (router.pathname.startsWith('/colaborativo')) {
      document.body.style.backgroundColor = '#111111'; 
      document.documentElement.classList.remove('light', 'dark'); 

      // Aplica overflow-y: hidden SOMENTE para o Dashboard
      if (router.pathname === '/colaborativo/dashboard') {
        document.body.style.overflowY = 'hidden';
        document.documentElement.style.overflowY = 'hidden';
      } else {
        // Restaura o scroll normal para todas as outras páginas
        document.body.style.overflowY = 'auto'; 
        document.documentElement.style.overflowY = 'auto';
      }

    } else {
      // Limpa os estilos inline para outras páginas
      document.body.style.backgroundColor = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflowY = '';
    }
  }, [router.pathname]);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
        {/* Removido: <SessionExpiredModal /> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;