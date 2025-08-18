
"use client"

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import Link from "next/link"
import {
  Menu,
  Loader2,
} from "lucide-react"
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import { getNavItems } from '@/components/dashboard/mobile-nav';
import MobileNav from '@/components/dashboard/mobile-nav';
import AuthGuard from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { type Transaction, type Goal, type Bill, type ShoppingItem } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RecentTransactions from '@/components/dashboard/recent-transactions';

// Dynamic imports for view components
const DashboardView = dynamic(() => import('@/components/views/dashboard-view'), {
  loading: () => <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
});
const BillsView = dynamic(() => import('@/components/views/bills-view'), {
  loading: () => <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
});
const GoalsView = dynamic(() => import('@/components/views/goals-view'), {
  loading: () => <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
});
const ShoppingListView = dynamic(() => import('@/components/views/shopping-list-view'), {
  loading: () => <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
});


function DashboardPage() {
  const { user, logout, transactions, goals, bills, shoppingItems, deleteTransaction, addGoal, deleteGoal, updateGoal, addBill, deleteBill, updateBill, addShoppingItem, deleteShoppingItem, updateShoppingItem } = useAuth();
  
  const [activeView, setActiveView] = useState('dashboard');

  const navItems = useMemo(() => getNavItems(), []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  }
  
  const handleContributeToGoal = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Add to goal
    const updatedGoal: Goal = {
        ...goal,
        currentAmount: goal.currentAmount + amount
    }
    updateGoal(updatedGoal);

    // Create new expense transaction
    const newTransaction: Omit<Transaction, 'id'> = {
      amount: amount,
      description: `Contribuição para: ${goal.name}`,
      category: 'Metas',
      date: new Date().toISOString(),
      type: 'expense'
    };

    // Use the secure endpoint to add the contribution transaction
    try {
        const response = await fetch('/api/add-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTransaction),
        });

        if (!response.ok) {
            // Revert goal update if transaction fails
            updateGoal(goal);
            throw new Error('Falha ao registrar a contribuição como uma transação.');
        }
    } catch(error) {
        console.error(error);
        // Handle error, maybe show a toast
    }
  };


  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView 
                transactions={transactions} 
                deleteTransaction={deleteTransaction}
                goals={goals} 
                handleContributeToGoal={handleContributeToGoal}
               />;
      case 'bills':
         return <>
            <BillsView bills={bills} addBill={addBill} deleteBill={deleteBill} updateBill={updateBill} />
        </>;
      case 'goals': // This is now the "Planejamento" view, which can combine goals and bills
        return <>
            <GoalsView goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} updateGoal={updateGoal} />
        </>;
      case 'settings':
         // This is a bit of a hack to avoid a full page reload for settings
        window.location.href = '/configuracoes';
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
      default:
        return <DashboardView 
                transactions={transactions} 
                deleteTransaction={deleteTransaction}
                goals={goals} 
                handleContributeToGoal={handleContributeToGoal}
               />;
    }
  }


  return (
    <>
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
               {navItems.find(item => item.id === activeView)?.label}
            </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || ''} alt={`@${user?.displayName || user?.email}`} />
                        <AvatarFallback>{getInitials(user?.displayName || user?.email || 'U')}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveView('settings')}>Configurações</DropdownMenuItem>
              <DropdownMenuItem asChild><a href="mailto:suporte@finanzen.com">Suporte</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          {renderActiveView()}
        </Suspense>
      </main>
      <MobileNav activeView={activeView} setActiveView={setActiveView} />
    </div>
    </>
  )
}

export default function Home() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
