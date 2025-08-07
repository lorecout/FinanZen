
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

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if(item.id === 'add' || item.id === 'settings') return null;
        
        const isActive = activeView === item.id;
        return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary justify-start ${isActive ? 'bg-muted text-primary' : ''}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
        )
      })}
    </nav>
  );

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            {navContent}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Logo />
              </div>
              <div className="flex-1 overflow-y-auto pt-2">
                {navContent}
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">
               {navItems.find(item => item.id === activeView)?.label}
            </h1>
          </div>
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
              <DropdownMenuItem asChild><Link href="/configuracoes">Configurações</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><a href="mailto:suporte@finanzen.com">Suporte</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
           <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            {renderActiveView()}
          </Suspense>
        </main>
      </div>
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
