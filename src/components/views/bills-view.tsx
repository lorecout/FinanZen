
"use client"

import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Trash2,
  CheckCircle,
  PlusCircle,
  Bell,
} from "lucide-react"
import { differenceInDays, isFuture, parseISO } from 'date-fns';

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
import { useToast } from '@/hooks/use-toast';


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
  onSave: (bill: Omit<Bill, 'id'>) => void;
  trigger: React.ReactNode;
}

function BillDialog({ onSave, trigger }: BillDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if(!name || !amount || !dueDate) return;
    const today = new Date();
    today.setHours(0,0,0,0);
    const newBill: Omit<Bill, 'id'> = {
        name,
        amount: Number(amount),
        dueDate,
        status: new Date(dueDate) < today ? 'overdue' : 'due',
    };
    onSave(newBill);
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
    addBill: (bill: Omit<Bill, 'id'>) => void;
    deleteBill: (billId: string) => void;
    updateBill: (bill: Bill) => void;
}

export default function BillsView({ bills, addBill, deleteBill, updateBill }: BillsViewProps) {
  const { toast } = useToast();
  const [notifiedBills, setNotifiedBills] = useState<string[]>([]);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    if (!bills) return;

    bills.forEach(bill => {
        if (bill.status !== 'paid' && !notifiedBills.includes(bill.id)) {
            const dueDate = parseISO(bill.dueDate);
            
            if (isFuture(dueDate) || differenceInDays(dueDate, today) === 0) {
                 const daysUntilDue = differenceInDays(dueDate, today);

                if(daysUntilDue >= 0 && daysUntilDue <= 3) {
                     toast({
                        title: (
                            <div className='flex items-center'>
                                <Bell className="mr-2 h-4 w-4 text-primary" /> Alerta de Vencimento
                            </div>
                        ),
                        description: `Sua conta de "${bill.name}" vence ${daysUntilDue === 0 ? 'hoje' : `em ${daysUntilDue} dia(s)`}!`,
                    });
                    setNotifiedBills(prev => [...prev, bill.id]);
                }
            }
        }
    });
  }, [bills, toast, notifiedBills]);

  const handleMarkAsPaid = (bill: Bill) => {
      updateBill({...bill, status: 'paid'});
  }

  return (
    <>
      <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Contas a Pagar</CardTitle>
                    <CardDescription>Acompanhe e pague suas contas em um só lugar.</CardDescription>
                </div>
                 <BillDialog
                    onSave={addBill}
                    trigger={
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Conta
                        </Button>
                    }
                />
            </div>
          </CardHeader>
          <CardContent className='p-0'>
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
                      {bills && bills.length > 0 ? bills.map(bill => (
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
                                          <DropdownMenuItem onSelect={() => handleMarkAsPaid(bill)} disabled={bill.status === 'paid'}>
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
                                                <AlertDialogAction onClick={() => deleteBill(bill.id)} className={cn(buttonVariants({variant: 'destructive'}))}>Excluir</AlertDialogAction>
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
