// src/hooks/useAuth.js (CORRIGIDO - Conteúdo já estava correto, o problema era a exportação no context)

import { useContext } from 'react';
// Importa o contexto, que AGORA EXPORTA AuthContext
import { AuthContext } from '../contexts/authContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default useAuth;