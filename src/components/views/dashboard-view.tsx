
"use client"

import React, { useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  Landmark,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SummaryCard from '@/components/dashboard/summary-card';
import ExpenseChart from '@/components/dashboard/expense-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import AiTransactionForm from '@/components/dashboard/ai-transaction-form';
import type { AnalyzeTransactionOutput } from '@/ai/flows/transaction-analyzer';
import { type Transaction, type Goal } from '@/types';
import GoalsSummary from '@/components/dashboard/goals-summary';
import { Button } from '../ui/button';
import FinancialInsights from './financial-insights';


type DashboardViewProps = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export default function DashboardView({ transactions, setTransactions, goals, setGoals }: DashboardViewProps) {

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
  
  return (
    <>
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
      <FinancialInsights transactions={transactions} />
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
        <Card className='w-full'>
            <CardContent className='p-4 !pb-2 flex-col sm:flex-row flex items-center justify-center text-center gap-4 sm:text-left'>
                <div className='w-full flex-1 space-y-1'>
                    <CardTitle className='text-lg font-headline'>Dê um basta nos anúncios!</CardTitle>
                    <CardDescription>Assine o Premium e tenha uma experiência sem interrupções.</CardDescription>
                </div>
                <Button>Ver Planos</Button>
            </CardContent>
        </Card>
        <GoalsSummary goals={goals} onContribute={handleContributeToGoal} />
        <RecentTransactions transactions={transactions} onDelete={handleDeleteTransaction} />
      </div>
    </>
  )
}
