
"use client"

import React, { useState } from 'react';
import {
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { ShoppingItem } from '@/types';
import { cn } from '@/lib/utils';


type ShoppingListViewProps = {
    items: ShoppingItem[];
    setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export default function ShoppingListView({ items, setItems }: ShoppingListViewProps) {
  const [newItemName, setNewItemName] = useState('');

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

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">Lista de Compras</h1>
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
    </>
  )
}
