
"use client"

import React, { useMemo, useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Landmark,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SummaryCard from '@/components/dashboard/summary-card';
import ExpenseChart from '@/components/dashboard/expense-chart';
import AiTransactionForm from '@/components/dashboard/ai-transaction-form';
import type { AnalyzeTransactionOutput } from "@/ai/flows/transaction-analyzer";
import { type Transaction, type Goal } from '@/types';
import GoalsSummary from '@/components/dashboard/goals-summary';
import { Button } from '../ui/button';
import FinancialInsights from './financial-insights';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '@/hooks/use-auth';
import RecentTransactions from '../dashboard/recent-transactions';


type DashboardViewProps = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export default function DashboardView({ transactions, setTransactions, goals, setGoals }: DashboardViewProps) {
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isPremium } = useAuth();


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
  
  const filteredByTime = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timePeriod) {
      case 'this-month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'this-year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case 'all-time':
      default:
        return transactions;
    }

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, timePeriod]);

  const filteredTransactions = useMemo(() => {
    if (!selectedCategory) {
      return filteredByTime;
    }
    return filteredByTime.filter(t => t.category === selectedCategory && t.type === 'expense');
  }, [filteredByTime, selectedCategory]);


  const summary = useMemo(() => {
    const income = filteredByTime
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredByTime
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [filteredByTime]);
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }
  
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Dashboard</h1>
         <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="this-month">Este Mês</SelectItem>
                <SelectItem value="last-month">Mês Passado</SelectItem>
                <SelectItem value="this-year">Este Ano</SelectItem>
                <SelectItem value="all-time">Todo o Período</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {transactions.length === 0 && (
         <Card>
            <CardHeader>
              <CardTitle>Bem-vindo ao FinanZen!</CardTitle>
              <CardDescription>
                Parece que você ainda não adicionou nenhuma transação. Comece adicionando uma receita ou despesa abaixo.
              </CardDescription>
            </CardHeader>
        </Card>
      )}
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
          title="Saldo do Período" 
          value={`R$ ${summary.balance.toFixed(2).replace('.', ',')}`} 
          icon={Landmark} 
          className="sm:col-span-2 lg:col-span-2" 
        />
      </div>
      <FinancialInsights transactions={filteredByTime} />
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
              <CardDescription>
                 {selectedCategory ? `Filtrando por "${selectedCategory}"` : "Distribuição de gastos do período."}
              </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart 
                transactions={filteredByTime} 
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
            />
          </CardContent>
        </Card>
      </div>
        <div className="grid gap-4 md:gap-6">
        {!isPremium && (
            <Card className='w-full'>
                <CardContent className='p-4 !pb-2 flex-col sm:flex-row flex items-center justify-center text-center gap-4 sm:text-left'>
                    <div className='w-full flex-1 space-y-1'>
                        <CardTitle className='text-lg font-headline'>Dê um basta nos anúncios!</CardTitle>
                        <CardDescription>Assine o Premium e tenha uma experiência sem interrupções.</CardDescription>
                    </div>
                     <Link href="/configuracoes">
                        <Button>Ver Planos</Button>
                    </Link>
                </CardContent>
            </Card>
        )}
        <GoalsSummary goals={goals} onContribute={handleContributeToGoal} />
        
        <RecentTransactions 
          transactions={filteredTransactions} 
          onDelete={handleDeleteTransaction}
          selectedCategory={selectedCategory}
          onClearFilter={() => setSelectedCategory(null)}
        />
      </div>
    </>
  )
}
