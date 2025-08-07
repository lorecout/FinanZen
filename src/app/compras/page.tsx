
"use client"

import React, { useState, useMemo } from 'react';
import Link from "next/link"
import {
  CircleUser,
  Menu,
  Trash2,
  Plus,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from '@/components/logo';
import MobileNav, { getNavItems } from '@/components/dashboard/mobile-nav';
import type { ShoppingItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';

const initialItems: ShoppingItem[] = [
    { id: uuidv4(), name: "Leite", checked: false },
];


function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const { logout } = useAuth();
  
  const navItems = useMemo(() => getNavItems(), []);
  const pathname = usePathname();

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;
    const newItem: ShoppingItem = {
        id: uuidv4(),
        name: newItemName.trim(),
        checked: false,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemName('');
  }

  const handleToggleItem = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }


  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if (item.label === 'Adicionar') return null;
        const isActive = item.href === '/compras';
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
             <h1 className="text-lg font-semibold md:text-2xl font-headline hidden md:block">Lista de Compras</h1>
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
           <h1 className="text-lg font-semibold md:text-2xl font-headline md:hidden">Lista de Compras</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Sua Lista</CardTitle>
                    <CardDescription>Adicione, marque e gerencie seus itens de compra.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-full items-center space-x-2 mb-4">
                        <Input 
                            type="text" 
                            placeholder="Ex: Maçãs" 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        />
                        <Button type="submit" onClick={handleAddItem}>
                           <Plus className="h-4 w-4" /> 
                           <span className='sr-only md:not-sr-only md:ml-2'>Adicionar</span>
                        </Button>
                    </div>
                    
                    <div className='space-y-2'>
                        {items.length > 0 ? (
                           items.map(item => (
                            <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                <Checkbox 
                                    id={item.id} 
                                    checked={item.checked}
                                    onCheckedChange={() => handleToggleItem(item.id)}
                                />
                                <label
                                    htmlFor={item.id}
                                    className={cn("flex-1 text-sm font-medium leading-none cursor-pointer", {
                                        "line-through text-muted-foreground": item.checked,
                                    })}
                                >
                                    {item.name}
                                </label>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                           ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Sua lista de compras está vazia.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}


export default function ShoppingList() {
  return (
    <AuthGuard>
      <ShoppingListPage />
    </AuthGuard>
  )
}
