// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

import ClienteContext from './contexts/ClienteContext';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function App() {
  const [cliente, setCliente] = useState({idCliente: 10075, nome: 'Roberto Vidigal'})

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <ClienteContext.Provider value={{cliente, setCliente}}>
        <Router />
      </ClienteContext.Provider>
    </ThemeProvider>
  );
}
