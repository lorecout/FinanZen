
"use client"

import React, { useMemo, useState } from 'react';
import Link from "next/link"
import {
  CircleUser,
  Menu,
  Paintbrush,
  Share2,
  Trash2,
  Zap,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import MobileNav, { getNavItems } from '@/components/dashboard/mobile-nav';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AuthGuard from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';

function SettingsPage() {
  
  const { toast } = useToast();
  const { logout } = useAuth();
  const navItems = useMemo(() => getNavItems(), []);
  const pathname = usePathname();

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


  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if(item.label === 'Adicionar') return null;
        const isActive = item.href === '/configuracoes';
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
             <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">Configurações</h1>
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
               <DropdownMenuItem asChild><Link href="/configuracoes">Configurações</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><a href="mailto:suporte@finanzen.com">Suporte</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24">
           <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Configurações</h1>
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
                    <CardTitle>Plano</CardTitle>
                    <CardDescription>Gerencie sua assinatura.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                     <div className="rounded-lg border bg-card text-card-foreground p-4">
                        <div className="flex items-center justify-between">
                            <p>Você está no plano <strong className='text-primary'>Gratuito</strong>.</p>
                            <Button>
                                <Zap className='mr-2 h-4 w-4' /> Ver Planos
                            </Button>
                        </div>
                    </div>
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
      <MobileNav />
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
