// src/hooks/useMediaQuery.js

import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      // Define o estado inicial corretamente
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      // Adiciona o listener
      const listener = () => {
        setMatches(media.matches);
      };
      // Use addEventListener para compatibilidade futura
      media.addEventListener('change', listener);
      // Limpeza: remove o listener
      return () => media.removeEventListener('change', listener);
    }
    // Retorna uma função de limpeza mesmo se typeof window === 'undefined'
    return () => {};
  }, [query, matches]); // Depende apenas do query string e do próprio estado matches

  return matches;
};

export default useMediaQuery;