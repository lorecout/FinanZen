
"use client"

import React, { useState, useMemo } from 'react';
import {
  MoreHorizontal,
  Trash2,
  Edit,
  PlusCircle,
  Package,
} from "lucide-react"
import { format, getMonth, getYear, startOfMonth } from 'date-fns';

import { Button, buttonVariants } from "@/components/ui/button"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Budget, Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '../ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type BudgetDialogProps = {
  budget?: Budget | null;
  onSave: (budget: Omit<Budget, 'id'> | Budget) => void;
  trigger: React.ReactNode;
  isEdit?: boolean;
  expenseCategories: string[];
}

function BudgetDialog({ budget, onSave, trigger, isEdit = false, expenseCategories }: BudgetDialogProps) {
  const [category, setCategory] = useState(budget?.category || '');
  const [amount, setAmount] = useState(budget?.amount.toString() || '');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if(!category || !amount) {
       toast({ variant: "destructive", title: "Erro", description: "Por favor, preencha todos os campos." });
       return;
    }
    if(Number(amount) <= 0) {
        toast({ variant: "destructive", title: "Erro", description: "O valor do orçamento deve ser maior que zero." });
        return;
    }

    const currentMonth = format(new Date(), 'yyyy-MM');
    
    if (isEdit && budget) {
        const editedBudget: Budget = {
            ...budget,
            category,
            amount: Number(amount),
        };
        onSave(editedBudget);
    } else {
        const newBudget: Omit<Budget, 'id'> = {
            category,
            amount: Number(amount),
            month: currentMonth,
        };
        onSave(newBudget);
    }

    setCategory('');
    setAmount('');
    setOpen(false);
  };
  
  React.useEffect(() => {
    if(open) {
      if (isEdit && budget) {
        setCategory(budget.category);
        setAmount(budget.amount.toString());
      } else {
        setCategory('');
        setAmount('');
      }
    }
  }, [open, budget, isEdit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Orçamento' : 'Novo Orçamento Mensal'}</DialogTitle>
          <DialogDescription>
            Defina um limite de gastos para uma categoria neste mês.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={isEdit}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                    {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="Ex: 500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


type BudgetsViewProps = {
    budgets: Budget[];
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    deleteBudget: (budgetId: string) => void;
    updateBudget: (budget: Budget) => void;
    transactions: Transaction[];
}

export default function BudgetsView({ budgets, addBudget, deleteBudget, updateBudget, transactions }: BudgetsViewProps) {
  const currentMonth = format(new Date(), 'yyyy-MM');

  const { expenseCategories, budgetsForCurrentMonth } = useMemo(() => {
    const allCategories = transactions
      .filter(t => t.type === 'expense')
      .map(t => t.category);
    
    const budgetsForMonth = budgets.filter(b => b.month === currentMonth);
    const categoriesWithBudget = budgetsForMonth.map(b => b.category);

    // Filter out categories that already have a budget for the current month
    const uniqueCategories = [...new Set(allCategories)]
        .filter(c => !categoriesWithBudget.includes(c))
        .sort();

    return {
      expenseCategories: uniqueCategories,
      budgetsForCurrentMonth: budgetsForMonth,
    };
  }, [transactions, budgets, currentMonth]);


  const spentAmounts = useMemo(() => {
    const startOfCurrentMonth = startOfMonth(new Date());
    return budgetsForCurrentMonth.reduce((acc, budget) => {
        const spent = transactions
            .filter(t => 
                t.type === 'expense' && 
                t.category === budget.category && 
                new Date(t.date) >= startOfCurrentMonth)
            .reduce((sum, t) => sum + t.amount, 0);
        acc[budget.id] = spent;
        return acc;
    }, {} as Record<string, number>);
  }, [transactions, budgetsForCurrentMonth]);

  return (
    <>
      <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Orçamentos Mensais</CardTitle>
                    <CardDescription>Defina limites e controle seus gastos por categoria.</CardDescription>
                </div>
                 <BudgetDialog
                    onSave={addBudget}
                    expenseCategories={expenseCategories}
                    trigger={
                        <Button variant="outline" disabled={expenseCategories.length === 0}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Novo Orçamento
                        </Button>
                    }
                />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {budgetsForCurrentMonth.length > 0 ? (
                budgetsForCurrentMonth.map(budget => {
                    const spent = spentAmounts[budget.id] || 0;
                    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                    const remaining = budget.amount - spent;

                    return (
                        <div key={budget.id} className='space-y-2'>
                           <div className='flex justify-between items-center font-medium'>
                                <span>{budget.category}</span>
                                <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button
                                          aria-haspopup="true"
                                          size="icon"
                                          variant="ghost"
                                          className='h-8 w-8'
                                      >
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                          <BudgetDialog 
                                            isEdit
                                            budget={budget}
                                            onSave={updateBudget}
                                            expenseCategories={[]}
                                            trigger={
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                            }
                                          />
                                          <DropdownMenuSeparator />
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive' onSelect={(e) => e.preventDefault()}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                              </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Essa ação não pode ser desfeita. Isso excluirá permanentemente o orçamento para "{budget.category}".
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteBudget(budget.id)} className={cn(buttonVariants({variant: 'destructive'}))}>Excluir</AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                           </div>
                           <Progress value={Math.min(100, progress)} />
                           <div className='flex justify-between items-center text-sm text-muted-foreground'>
                             <span>Gasto: R$ {spent.toFixed(2).replace('.', ',')}</span>
                             <span>{remaining >= 0 ? `Restante: R$ ${remaining.toFixed(2).replace('.', ',')}` : `Acima: R$ ${Math.abs(remaining).toFixed(2).replace('.', ',')}`}</span>
                           </div>
                        </div>
                    )
                })
            ) : (
                <div className="text-center text-muted-foreground py-4 flex flex-col items-center gap-2">
                    <Package className='h-8 w-8' />
                    <p className='font-medium'>Nenhum orçamento definido para este mês.</p>
                    <p className='text-xs'>Adicione despesas para criar categorias e depois defina seus orçamentos.</p>
                </div>
            )}
          </CardContent>
      </Card>
    </>
  )
}
