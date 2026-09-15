import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'landowner' | 'farmer' | 'developer' | 'government' | 'soilExpert' | 'consultant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isPremium?: boolean;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (data: { name: string; email: string; phone?: string; password: string; role: UserRole }) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  demoLogin: (role: UserRole) => Promise<UserRole>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-verify token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('landvista_token');
    const savedUser = localStorage.getItem('landvista_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }

      // Verify token with backend
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.user) {
            setUser(data.user);
            localStorage.setItem('landvista_user', JSON.stringify(data.user));
          } else {
            // Invalidate if token rejected
            logout();
          }
        })
        .catch(() => {
          // If server is offline, keep cached demo user
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await response.json();

      if (data?.success && data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('landvista_token', data.token);
        localStorage.setItem('landvista_user', JSON.stringify(data.user));
        return { success: true, role: data.user.role };
      } else {
        return { success: false, message: data?.message || 'Invalid email or password.' };
      }
    } catch (err) {
      // Fallback for demo login if offline
      return { success: false, message: 'Backend unavailable. Please use SIH Demo Accounts.' };
    }
  };

  const register = async (formData: { name: string; email: string; phone?: string; password: string; role: UserRole }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data?.success && data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('landvista_token', data.token);
        localStorage.setItem('landvista_user', JSON.stringify(data.user));
        return { success: true, role: data.user.role };
      } else {
        return { success: false, message: data?.message || 'Registration failed.' };
      }
    } catch (err) {
      return { success: false, message: 'Connection error during registration.' };
    }
  };

  const demoLogin = async (role: UserRole): Promise<UserRole> => {
    const demoCreds: Record<string, { email: string; pass: string; name: string }> = {
      landowner: { email: 'demo@landvista.ai', pass: 'Demo@123', name: 'Pratik Mishra (Landowner)' },
      government: { email: 'government@landvista.ai', pass: 'Government@123', name: 'Gov Authority (PMRDA/CIDCO)' },
      soilExpert: { email: 'expert@landvista.ai', pass: 'Expert@123', name: 'Dr. Ramesh Patil (Soil Agronomist)' },
      developer: { email: 'developer@landvista.ai', pass: 'Developer@123', name: 'Vikram Singhania (Developer)' },
      admin: { email: 'admin@landvista.ai', pass: 'Admin@123', name: 'LandVista Root Administrator' },
      farmer: { email: 'farmer@landvista.ai', pass: 'Farmer@123', name: 'Kisan Ramesh (Farmer)' },
      consultant: { email: 'consultant@landvista.ai', pass: 'Demo@123', name: 'Advisory Consultant' }
    };

    const cred = demoCreds[role] || demoCreds.landowner;
    const res = await login(cred.email, cred.pass);
    if (res.success && res.role) {
      return res.role;
    }

    // Direct client fallback if backend is busy
    const fallbackUser: User = {
      id: 'demo-' + role,
      name: cred.name,
      email: cred.email,
      role: role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`
    };
    setUser(fallbackUser);
    setToken('demo-token-' + role);
    localStorage.setItem('landvista_token', 'demo-token-' + role);
    localStorage.setItem('landvista_user', JSON.stringify(fallbackUser));
    return role;
  };

  const logout = () => {
    try {
      fetch('http://localhost:5000/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('landvista_token');
    localStorage.removeItem('landvista_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
