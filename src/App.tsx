import { ThemeProvider } from '@mui/material';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { theme } from './theme';
import { publicRoutes, protectedRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const element = useRoutes(isAuthenticated ? protectedRoutes : publicRoutes);
  return element;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
