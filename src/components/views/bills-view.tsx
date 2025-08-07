
"use client"

import React, { useMemo } from 'react';
import {
  MoreHorizontal,
  Trash2,
  CheckCircle,
} from "lucide-react"

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
import type { Bill } from '@/types';
import { cn } from '@/lib/utils';


const getStatusBadgeVariant = (status: Bill['status']) => {
  switch (status) {
    case 'paid':
      return 'default'; // Greenish in default theme
    case 'due':
      return 'secondary'; // Bluish/Grayish
    case 'overdue':
      return 'destructive'; // Reddish
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

type BillsViewProps = {
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export default function BillsView({ bills, setBills }: BillsViewProps) {
  
  const handleMarkAsPaid = (id: string) => {
      setBills(bills.map(bill => bill.id === id ? {...bill, status: 'paid'} : bill));
  }

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Contas a Pagar</h1>
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
                      {bills.map(bill => (
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
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </>
  )
}
