
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


type DashboardViewProps = {
    transactions: Transaction[];
    deleteTransaction: (transactionId: string) => void;
    goals: Goal[];
    handleContributeToGoal: (goalId: string, amount: number) => void;
}


export default function DashboardView({ transactions, deleteTransaction, goals, handleContributeToGoal }: DashboardViewProps) {
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo em contas</CardTitle>
              <CardDescription className='text-3xl font-bold text-foreground'>
                  R$ {summary.balance.toFixed(2).replace('.', ',')}
              </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <ArrowUpCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                      <p className='text-sm text-muted-foreground'>Receitas</p>
                      <p className='font-semibold text-green-600 dark:text-green-400'>R$ {summary.income.toFixed(2).replace('.', ',')}</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                   <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <ArrowDownCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                      <p className='text-sm text-muted-foreground'>Despesas</p>
                      <p className='font-semibold text-red-600 dark:text-red-400'>R$ {summary.expense.toFixed(2).replace('.', ',')}</p>
                  </div>
              </div>
          </CardContent>
      </Card>

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
       
        {!isPremium && (
            <Card className='w-full bg-primary/10 border-primary/20'>
                <CardContent className='p-4 !pb-2 flex-col sm:flex-row flex items-center justify-center text-center gap-4 sm:text-left'>
                    <div className='w-full flex-1 space-y-1'>
                        <CardTitle className='text-lg font-headline text-primary/90'>Desbloqueie todo o potencial!</CardTitle>
                        <CardDescription className='text-primary/80'>Assine o Premium para ter insights com IA e uma experiência sem anúncios.</CardDescription>
                    </div>
                     <Link href="/configuracoes">
                        <Button>Ver Planos</Button>
                    </Link>
                </CardContent>
            </Card>
        )}
        
        <RecentTransactions 
          transactions={filteredTransactions} 
          onDelete={deleteTransaction}
          selectedCategory={selectedCategory}
          onClearFilter={() => setSelectedCategory(null)}
        />

        <div className="hidden">
           {/* AI Form is hidden for now to match the new design, but kept in the DOM for functionality */}
           <AiTransactionForm onAddTransaction={refreshData} addBill={addBill} />
        </div>
      </div>
    </>
  )
}
