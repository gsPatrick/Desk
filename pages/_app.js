// pages/_app.js (MODIFICADO)

import '../styles/globals.css';
import '../styles/calendar-custom.css'; // Importa o CSS customizado do FullCalendar
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/authContext'; // Importa o AuthProvider

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolve toda a aplicação com o AuthProvider */}
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;