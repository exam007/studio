
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isRegisteredUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isRegisteredUser: false,
});

const isUserRegistered = (email: string | null): boolean => {
    if (typeof window === 'undefined' || !email) return false;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("user_")) {
            const item = localStorage.getItem(key);
            if(item){
                try {
                    const storedUser = JSON.parse(item);
                    if (storedUser.email && storedUser.email.toLowerCase() === email.toLowerCase()) {
                        return true;
                    }
                } catch(e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        }
    }
    return false;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegisteredUser, setIsRegisteredUserState] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsRegisteredUserState(isUserRegistered(currentUser?.email || null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isRegisteredUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
