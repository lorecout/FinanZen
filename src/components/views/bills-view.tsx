
"use client"

import React, { useState } from 'react';
import {
  MoreHorizontal,
  Trash2,
  CheckCircle,
  PlusCircle,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import type { Bill } from '@/types';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';


const getStatusBadgeVariant = (status: Bill['status']) => {
  switch (status) {
    case 'paid':
      return 'default';
    case 'due':
      return 'secondary';
    case 'overdue':
      return 'destructive';
    default:
      return 'outline';
  }
}

const getStatusText = (status: Bill['status']) => {
    switch (status) {
        case 'paid': return 'Paga';
        case 'due': return 'Em aberto';
        case 'overdue': return 'Atrasada';
    }
}

type BillDialogProps = {
  onSave: (bill: Omit<Bill, 'id' | 'status'>) => void;
  trigger: React.ReactNode;
}

function BillDialog({ onSave, trigger }: BillDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if(!name || !amount || !dueDate) return;
    onSave({
      name,
      amount: Number(amount),
      dueDate,
    });
    setName('');
    setAmount('');
    setDueDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Conta</DialogTitle>
          <DialogDescription>
            Insira os detalhes da sua conta mensal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Conta de Luz"
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
              placeholder="Ex: 150.50"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Vencimento
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Salvar Conta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


type BillsViewProps = {
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export default function BillsView({ bills, setBills }: BillsViewProps) {
  
  const handleAddBill = (newBillData: Omit<Bill, 'id' | 'status'>) => {
    const newBill: Bill = {
        id: uuidv4(),
        ...newBillData,
        status: new Date(newBillData.dueDate) < new Date() ? 'overdue' : 'due',
    };
    setBills(prev => [...prev, newBill].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  }

  const handleMarkAsPaid = (id: string) => {
      setBills(bills.map(bill => bill.id === id ? {...bill, status: 'paid'} : bill));
  }

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Contas a Pagar</h1>
        <BillDialog
            onSave={handleAddBill}
            trigger={
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Conta
                </Button>
            }
        />
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Gerencie suas Contas</CardTitle>
              <CardDescription>Acompanhe e pague suas contas em um só lugar.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Conta</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className='text-right'>Valor</TableHead>
                          <TableHead className='text-right'>Vencimento</TableHead>
                          <TableHead className='w-[80px] text-right'>Ações</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {bills.length > 0 ? bills.map(bill => (
                          <TableRow key={bill.id}>
                              <TableCell className='font-medium'>{bill.name}</TableCell>
                              <TableCell>
                                  <Badge variant={getStatusBadgeVariant(bill.status)}>{getStatusText(bill.status)}</Badge>
                              </TableCell>
                              <TableCell className={cn('text-right', {
                                  'text-destructive': bill.status === 'overdue'
                              })}>
                                  R$ {bill.amount.toFixed(2).replace('.', ',')}
                              </TableCell>
                              <TableCell className='text-right'>
                                  {new Date(bill.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                              </TableCell>
                              <TableCell className='text-right'>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button
                                          aria-haspopup="true"
                                          size="icon"
                                          variant="ghost"
                                      >
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                          <DropdownMenuItem onSelect={() => handleMarkAsPaid(bill.id)} disabled={bill.status === 'paid'}>
                                            <CheckCircle className='mr-2 h-4 w-4' /> Marcar como Paga
                                          </DropdownMenuItem>
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
                                                  Essa ação não pode ser desfeita. Isso excluirá permanentemente a conta
                                                  "{bill.name}".
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteBill(bill.id)} className={cn(buttonVariants({variant: 'destructive'}))}>Excluir</AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Nenhuma conta encontrada.
                            </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </>
  )
}
