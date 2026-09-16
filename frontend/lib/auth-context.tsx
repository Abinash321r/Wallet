'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { gqlClient } from './graphql-client';
import { ME_QUERY, LOGOUT_MUTATION } from './queries';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name?: string;
  mobile: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    
    
    
    gqlClient
      .request<{ me: User }>(ME_QUERY)
      .then((data) => setUser(data.me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await gqlClient.request(LOGOUT_MUTATION); 
    setUser(null);
     queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
