// src/contexts/AuthContext.js (Versão corrigida na chamada da API de registro)

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api'; // Importa o cliente API configurado
// import { parseISO } from 'date-fns'; // Não usado neste contexto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado de erro global (mantido para consistência, embora as páginas tratem)

  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider: Effect - Initial Load Check");
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;


    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log("AuthProvider: Found stored user and token.");
      } catch (e) {
        console.error("AuthProvider: Error parsing stored data:", e);
        // Limpa dados inválidos no localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setUser(null);
        setToken(null);
         console.log("AuthProvider: Cleared invalid stored data.");
      }
    }
    setLoading(false);
    console.log("AuthProvider: Initial Load Check Complete.");
  }, []);

  // Lidar com eventos de desautorização (disparado pelo interceptor 401 no api.js)
  useEffect(() => {
      const handleUnauthorized = () => {
          console.log('AuthProvider: Event unauthorized captured. Logging out.');
          logout();
          // Redirecionamento é gerenciado pelo AuthWrapper em _app.js
      };
      if (typeof window !== 'undefined') {
          window.addEventListener('unauthorized', handleUnauthorized);
      }
      return () => {
           if (typeof window !== 'undefined') {
               window.removeEventListener('unauthorized', handleUnauthorized);
           }
      };
  }, [router]);


  const login = async (email, password) => {
    console.log("AuthProvider: Attempting login...");
    setLoading(true);
    setError(null);
    try {
      // Chama a API de login
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: jwtToken } = response.data.data;

      if (!userData || !jwtToken) {
          throw new Error("API de login retornou dados inválidos (usuário ou token ausente).");
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }


      setUser(userData);
      setToken(jwtToken);

      setLoading(false);
      console.log("AuthProvider: Login successful for user:", userData.email);
      return userData;
    } catch (error) {
      console.error("AuthProvider: Error during login:", error);
      // --- Lidar com erros de rede, servidor, ou API ---
      let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
      if (error.response) {
          if (error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message; // Mensagem específica da API
          } else {
              errorMessage = `Erro do servidor: ${error.response.status} ${error.response.statusText}`;
          }
      } else if (error.request) {
          errorMessage = 'Erro de conexão. O servidor pode estar offline ou inacessível.';
      } else {
          errorMessage = error.message || 'Erro ao preparar a requisição.';
      }

      // Limpa qualquer estado de login parcial
      if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
      }
      setUser(null);
      setToken(null);
      setLoading(false);

      // Lança um novo erro com a mensagem tratada para o componente de UI
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
     console.log("AuthProvider: Attempting registration...");
     setLoading(true);
     setError(null);
     try {
       // !!! CORRIGIDO: CHAMA O NOVO ENDPOINT DE REGISTRO !!!
       const response = await api.post('/auth/register', userData); // <-- Endpoint correto
       const newUser = response.data.data;

        if (!newUser) {
            throw new Error("API de registro não retornou os dados do novo usuário.");
        }

       // Opcional: Logar automaticamente após o registro (Se o backend de login suportar e você quiser esse fluxo)
        // Note: se você logar aqui, precisará da senha original nos dados de registro.
        // Se o backend de registro retornar um token (menos comum, mas possível), pode usá-lo.
        // Pelo fluxo atual, o usuário é apenas registrado e precisa fazer login separadamente.

       setLoading(false);
       console.log("AuthProvider: Registration successful for user:", newUser.email);
       return newUser; // Retorna o objeto de usuário criado (sem senha)
     } catch (error) {
       console.error("AuthProvider: Error during registration:", error);
       // --- Lidar com erros de rede, servidor, ou API ---
       let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
       if (error.response) {
           if (error.response.data && error.response.data.message) {
               errorMessage = error.response.data.message;
           } else {
               errorMessage = `Erro do servidor: ${error.response.status} ${error.response.statusText}`;
           }
       } else if (error.request) {
           errorMessage = 'Erro de conexão. O servidor pode estar offline ou inacessível.';
       } else {
           errorMessage = error.message || 'Erro ao preparar a requisição.';
       }

       setLoading(false);
       // Lança um novo erro com a mensagem tratada para o componente de UI
       throw new Error(errorMessage);
     }
  };

  const logout = () => {
    console.log('AuthProvider: Performing logout...');
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    setUser(null);
    setToken(null);
    setError(null);
    setLoading(false);
    // Redirecionamento feito em _app.js
  };

  const authState = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    // Expor o erro global (opcional, mas pode ser útil para a UI)
    // error, // Removido para evitar conflitos com erros de formulário locais
    login,
    logout,
    register, // Expõe a função register
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};