
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
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import MobileNav, { getNavItems } from '@/components/dashboard/mobile-nav';
import type { Goal } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


const initialGoals: Goal[] = [
    {
      id: uuidv4(),
      name: "Viagem para o Japão",
      targetAmount: 15000,
      currentAmount: 5250,
    },
];

type GoalDialogProps = {
  goal?: Goal | null;
  onSave: (goal: Goal) => void;
  trigger: React.ReactNode;
  isEdit?: boolean;
}

function GoalDialog({ goal, onSave, trigger, isEdit = false }: GoalDialogProps) {
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || '');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if(!name || !targetAmount) return;
    const newGoal: Goal = {
      id: goal?.id || uuidv4(),
      name,
      targetAmount: Number(targetAmount),
      currentAmount: goal?.currentAmount || 0,
    };
    onSave(newGoal);
    setName('');
    setTargetAmount('');
    setOpen(false);
  };
  
  React.useEffect(() => {
    if(open) {
      setName(goal?.name || '');
      setTargetAmount(goal?.targetAmount.toString() || '');
    }
  }, [open, goal]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Meta' : 'Adicionar Nova Meta'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Faça alterações na sua meta.' : 'Crie uma nova meta para acompanhar seu progresso.'}
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
              placeholder="Ex: Viagem para a praia"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetAmount" className="text-right">
              Valor Alvo (R$)
            </Label>
            <Input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="col-span-3"
              placeholder="Ex: 1500"
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

function AddContributionDialog({ goal, onContribute, trigger }: { goal: Goal; onContribute: (goalId: string, amount: number) => void; trigger: React.ReactNode }) {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const handleContribute = () => {
    if(!amount) return;
    onContribute(goal.id, Number(amount));
    setAmount('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Contribuição</DialogTitle>
          <DialogDescription>
            Quanto você gostaria de adicionar para a meta "{goal.name}"?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
               placeholder="Ex: 50"
            />
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleContribute}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const navItems = useMemo(() => getNavItems(), []);
  const pathname = usePathname();

  const handleSaveGoal = (goalToSave: Goal) => {
    setGoals(prevGoals => {
      const existingGoal = prevGoals.find(g => g.id === goalToSave.id);
      if (existingGoal) {
        return prevGoals.map(g => (g.id === goalToSave.id ? goalToSave : g));
      } else {
        return [...prevGoals, goalToSave];
      }
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(g => g.id !== goalId));
  };

  const handleContribute = (goalId: string, amount: number) => {
    setGoals(prevGoals =>
      prevGoals.map(g =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if(item.label === "Adicionar") return null;
        const isActive = item.href === '/metas';
        return (
            <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}
            >
            <item.icon className="h-4 w-4" />
            {item.label}
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
           <GoalDialog
              onSave={handleSaveGoal}
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Meta
                </Button>
              }
            />
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
              <DropdownMenuItem asChild><Link href="/configuracoes">Configurações</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><a href="mailto:suporte@finanzen.com">Suporte</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/login">Sair</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
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

                             <AddContributionDialog
                              goal={goal}
                              onContribute={handleContribute}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <PiggyBank className="mr-2 h-4 w-4" />
                                  Adicionar Dinheiro
                                </DropdownMenuItem>
                              }
                            />

                            <GoalDialog
                              isEdit
                              goal={goal}
                              onSave={handleSaveGoal}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar Meta
                                </DropdownMenuItem>
                              }
                            />

                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive' onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir Meta
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente a meta "{goal.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className={cn(buttonVariants({ variant: 'destructive' }))}
                                    onClick={() => handleDeleteGoal(goal.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                           <Progress value={Math.min(100, progress)} />
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
                          <span className="text-xs text-muted-foreground">{Math.min(100, progress).toFixed(0)}% completo</span>
                      </CardFooter>
                  </Card>
                )
              })}
                 {goals.length === 0 && (
                <Card className="flex flex-col items-center justify-center p-6 text-center md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Nenhuma meta encontrada</CardTitle>
                        <CardDescription>Clique em "Adicionar Nova Meta" para começar a planejar seu futuro.</CardDescription>
                    </CardHeader>
                </Card>
            )}
            </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
