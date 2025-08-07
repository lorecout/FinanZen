
"use client"

import React, { useState, useMemo } from 'react';
import Link from "next/link"
import {
  CircleUser,
  CreditCard,
  DollarSign,
  Landmark,
  Menu,
  Package2,
  MoreHorizontal,
  Trash2,
  Edit,
  CheckCircle,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import { navItems as getNavItems } from '@/components/dashboard/mobile-nav';
import type { Bill } from '@/types';
import { cn } from '@/lib/utils';


const initialBills: Bill[] = [
    {
      id: uuidv4(),
      name: "Conta de Luz (Eletropaulo)",
      amount: 180.50,
      dueDate: "2024-07-28",
      status: 'due'
    },
    {
      id: uuidv4(),
      name: "Plano de Internet (Vivo Fibra)",
      amount: 99.90,
      dueDate: "2024-07-30",
      status: 'due'
    },
    {
      id: uuidv4(),
      name: "Fatura Cartão de Crédito",
      amount: 850.00,
      dueDate: "2024-08-05",
      status: 'due'
    },
    {
      id: uuidv4(),
      name: "Seguro do Carro",
      amount: 250.00,
      dueDate: "2024-07-20",
      status: 'overdue'
    },
     {
      id: uuidv4(),
      name: "Mensalidade da Academia",
      amount: 120.00,
      dueDate: "2024-07-15",
      status: 'paid'
    },
];

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


export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  
  const pendingBillsCount = useMemo(() => {
    return bills.filter(bill => bill.status === 'due' || bill.status === 'overdue').length;
  }, [bills]);

  const navItems = useMemo(() => getNavItems(pendingBillsCount), [pendingBillsCount]);


  const handleMarkAsPaid = (id: string) => {
      setBills(bills.map(bill => bill.id === id ? {...bill, status: 'paid'} : bill));
  }

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  }


  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const isActive = item.href === '/contas-a-pagar';
        return (
            <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}
            >
            <item.icon className="h-4 w-4" />
            {item.label}
            {item.badge ? (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {item.badge}
                </Badge>
            ) : null}
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
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
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
             <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">Contas a Pagar</h1>
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
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
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
                                                <DropdownMenuItem>
                                                  <Edit className='mr-2 h-4 w-4' /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start text-sm text-destructive font-normal p-2 m-0 h-auto hover:bg-destructive/10">
                                                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </Button>
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
        </main>
      </div>
    </div>
  )
}

    