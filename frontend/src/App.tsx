import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Dashboard } from './components/Dashboard';
import { AddApplicantForm } from './components/AddApplicantForm';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addApplicant'>('dashboard');

  const handleAddApplicant = () => {
    setCurrentView('addApplicant');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleApplicantCreated = () => {
    setCurrentView('dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentView === 'dashboard' ? (
        <Dashboard onAddApplicant={handleAddApplicant} />
      ) : (
        <AddApplicantForm onBack={handleBackToDashboard} onSuccess={handleApplicantCreated} />
      )}
    </ThemeProvider>
  );
}

export default App;
