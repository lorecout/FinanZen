
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    getAuth,
    onAuthStateChanged,
    User,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client-app';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Firebase error handler
const getFirebaseAuthErrorMessage = (error: any): string => {
    if (error.code) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'O formato do email é inválido.';
            case 'auth/user-disabled':
                return 'Este usuário foi desabilitado.';
            case 'auth/user-not-found':
                return 'Nenhum usuário encontrado com este email.';
            case 'auth/wrong-password':
                return 'Senha incorreta. Tente novamente.';
            case 'auth/email-already-in-use':
                return 'Este email já está sendo usado por outra conta.';
            case 'auth/weak-password':
                return 'A senha é muito fraca. Tente uma senha mais forte.';
            case 'auth/popup-closed-by-user':
                return 'O processo de login com Google foi cancelado.';
            default:
                return 'Ocorreu um erro desconhecido. Tente novamente.';
        }
    }
    return error.message;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if(user) {
        router.push('/');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const login = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }
  };
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }
  };

  const signup = async (email: string, pass: string) => {
     try {
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }
  };

  const logout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error: any) {
         throw new Error(getFirebaseAuthErrorMessage(error));
    }
  };
  
  // This wrapper ensures that children are only rendered when loading is complete
  if (loading) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
