import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password) => {
    try {
      const { user, token } = await api.post('/api/auth/register', { email, password });
      localStorage.setItem('token', token);
      setUser(user);
      return { data: user, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user, token } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', token);
      setUser(user);
      return { data: user, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
