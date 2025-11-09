import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO: Replace with actual backend authentication
const MOCK_ADMINS = [
  { username: 'admin1', password: 'admin123' },
  { username: 'admin2', password: 'admin456' },
  { username: 'editor1', password: 'editor123' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // TODO: Replace with actual API call
    const admin = MOCK_ADMINS.find(
      a => a.username === username && a.password === password
    );
    
    if (admin) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
