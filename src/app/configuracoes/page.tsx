
"use client"

import React, { useMemo, useState } from 'react';
import Link from "next/link"
import {
  Menu,
  Share2,
  Trash2,
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Edit,
  MoreVertical,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type EditCategoryDialogProps = {
  category: string;
  onSave: (oldName: string, newName: string) => void;
  trigger: React.ReactNode;
}

function EditCategoryDialog({ category, onSave, trigger }: EditCategoryDialogProps) {
  const [newName, setNewName] = useState(category);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!newName.trim() || newName === category) {
      setOpen(false);
      return;
    }
    onSave(category, newName.trim());
    setOpen(false);
  };
  
  React.useEffect(() => {
    if(open) {
      setNewName(category);
    }
  }, [open, category]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function SettingsPage() {
  
  const { toast } = useToast();
  const { user, logout, isPremium, upgradeToPremium, transactions, editCategory, deleteCategory } = useAuth();
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  }

  const uniqueCategories = useMemo(() => {
    const expenseCategories = transactions
      .filter(t => t.type === 'expense')
      .map(t => t.category);
    return [...new Set(expenseCategories)].sort();
  }, [transactions]);


  const handleResetData = () => {
     toast({
        title: "Dados Resetados!",
        description: "Todos os dados da aplicação foram apagados.",
    });
    // In a real app, you would call a server action to delete user data from the database.
    // For now, we just show a toast.
  }

  const handleShare = async () => {
    const shareUrl = "https://finanzen.app";
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FinanZen',
          text: 'Gerencie suas finanças com facilidade!',
          url: shareUrl,
        });
        toast({ title: 'Sucesso', description: 'Aplicativo compartilhado!' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível compartilhar.' });
      }
    } else {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: 'Sucesso', description: 'Link copiado para a área de transferência!' });
    }
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    toast({
      title: "Parabéns!",
      description: "Você agora é um usuário Premium! Aproveite todos os recursos.",
      className: "bg-green-500 text-white"
    })
  }

  const handleEditCategory = (oldName: string, newName: string) => {
    editCategory(oldName, newName);
    toast({
      title: "Categoria Atualizada",
      description: `A categoria "${oldName}" foi renomeada para "${newName}".`,
    })
  }
  
  const handleDeleteCategory = (categoryName: string) => {
    deleteCategory(categoryName);
     toast({
      title: "Categoria Excluída",
      description: `A categoria "${categoryName}" foi excluída e as transações movidas para "Outros".`,
    })
  }

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
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} alt={`@${user?.displayName || user?.email}`} />
                      <AvatarFallback>{getInitials(user?.displayName || user?.email || 'U')}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
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
                    <CardTitle>Gerenciar Categorias de Despesa</CardTitle>
                    <CardDescription>Edite ou exclua as categorias para manter suas finanças organizadas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="divide-y divide-border">
                        {uniqueCategories.map(category => (
                            <li key={category} className="flex items-center justify-between py-3">
                                <span className='font-medium'>{category}</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='h-8 w-8'>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <EditCategoryDialog 
                                            category={category} 
                                            onSave={handleEditCategory}
                                            trigger={
                                                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                            }
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={e => e.preventDefault()}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Excluir categoria "{category}"?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação não pode ser desfeita. Todas as transações nesta categoria serão movidas para "Outros".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteCategory(category)} className={cn(buttonVariants({variant: 'destructive'}))}>
                                                        Sim, excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        ))}
                    </ul>
                     {uniqueCategories.length === 0 && (
                        <p className='text-center text-muted-foreground py-4'>Nenhuma categoria de despesa encontrada.</p>
                     )}
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
                            <CardDescription>O essencial para organizar suas finanças manualmente.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex-grow'>
                            <p className="text-2xl font-bold">R$ 0<span className='text-sm font-normal text-muted-foreground'>/mês</span></p>
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                                    <span>Inclusão manual e controle de transações, metas, contas e lista de compras.</span>
                                </li>
                                <li className="flex items-start font-semibold text-primary/90 gap-2">
                                    <Lightbulb className="h-4 w-4 mt-1 text-primary shrink-0" />
                                    <span>Insights e dicas com Inteligência Artificial.</span>
                                </li>
                                 <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-1 text-destructive shrink-0" />
                                    <span>Suporte prioritário</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className='w-full' disabled={!isPremium}>
                               Seu Plano Atual
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className={cn('flex flex-col', isPremium && 'border-primary/50 shadow-lg relative overflow-hidden')}>
                        {isPremium && <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">SEU PLANO</div>}
                        <CardHeader>
                            <CardTitle className='text-xl font-headline'>Premium</CardTitle>
                            <CardDescription>Apoie o desenvolvimento do app e tenha acesso a vantagens.</CardDescription>
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
                                    <span>Suporte prioritário por email.</span>
                                </li>
                                 <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                                    <span>Acesso antecipado a novos recursos.</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button className='w-full' onClick={handleUpgrade} disabled={isPremium}>
                                {isPremium ? "Obrigado pelo seu apoio!" : <><Zap className='mr-2 h-4 w-4' /> Apoiar o Projeto</>}
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
