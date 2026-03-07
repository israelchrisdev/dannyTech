import { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ebayCloneUser');
    return saved ? JSON.parse(saved) : null;
  });

  const persistUser = (nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem('ebayCloneUser', JSON.stringify(nextUser));
    localStorage.setItem('ebayCloneToken', token);
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    persistUser(response.data.user, response.data.token);
    return response.data;
  };

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    persistUser(response.data.user, response.data.token);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ebayCloneUser');
    localStorage.removeItem('ebayCloneToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
