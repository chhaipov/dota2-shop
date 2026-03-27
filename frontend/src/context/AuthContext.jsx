import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      try {
        const payload = JSON.parse(atob(access.split('.')[1]));
        setUser({ username: payload.username ?? 'user' });
      } catch {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }
    setLoading(false);
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      setUser({ username: payload.username ?? 'user' });
    } catch {
      setUser({ username: 'user' });
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
