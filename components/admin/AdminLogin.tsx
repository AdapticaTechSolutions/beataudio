import React, { useState } from 'react';
import { authApi } from '../../lib/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username });
      const response = await authApi.login(username, password);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        console.log('Login successful, storing user data');
        // Store user info in localStorage
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        setError('');
        onLoginSuccess();
      } else {
        console.error('Login failed:', response.error);
        setError(response.error || 'Invalid username or password.');
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      // Provide more helpful error messages
      const errorMessage = err.message || 'Login failed. Please try again.';
      if (errorMessage.includes('pattern')) {
        setError('Database configuration error. Please contact administrator.');
      } else if (errorMessage.includes('Database error')) {
        setError('Unable to connect to database. Please check configuration.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative z-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-card">
        <h1 className="text-3xl font-serif font-bold text-center text-black">Admin Portal</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-bold text-darkGray block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-darkGray block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-lightGray border border-mediumGray rounded-md p-3 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all"
              placeholder="password"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primaryRed text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
         <div className="text-center text-darkGray text-sm">
            <a href="#" className="hover:text-primaryRed">&larr; Back to Main Site</a>
        </div>
      </div>
    </div>
  );
};
