import '../styles/globals.css';
import '../styles/calendar-custom.css';
import '../styles/colaborativo-global.css'; // 1. Importe o nosso novo CSS global aqui

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/authContext';
import { useRouter } from 'next/router'; // 2. Importe o useRouter
import { useEffect } from 'react'; // 2. Importe o useEffect

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // 3. Adicione este useEffect para controlar o estilo do body
  useEffect(() => {
    // Verifica se a URL atual começa com '/colaborativo'
    if (router.pathname.startsWith('/colaborativo')) {
      // Se estiver na nossa nova seção, força a cor de fundo escura
      // e remove qualquer classe de tema que o 'next-themes' possa ter adicionado
      document.body.style.backgroundColor = '#111111';
      document.documentElement.classList.remove('light', 'dark'); // Remove classes do ThemeProvider para não conflitar
    } else {
      // Se estiver em qualquer outra página, deixa o ThemeProvider controlar
      document.body.style.backgroundColor = ''; // Limpa o estilo inline para o CSS normal assumir
    }
  }, [router.pathname]); // Este efeito roda toda vez que a URL muda

  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;