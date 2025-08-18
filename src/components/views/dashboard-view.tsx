
"use client"

import React, { useMemo, useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Landmark,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react"
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
import type { Transaction, Goal } from '@/types';
import GoalsSummary from '@/components/dashboard/goals-summary';
import { Button } from '../ui/button';
import FinancialInsights from './financial-insights';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '@/hooks/use-auth';
import RecentTransactions from '../dashboard/recent-transactions';
import { cn } from '@/lib/utils';
import AdCard from '../dashboard/ad-card';


type DashboardViewProps = {
    transactions: Transaction[];
    deleteTransaction: (transactionId: string) => void;
    updateTransaction: (transaction: Transaction) => void;
    goals: Goal[];
    handleContributeToGoal: (goalId: string, amount: number) => void;
}


export default function DashboardView({ transactions, deleteTransaction, updateTransaction, goals, handleContributeToGoal }: DashboardViewProps) {
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isPremium, refreshData, addBill } = useAuth();

  const filteredByTime = useMemo(() => {
    if (!transactions) return [];
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
            <SelectTrigger className="w-auto border-none shadow-none bg-transparent">
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

      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Balanço do Período</CardTitle>
              <CardDescription className='text-3xl font-bold text-foreground'>
                 Saldo Atual: R$ {summary.balance.toFixed(2).replace('.', ',')}
              </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Landmark className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                      <p className='text-sm text-muted-foreground'>Receitas</p>
                      <p className='font-semibold text-green-600 dark:text-green-400'>R$ {summary.income.toFixed(2).replace('.', ',')}</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                   <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <CreditCard className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                      <p className='text-sm text-muted-foreground'>Despesas</p>
                      <p className='font-semibold text-red-600 dark:text-red-400'>R$ {summary.expense.toFixed(2).replace('.', ',')}</p>
                  </div>
              </div>
          </CardContent>
      </Card>
      
      <FinancialInsights transactions={transactions} />

      <div id="add-transaction-form" className="grid gap-4 md:gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Despesas por Categoria</CardTitle>
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
       
        <RecentTransactions 
          transactions={filteredTransactions} 
          onDelete={deleteTransaction}
          onUpdate={updateTransaction}
          selectedCategory={selectedCategory}
          onClearFilter={() => setSelectedCategory(null)}
        />
        
        <GoalsSummary goals={goals} onContribute={handleContributeToGoal} />

        <div className="hidden">
           {/* AI Form is hidden for now to match the new design, but kept in the DOM for functionality */}
           <AiTransactionForm onAddTransaction={refreshData} addBill={addBill} />
        </div>
      </div>
    </>
  )
}
