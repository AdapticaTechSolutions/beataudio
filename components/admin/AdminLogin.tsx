import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: This is a mock login for demonstration purposes only.
    // In a real application, use a secure authentication method.
    if (username === 'admin' && password === 'password') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-lightGray flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-card">
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
            className="w-full bg-primaryRed text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300"
          >
            Login
          </button>
        </form>
         <div className="text-center text-darkGray text-sm">
            <a href="#" className="hover:text-primaryRed">&larr; Back to Main Site</a>
        </div>
      </div>
    </div>
  );
};
