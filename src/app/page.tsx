
"use client"

import React, { useState, useMemo } from 'react';
import Link from "next/link"
import {
  CircleUser,
  CreditCard,
  DollarSign,
  Landmark,
  Menu,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SummaryCard from '@/components/dashboard/summary-card';
import ExpenseChart from '@/components/dashboard/expense-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import AiTransactionForm from '@/components/dashboard/ai-transaction-form';
import Logo from '@/components/logo';
import type { AnalyzeTransactionOutput } from '@/ai/flows/transaction-analyzer';
import { type Transaction, type Goal } from '@/types';
import { getNavItems } from '@/components/dashboard/mobile-nav';
import { usePathname } from 'next/navigation';
import GoalsSummary from '@/components/dashboard/goals-summary';
import MobileNav from '@/components/dashboard/mobile-nav';


const initialTransactions: Transaction[] = [
  {
    id: uuidv4(),
    description: "Salário",
    amount: 5329.00,
    date: "2024-07-01",
    type: "income",
    category: "Salário"
  },
];

const initialGoals: Goal[] = [
    {
      id: uuidv4(),
      name: "Viagem para o Japão",
      targetAmount: 15000,
      currentAmount: 5250,
    },
];


export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const handleAddTransaction = (newTransactionData: AnalyzeTransactionOutput) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      ...newTransactionData,
      date: new Date().toISOString(),
      type: newTransactionData.description.toLowerCase().includes('salário') || newTransactionData.description.toLowerCase().includes('renda') ? 'income' : 'expense',
      amount: newTransactionData.amount
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (idToDelete: string) => {
    setTransactions(prev => prev.filter((tx) => tx.id !== idToDelete));
  };

  const handleContributeToGoal = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Add to goal
    setGoals(prevGoals =>
      prevGoals.map(g =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );

    // Create new expense transaction
    const newTransaction: Transaction = {
      id: uuidv4(),
      amount: amount,
      description: `Contribuição para: ${goal.name}`,
      category: 'Metas',
      date: new Date().toISOString(),
      type: 'expense'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [transactions]);
  
  const navItems = useMemo(() => getNavItems(), []);
  const pathname = usePathname();

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if(item.label === 'Adicionar') return null;
        const isActive = pathname === item.href;
        return (
            <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}
            >
            <item.icon className="h-4 w-4" />
            {item.label}
            </Link>
        )
      })}
    </nav>
  );


  return (
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
            <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">Dashboard</h1>
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
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
           <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Dashboard</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
             <SummaryCard 
              title="Receitas" 
              value={`R$ ${summary.income.toFixed(2).replace('.', ',')}`} 
              icon={DollarSign} 
            />
            <SummaryCard 
              title="Despesas" 
              value={`R$ ${summary.expense.toFixed(2).replace('.', ',')}`} 
              icon={CreditCard} 
            />
            <SummaryCard 
              title="Saldo Atual" 
              value={`R$ ${summary.balance.toFixed(2).replace('.', ',')}`} 
              icon={Landmark} 
              className="sm:col-span-2 lg:col-span-2" 
            />
          </div>
          <div id="add-transaction-form" className="grid gap-4 md:gap-6 lg:grid-cols-5">
             <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Adicionar Transação</CardTitle>
                <CardDescription>
                  Use a IA para adicionar despesas ou receitas de forma rápida.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AiTransactionForm onAddTransaction={handleAddTransaction} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Despesas</CardTitle>
                 <CardDescription>Distribuição de gastos do mês.</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>
           <div className="grid gap-4 md:gap-6">
            <GoalsSummary goals={goals} onContribute={handleContributeToGoal} />
            <RecentTransactions transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
