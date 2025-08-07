
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { type Goal } from '@/types';
import { PiggyBank } from 'lucide-react';

type GoalsSummaryProps = {
  goals: Goal[];
  onContribute: (goalId: string, amount: number) => void;
};

function AddContributionDialog({ goal, onContribute, trigger }: { goal: Goal; onContribute: (goalId: string, amount: number) => void; trigger: React.ReactNode }) {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const handleContribute = () => {
    if (Number(amount) <= 0) return;
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
            Quanto você gostaria de adicionar para a meta "{goal.name}"? Este valor será registrado como uma nova despesa.
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
              placeholder='Ex: 50,00'
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


export default function GoalsSummary({ goals, onContribute }: GoalsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Resumo das Metas</CardTitle>
        <CardDescription>Acompanhe e contribua para suas metas diretamente do dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
                 <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className='flex-1 space-y-1'>
                        <div className='flex justify-between items-baseline'>
                            <p className="font-medium">{goal.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentAmount)} / {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.targetAmount)}
                            </p>
                        </div>
                        <Progress value={Math.min(100, progress)} />
                    </div>
                     <AddContributionDialog
                        goal={goal}
                        onContribute={onContribute}
                        trigger={
                            <Button variant="outline" size="sm" className='w-full sm:w-auto'>
                                <PiggyBank className="mr-2" />
                                Contribuir
                            </Button>
                        }
                    />
                 </div>
            )
        })}
        {goals.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Você ainda não tem nenhuma meta. Crie uma na aba "Metas".</p>
        )}
      </CardContent>
    </Card>
  );
}
