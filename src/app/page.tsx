
"use client"

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import Link from "next/link"
import {
  CircleUser,
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
  const { logout } = useAuth();
  
  const [activeView, setActiveView] = useState('dashboard');

  // States for all data, starting empty
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  const navItems = useMemo(() => getNavItems(), []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView 
                transactions={transactions} 
                setTransactions={setTransactions} 
                goals={goals} 
                setGoals={setGoals}
               />;
      case 'bills':
        return <BillsView bills={bills} setBills={setBills} />;
      case 'goals':
        return <GoalsView goals={goals} setGoals={setGoals} />;
      case 'shopping':
        return <ShoppingListView items={shoppingItems} setItems={setShoppingItems} />;
      case 'settings':
         // This is a bit of a hack to avoid a full page reload for settings
        window.location.href = '/configuracoes';
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
      default:
        return <DashboardView 
                transactions={transactions} 
                setTransactions={setTransactions} 
                goals={goals} 
                setGoals={setGoals}
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
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
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
