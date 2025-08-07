
"use client"

import React, { useMemo, useState } from 'react';
import Link from "next/link"
import {
  CircleUser,
  Menu,
  Share2,
  Trash2,
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowLeft,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AuthGuard from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';

function SettingsPage() {
  
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleResetData = () => {
     toast({
        title: "Dados Resetados!",
        description: "Todos os dados da aplicação foram apagados.",
    });
    // In a real app, you would call a server action to delete user data from the database.
    // For now, we just show a toast.
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FinanZen',
          text: 'Gerencie suas finanças com facilidade!',
          url: window.location.origin,
        });
        toast({ title: 'Sucesso', description: 'Aplicativo compartilhado!' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível compartilhar.' });
      }
    } else {
        navigator.clipboard.writeText(window.location.origin);
        toast({ title: 'Sucesso', description: 'Link copiado para a área de transferência!' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <div className='flex-1'>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Voltar</span>
                    </Link>
                </Button>
            </div>
            <div className="flex-1 text-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Configurações</h1>
            </div>
          <div className="flex-1 flex justify-end">
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
                <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
            <Card>
                <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                    <CardDescription>Gerencie as configurações da sua conta e do aplicativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className='space-y-1'>
                            <Label htmlFor="theme" className='text-base font-semibold'>Tema</Label>
                            <p className="text-sm text-muted-foreground">
                                Personalize a aparência do aplicativo.
                            </p>
                        </div>
                        <Select defaultValue="system" onValueChange={(value) => {
                            if (value === 'dark') {
                                document.documentElement.classList.add('dark');
                            } else if (value === 'light') {
                                document.documentElement.classList.remove('dark');
                            } else {
                                // For 'system', you might want more complex logic to check system preference
                                document.documentElement.classList.remove('dark');
                            }
                        }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione o tema" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Padrão do Sistema</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className='space-y-1'>
                            <Label className='text-base font-semibold'>Compartilhar</Label>
                            <p className="text-sm text-muted-foreground">
                                Compartilhe o FinanZen com seus amigos.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className='mr-2 h-4 w-4' /> Compartilhar
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Seu Plano</CardTitle>
                    <CardDescription>Escolha o plano que melhor se adapta às suas necessidades e apoie o desenvolvimento do app.</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-6 md:grid-cols-2'>
                    <Card className='flex flex-col'>
                        <CardHeader>
                            <CardTitle className='text-xl font-headline'>Gratuito</CardTitle>
                            <CardDescription>O essencial para organizar suas finanças manualmente, com suporte de anúncios.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex-grow'>
                            <p className="text-2xl font-bold">R$ 0<span className='text-sm font-normal text-muted-foreground'>/mês</span></p>
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                                    <span>Inclusão manual e controle de transações, metas, contas e lista de compras.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-1 text-destructive shrink-0" />
                                    <span>Experiência sem Anúncios</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-1 text-destructive shrink-0" />
                                    <span>Insights Financeiros com IA</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className='w-full' disabled>
                               Seu Plano Atual
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className='flex flex-col border-primary/50 shadow-lg relative overflow-hidden'>
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS POPULAR</div>
                        <CardHeader>
                            <CardTitle className='text-xl font-headline'>Premium</CardTitle>
                            <CardDescription>Sua experiência completa para dominar suas finanças, com um toque de inteligência.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex-grow'>
                            <p className="text-2xl font-bold">R$ 9,90<span className='text-sm font-normal text-muted-foreground'>/mês</span></p>
                             <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                 <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                                    <span>Todos os recursos do plano gratuito.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                                    <span>Experiência 100% livre de anúncios.</span>
                                </li>
                                <li className="flex items-start font-semibold text-primary/90 gap-2">
                                    <Lightbulb className="h-4 w-4 mt-1 text-primary shrink-0" />
                                    <span>Insights e dicas com Inteligência Artificial.</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button className='w-full'>
                                <Zap className='mr-2 h-4 w-4' /> Testar Premium por 30 Dias Grátis
                            </Button>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                    <CardDescription>Ações irreversíveis que afetam sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className='mr-2 h-4 w-4' /> Resetar Todos os Dados
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente todos os seus dados,
                            incluindo transações, metas, contas e listas de compras.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetData} className={cn(buttonVariants({ variant: 'destructive' }))}>
                                Sim, excluir tudo
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </main>
    </div>
  )
}


export default function Settings() {
    return (
        <AuthGuard>
            <SettingsPage />
        </AuthGuard>
    )
}
