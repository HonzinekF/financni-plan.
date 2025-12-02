import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'fp_auth_token';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [authed, setAuthed] = useState(false);

  const password = import.meta.env.VITE_APP_PASSWORD || '';

  useEffect(() => {
    if (!password) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === password) {
      setAuthed(true);
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Není nastaveno heslo VITE_APP_PASSWORD (viz .env / Vercel).');
      return;
    }
    if (input === password) {
      localStorage.setItem(STORAGE_KEY, password);
      setAuthed(true);
      setError('');
    } else {
      setError('Nesprávné heslo.');
    }
  };

  if (!password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full border border-amber-200">
          <h1 className="text-lg font-bold text-slate-800 mb-2">Chybí heslo</h1>
          <p className="text-sm text-slate-600 mb-4">
            Nastavte proměnnou <code className="font-mono">VITE_APP_PASSWORD</code> v <code>.env.local</code> (lokálně) a ve Vercel prostředí (Production + Preview).
          </p>
          <p className="text-sm text-slate-600">
            Poté znovu spusťte build/deploy. Bez hesla bude web stále veřejný.
          </p>
        </div>
      </div>
    );
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-sm w-full border border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Přihlášení</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Heslo</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Vstoupit
          </button>
        </form>
      </div>
    </div>
  );
};
