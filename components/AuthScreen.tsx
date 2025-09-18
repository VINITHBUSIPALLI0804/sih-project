import React, { useState, useEffect } from 'react';
import { isEmailTaken, addUser } from '../services/storageService';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [isLogin, email, password, name]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const validateEmail = (em: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(em)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSignUp = () => {
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }
    if (isEmailTaken(email)) {
      setError('This email address is already registered.');
      return;
    }
    addUser({ name, email, password });
    onLogin();
  };

  const handleLogin = () => {
    // Basic login simulation. In a real app, this would check credentials.
    onLogin();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-transparent p-6 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-sm bg-white/30 dark:bg-black/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome</h1>
          <p className="text-gray-700 dark:text-gray-300">Sign in to explore our heritage.</p>
        </div>

        <div className="flex border-b border-gray-400 dark:border-gray-600 mb-6">
          <button onClick={() => setIsLogin(true)} aria-pressed={isLogin} className={`w-1/2 py-3 font-semibold text-center transition-colors ${isLogin ? 'text-yellow-500 dark:text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-600 dark:text-gray-400'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} aria-pressed={!isLogin} className={`w-1/2 py-3 font-semibold text-center transition-colors ${!isLogin ? 'text-yellow-500 dark:text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-600 dark:text-gray-400'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-800 dark:text-gray-300">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full bg-white/50 dark:bg-black/50 border border-gray-400 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                  aria-required="true" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-white/50 dark:bg-black/50 border border-gray-400 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
              aria-required="true" aria-invalid={!!error && (error.includes('email') || error.includes('registered'))} aria-describedby="auth-error"/>
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-gray-800 dark:text-gray-300">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-white/50 dark:bg-black/50 border border-gray-400 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
              aria-required="true" aria-invalid={!!error && error.includes('password')} aria-describedby="auth-error"/>
          </div>

          {error && <p id="auth-error" role="alert" className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

          <div className='pt-4'>
            <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-900 ring-yellow-500 transition-transform active:scale-95 shadow-lg">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;