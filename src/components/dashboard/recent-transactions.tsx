
"use client"

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2, MoreVertical, Edit } from "lucide-react"
import { type Transaction } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type EditTransactionDialogProps = {
  transaction: Transaction;
  onSave: (transaction: Transaction) => void;
  trigger: React.ReactNode;
}

function EditTransactionDialog({ transaction, onSave, trigger }: EditTransactionDialogProps) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if(!description || !amount || !category) return;
    
    const updatedTransaction: Transaction = {
        ...transaction,
        description,
        amount: Number(amount),
        category,
    };
    onSave(updatedTransaction);
    setOpen(false);
  };
  
  React.useEffect(() => {
    if(open) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
    }
  }, [open, transaction]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Faça alterações na sua transação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            {/* This could be a select with predefined categories */}
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type RecentTransactionsProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (transaction: Transaction) => void;
  selectedCategory: string | null;
  onClearFilter: () => void;
};


export default function RecentTransactions({ transactions, onDelete, onUpdate, selectedCategory, onClearFilter }: RecentTransactionsProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    return transactions.reduce((acc, tx) => {
        const date = new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>);
  };
  
  const groupedTransactions = groupTransactionsByDate(sortedTransactions);

  return (
      <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl">Transações</CardTitle>
                        <CardDescription>
                            {selectedCategory ? `Exibindo despesas da categoria "${selectedCategory}"` : "Suas atividades financeiras mais recentes."}
                        </CardDescription>
                    </div>
                    {selectedCategory && (
                        <Button variant="ghost" size="sm" onClick={onClearFilter}>
                           Limpar Filtro
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-4">
                    {Object.keys(groupedTransactions).length > 0 ? Object.entries(groupedTransactions).map(([date, txs]) => (
                        <div key={date}>
                            <h3 className="text-sm font-semibold text-muted-foreground px-4 py-2 bg-muted/50">{date}</h3>
                            <ul className="divide-y">
                                {txs.map(tx => (
                                    <li key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                {/* Placeholder for category icon */}
                                                <span className="text-primary font-bold text-lg">{tx.category.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{tx.description}</p>
                                                <p className="text-sm text-muted-foreground">{tx.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-bold",
                                                tx.type === 'income' ? 'text-green-600' : 'text-destructive'
                                            )}>
                                                 {tx.type === 'income' ? '+' : '-'} R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                                            </span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                   <EditTransactionDialog 
                                                     transaction={tx}
                                                     onSave={onUpdate}
                                                     trigger={
                                                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                          <Edit className="mr-2 h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                     }
                                                   />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={e => e.preventDefault()}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita e irá excluir permanentemente a transação.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => onDelete(tx.id)} className={cn(buttonVariants({variant: 'destructive'}))}>Excluir</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )) : (
                         <div className="h-24 text-center flex items-center justify-center">
                            <p>Nenhuma transação encontrada.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
  )
}
