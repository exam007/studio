
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

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
    
    if (email === 'narongtorn.s@attorney285.co.th') return true;

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
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const isRegistered = isUserRegistered(currentUser?.email || null);
      setIsRegisteredUserState(isRegistered);

      if (currentUser && !isRegistered) {
        // This flow is for new users signing up via Google
        const pendingRequests = JSON.parse(localStorage.getItem("pending_requests") || "[]");
        const existingRequest = pendingRequests.find((req: any) => req.email === currentUser.email);

        if (existingRequest) {
            toast({
                title: "กำลังรอการอนุมัติ",
                description: "คำขอเข้าสู่ระบบของคุณถูกส่งไปแล้ว โปรดรอการอนุมัติจากผู้ดูแลระบบ",
                variant: "default",
            });
        } else {
            const newRequest = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "No Name",
                photoURL: currentUser.photoURL || "",
            };
            pendingRequests.push(newRequest);
            localStorage.setItem("pending_requests", JSON.stringify(pendingRequests));
            // Dispatch storage event to notify other tabs/components like the admin sidebar
            window.dispatchEvent(new Event("storage"));
            
            toast({
                title: "ส่งคำขอสำเร็จ",
                description: "คำขอของคุณได้ถูกส่งไปให้ผู้ดูแลระบบเพื่อทำการอนุมัติแล้ว",
                variant: "default",
                duration: 9000,
            });
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

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
