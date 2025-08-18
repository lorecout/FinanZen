
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
    onAuthStateChanged,
    User,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    getIdToken,
} from 'firebase/auth';
import { getDatabase, ref, onValue, set, push, remove, update, off } from "firebase/database";
import { auth, app } from '@/lib/firebase/client-app';
import { useRouter } from 'next/navigation';
import { type Transaction, type Goal, type Bill, type ShoppingItem } from '@/types';

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
  isPremium: boolean;
  transactions: Transaction[];
  goals: Goal[];
  bills: Bill[];
  shoppingItems: ShoppingItem[];
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPremium: () => void;
  deleteTransaction: (transactionId: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goal: Goal) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  deleteBill: (billId: string) => void;
  updateBill: (bill: Bill) => void;
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  deleteShoppingItem: (itemId: string) => void;
  updateShoppingItem: (item: ShoppingItem) => void;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);


  // Firebase Realtime Database
  const db = getDatabase(app);
  
  const fetchData = useCallback((userId: string) => {
    const dataRef = ref(db, 'users/' + userId);
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setTransactions(data.transactions ? Object.values(data.transactions) : []);
            setGoals(data.goals ? Object.values(data.goals) : []);
            setBills(data.bills ? Object.values(data.bills) : []);
            setShoppingItems(data.shoppingItems ? Object.values(data.shoppingItems) : []);
            setIsPremium(data.isPremium || false);
        } else {
            // No data for user, reset states
            setTransactions([]);
            setGoals([]);
            setBills([]);
            setShoppingItems([]);
            setIsPremium(false);
        }
    });
    return dataRef;
  }, [db]);


  useEffect(() => {
    let dataRef: any;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dataRef = fetchData(user.uid);
      } else {
        setUser(null);
        if (dataRef) {
          off(dataRef); // Detach listener
        }
        setTransactions([]);
        setGoals([]);
        setBills([]);
        setShoppingItems([]);
        setIsPremium(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (dataRef) {
        off(dataRef);
      }
    };
  }, [fetchData]);

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

  const upgradeToPremium = () => {
    if (user) {
        const userRef = ref(db, 'users/' + user.uid + '/isPremium');
        set(userRef, true);
    }
  };
  
  const refreshData = useCallback(() => {
    if (user) {
      const dataRef = ref(db, 'users/' + user.uid);
      off(dataRef); // Detach existing listener to avoid duplicates
      fetchData(user.uid); // Re-attach listener
    }
  }, [user, db, fetchData]);

  // --- Data Functions ---
  const deleteTransaction = (transactionId: string) => {
    if (user) {
        const transactionRef = ref(db, `users/${user.uid}/transactions/${transactionId}`);
        remove(transactionRef);
    }
  };
  
  const addGoal = (goal: Omit<Goal, 'id'>) => {
      if (user) {
          const goalsRef = ref(db, 'users/' + user.uid + '/goals');
          const newGoalRef = push(goalsRef);
          set(newGoalRef, { ...goal, id: newGoalRef.key });
      }
  };

  const deleteGoal = (goalId: string) => {
      if (user) {
          const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
          remove(goalRef);
      }
  };

  const updateGoal = (goal: Goal) => {
      if (user) {
          const goalRef = ref(db, `users/${user.uid}/goals/${goal.id}`);
          update(goalRef, goal);
      }
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    if (user) {
        const billsRef = ref(db, 'users/' + user.uid + '/bills');
        const newBillRef = push(billsRef);
        set(newBillRef, { ...bill, id: newBillRef.key });
    }
  };

  const deleteBill = (billId: string) => {
    if (user) {
        const billRef = ref(db, `users/${user.uid}/bills/${billId}`);
        remove(billRef);
    }
  };
  
  const updateBill = (bill: Bill) => {
    if (user) {
        const billRef = ref(db, `users/${user.uid}/bills/${bill.id}`);
        update(billRef, bill);
    }
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id'>) => {
    if (user) {
        const itemsRef = ref(db, 'users/' + user.uid + '/shoppingItems');
        const newItemRef = push(itemsRef);
        set(newItemRef, { ...item, id: newItemRef.key });
    }
  };

  const deleteShoppingItem = (itemId: string) => {
    if (user) {
        const itemRef = ref(db, `users/${user.uid}/shoppingItems/${itemId}`);
        remove(itemRef);
    }
  };

  const updateShoppingItem = (item: ShoppingItem) => {
    if (user) {
        const itemRef = ref(db, `users/${user.uid}/shoppingItems/${item.id}`);
        update(itemRef, item);
    }
  };


  return (
    <AuthContext.Provider value={{ 
        user, 
        loading, 
        isPremium,
        transactions,
        goals,
        bills,
        shoppingItems,
        login, 
        loginWithGoogle, 
        signup, 
        logout, 
        upgradeToPremium,
        deleteTransaction,
        addGoal,
        deleteGoal,
        updateGoal,
        addBill,
        deleteBill,
        updateBill,
        addShoppingItem,
        deleteShoppingItem,
        updateShoppingItem,
        refreshData
    }}>
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

    
    