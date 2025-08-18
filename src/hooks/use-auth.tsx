
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
import { getDatabase, ref, onValue, set, push, remove, update, off, get, child, Unsubscribe } from "firebase/database";
import { auth, app } from '@/lib/firebase/client-app';
import { useRouter } from 'next/navigation';
import { type Transaction, type Goal, type Bill, type ShoppingItem } from '@/types';
import { useToast } from './use-toast';
import { subDays } from 'date-fns';

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
  updateTransaction: (transaction: Transaction) => void;
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
  editCategory: (oldName: string, newName: string) => void;
  deleteCategory: (categoryName: string) => void;
  addDummyTransactions: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);


  // Firebase Realtime Database
  const db = getDatabase(app);
  
  const fetchData = useCallback((userId: string): Unsubscribe => {
    const dataRef = ref(db, 'users/' + userId);
    return onValue(dataRef, (snapshot) => {
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
    }, (error) => {
        console.error("Firebase data fetching error:", error);
        toast({
            variant: "destructive",
            title: "Erro de Conexão",
            description: "Não foi possível carregar seus dados. Verifique sua conexão e tente novamente."
        })
        // Clear local data on error to prevent showing stale info
        setTransactions([]);
        setGoals([]);
        setBills([]);
        setShoppingItems([]);
        setIsPremium(false);
    });
  }, [db, toast]);


  useEffect(() => {
    let unsubscribeFromData: Unsubscribe | undefined;
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        unsubscribeFromData = fetchData(user.uid);
      } else {
        setUser(null);
        if (unsubscribeFromData) {
          unsubscribeFromData(); // Detach listener
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
      unsubscribeFromAuth();
      if (unsubscribeFromData) {
        unsubscribeFromData();
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
      get(dataRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            setTransactions(data.transactions ? Object.values(data.transactions) : []);
            setGoals(data.goals ? Object.values(data.goals) : []);
            setBills(data.bills ? Object.values(data.bills) : []);
            setShoppingItems(data.shoppingItems ? Object.values(data.shoppingItems) : []);
            setIsPremium(data.isPremium || false);
        }
      }).catch((error) => {
         console.error("Firebase data refresh error:", error);
         toast({
            variant: "destructive",
            title: "Erro de Sincronização",
            description: "Não foi possível atualizar seus dados."
        })
      })
    }
  }, [user, db, toast]);

  // --- Data Functions ---
  const deleteTransaction = (transactionId: string) => {
    if (user) {
        const transactionRef = ref(db, `users/${user.uid}/transactions/${transactionId}`);
        remove(transactionRef);
    }
  };
  
  const updateTransaction = (transaction: Transaction) => {
    if (user) {
      const transactionRef = ref(db, `users/${user.uid}/transactions/${transaction.id}`);
      update(transactionRef, transaction);
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
  
  // --- Category Management Functions ---
  const editCategory = async (oldName: string, newName: string) => {
    if (!user) return;
    const transactionsRef = ref(db, `users/${user.uid}/transactions`);
    const snapshot = await get(transactionsRef);
    if (snapshot.exists()) {
        const updates: { [key: string]: any } = {};
        snapshot.forEach((childSnapshot) => {
            const tx = childSnapshot.val() as Transaction;
            if (tx.category === oldName) {
                updates[`/${childSnapshot.key}/category`] = newName;
            }
        });
        if (Object.keys(updates).length > 0) {
            await update(transactionsRef, updates);
        }
    }
  };
  
  const deleteCategory = async (categoryName: string) => {
      if (!user) return;
      const transactionsRef = ref(db, `users/${user.uid}/transactions`);
      const snapshot = await get(transactionsRef);
      if (snapshot.exists()) {
          const updates: { [key: string]: any } = {};
          snapshot.forEach((childSnapshot) => {
              const tx = childSnapshot.val() as Transaction;
              if (tx.category === categoryName) {
                  updates[`/${childSnapshot.key}/category`] = 'Outros';
              }
          });
          if (Object.keys(updates).length > 0) {
              await update(transactionsRef, updates);
          }
      }
  };
  
  const addDummyTransactions = () => {
    if (!user) return;
    
    const now = new Date();
    const dummyData: Omit<Transaction, 'id'>[] = [
      { amount: 5000, description: 'Salário', category: 'Renda', date: subDays(now, 15).toISOString(), type: 'income' },
      { amount: 1500, description: 'Aluguel', category: 'Moradia', date: subDays(now, 14).toISOString(), type: 'expense' },
      { amount: 450, description: 'Compras de Supermercado', category: 'Alimentação', date: subDays(now, 12).toISOString(), type: 'expense' },
      { amount: 120, description: 'Jantar com amigos', category: 'Lazer', date: subDays(now, 10).toISOString(), type: 'expense' },
      { amount: 80, description: 'Conta de Internet', category: 'Contas', date: subDays(now, 8).toISOString(), type: 'expense' },
      { amount: 55.90, description: 'Assinatura Netflix', category: 'Lazer', date: subDays(now, 7).toISOString(), type: 'expense' },
      { amount: 75, description: 'Transporte (Uber/Ônibus)', category: 'Transporte', date: subDays(now, 5).toISOString(), type: 'expense' },
      { amount: 250, description: 'Roupas', category: 'Compras', date: subDays(now, 3).toISOString(), type: 'expense' },
    ];
    
    const transactionsRef = ref(db, `users/${user.uid}/transactions`);
    dummyData.forEach(tx => {
        const newTxRef = push(transactionsRef);
        set(newTxRef, { ...tx, id: newTxRef.key });
    });
  }


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
        updateTransaction,
        addGoal,
        deleteGoal,
        updateGoal,
        addBill,
        deleteBill,
        updateBill,
        addShoppingItem,
        deleteShoppingItem,
        updateShoppingItem,
        refreshData,
        editCategory,
        deleteCategory,
        addDummyTransactions
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
