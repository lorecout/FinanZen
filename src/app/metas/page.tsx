
"use client"

import React, { useMemo, useState } from 'react';
import Link from "next/link"
import {
  CircleUser,
  Menu,
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Edit,
  PiggyBank
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import { getNavItems } from '@/components/dashboard/mobile-nav';
import type { Goal } from '@/types';
import { Progress } from '@/components/ui/progress';

const initialGoals: Goal[] = [
    {
      id: uuidv4(),
      name: "Viagem para o Japão",
      targetAmount: 15000,
      currentAmount: 5250,
    },
    {
      id: uuidv4(),
      name: "Entrada do Apartamento",
      targetAmount: 50000,
      currentAmount: 25000,
    },
    {
      id: uuidv4(),
      name: "Novo Computador",
      targetAmount: 8000,
      currentAmount: 7500,
    },
     {
      id: uuidv4(),
      name: "Reserva de Emergência",
      targetAmount: 10000,
      currentAmount: 10000,
    },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  // Example pending bills count
  const pendingBillsCount = 3;
  const navItems = useMemo(() => getNavItems(pendingBillsCount), [pendingBillsCount]);

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const isActive = item.href === '/metas';
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
             <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">Minhas Metas</h1>
          </div>
           <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Meta
            </Button>
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
           <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Minhas Metas</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {goals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <Card key={goal.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-headline">{goal.name}</CardTitle>
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <PiggyBank className="mr-2 h-4 w-4" />
                              Adicionar Dinheiro
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Meta
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive'>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir Meta
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Progress value={progress} />
                          <div className='text-sm text-muted-foreground'>
                              <span className='font-semibold text-primary'>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentAmount)}
                              </span>
                              {' de '}
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.targetAmount)}
                          </div>
                        </div>
                      </CardContent>
                       <CardFooter>
                          <span className="text-xs text-muted-foreground">{progress.toFixed(0)}% completo</span>
                      </CardFooter>
                  </Card>
                )
              })}
            </div>
        </main>
      </div>
    </div>
  )
}
