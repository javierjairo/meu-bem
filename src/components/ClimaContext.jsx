import { createContext, useContext } from 'react';

export const ClimaContext = createContext({
  clima: null,
  carregando: true,
});

export function useClima() {
  return useContext(ClimaContext);
}
