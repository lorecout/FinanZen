
"use client"

import React, { useState } from 'react';
import {
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Edit,
  PiggyBank
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
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
import type { Goal } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type GoalDialogProps = {
  goal?: Goal | null;
  onSave: (goal: Omit<Goal, 'id'> | Goal) => void;
  trigger: React.ReactNode;
  isEdit?: boolean;
}

function GoalDialog({ goal, onSave, trigger, isEdit = false }: GoalDialogProps) {
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() || '');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if(!name || !targetAmount) return;
    
    if (isEdit && goal) {
        const editedGoal: Goal = {
            ...goal,
            name,
            targetAmount: Number(targetAmount),
        };
        onSave(editedGoal);
    } else {
        const newGoal: Omit<Goal, 'id'> = {
            name,
            targetAmount: Number(targetAmount),
            currentAmount: 0,
        };
        onSave(newGoal);
    }

    setName('');
    setTargetAmount('');
    setOpen(false);
  };
  
  React.useEffect(() => {
    if(open) {
      if (isEdit && goal) {
        setName(goal.name);
        setTargetAmount(goal.targetAmount.toString());
      } else {
        setName('');
        setTargetAmount('');
      }
    }
  }, [open, goal, isEdit]);

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

function AddContributionDialog({ goal, onContribute, trigger }: { goal: Goal; onContribute: (goal: Goal, amount: number) => void; trigger: React.ReactNode }) {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const handleContribute = () => {
    if(!amount || Number(amount) <= 0) return;
    onContribute(goal, Number(amount));
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

type GoalsViewProps = {
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id'>) => void;
    deleteGoal: (goalId: string) => void;
    updateGoal: (goal: Goal) => void;
}

export default function GoalsView({ goals, addGoal, deleteGoal, updateGoal }: GoalsViewProps) {
  
  const handleContribute = (goal: Goal, amount: number) => {
    const updatedGoal = { ...goal, currentAmount: goal.currentAmount + amount };
    updateGoal(updatedGoal);
    // Note: In a real app, you might want to create a transaction here as well
  };


  return (
    <>
       <div className='flex justify-between items-center mb-4 md:mb-6'>
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Minhas Metas</h1>
        <GoalDialog
            onSave={addGoal}
            trigger={
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Meta
            </Button>
            }
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {goals && goals.map(goal => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
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
                        onSave={updateGoal}
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
                              onClick={() => deleteGoal(goal.id)}
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
            {(!goals || goals.length === 0) && (
          <Card className="flex flex-col items-center justify-center p-6 text-center md:col-span-full">
              <CardHeader>
                  <CardTitle>Nenhuma meta encontrada</CardTitle>
                  <CardDescription>Clique em "Adicionar Nova Meta" para começar a planejar seu futuro.</CardDescription>
              </CardHeader>
          </Card>
      )}
      </div>
    </>
  )
}
