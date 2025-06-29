import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css'; 
import '../styles/index.css'
import '@/styles/calendar-custom.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;