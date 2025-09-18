import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Theme } from './types';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import MainLayout from './components/MainLayout';
import { ThemeContext } from './context/ThemeContext';
import { getTheme, saveTheme } from './services/storageService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    const body = window.document.body;
    if (theme === Theme.LIGHT) {
      body.classList.remove(Theme.DARK);
      body.classList.add(Theme.LIGHT);
    } else {
      body.classList.remove(Theme.LIGHT);
      body.classList.add(Theme.DARK);
    }
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Optimized splash screen time to 1.8 seconds for a fast yet smooth start
    const timer = setTimeout(() => {
      setAppState(AppState.AUTH);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setAppState(AppState.LOGGED_IN);
  };

  const handleLogout = () => {
    setAppState(AppState.AUTH);
  };

  const themeValue = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <SplashScreen />;
      case AppState.AUTH:
        return <AuthScreen onLogin={handleLogin} />;
      case AppState.LOGGED_IN:
        return <MainLayout onLogout={handleLogout} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="h-screen w-screen font-sans overflow-hidden flex items-center justify-center">
        <div className="relative h-full w-full max-w-lg mx-auto bg-white dark:bg-black backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;