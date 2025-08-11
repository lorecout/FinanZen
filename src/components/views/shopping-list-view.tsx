
"use client"

import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Sparkles,
  Loader2,
  Lightbulb,
  Zap,
} from "lucide-react"

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
import { handleShoppingListAnalysis } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

type AnalysisResult = {
    estimatedCost: number;
    suggestions: string[];
};

type ShoppingListViewProps = {
    items: ShoppingItem[];
    addItem: (item: Omit<ShoppingItem, 'id'>) => void;
    deleteItem: (itemId: string) => void;
    updateItem: (item: ShoppingItem) => void;
}

export default function ShoppingListView({ items, addItem, deleteItem, updateItem }: ShoppingListViewProps) {
  const [newItemName, setNewItemName] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { isPremium } = useAuth();

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;
    const newItem: Omit<ShoppingItem, 'id'> = {
        name: newItemName.trim(),
        checked: false,
    };
    addItem(newItem);
    setNewItemName('');
  }

  const handleToggleItem = (item: ShoppingItem) => {
    updateItem({ ...item, checked: !item.checked });
  }

  const handleAnalyzeList = async () => {
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    const analysisItems = items.filter(item => !item.checked);

    // Convert to the format expected by the AI flow
    const flowInputItems = analysisItems.map(item => ({
        id: item.id,
        name: item.name,
        checked: item.checked,
    }));


    const result = await handleShoppingListAnalysis({ items: flowInputItems });

    if (result.success && result.data) {
        setAnalysisResult(result.data);
    } else {
        toast({
            variant: "destructive",
            title: "Erro na Análise",
            description: result.message,
        });
    }

    setIsLoadingAnalysis(false);
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
                    {items && items.length > 0 ? (
                        items.map(item => (
                        <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                            <Checkbox 
                                id={item.id} 
                                checked={item.checked}
                                onCheckedChange={() => handleToggleItem(item)}
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
                                onClick={() => deleteItem(item.id)}
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

        {items && items.filter(item => !item.checked).length > 0 && (
            <Card className="mt-4 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Análise Inteligente (Premium)
                    </CardTitle>
                    <CardDescription>
                        Use a IA para estimar o custo e obter sugestões para os itens não marcados da sua lista.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   {isPremium ? (
                    <>
                        {isLoadingAnalysis ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : analysisResult ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Custo Estimado</h3>
                                    <p className="text-2xl font-bold text-primary">
                                        R$ {analysisResult.estimatedCost.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                    <Lightbulb className='h-5 w-5' /> Sugestões de Itens
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {analysisResult.suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : null}
                        <Button onClick={handleAnalyzeList} disabled={isLoadingAnalysis} className="w-full mt-4">
                            {isLoadingAnalysis ? "Analisando..." : "Analisar Lista com IA"}
                        </Button>
                    </>
                   ) : (
                     <div className='text-center p-4 bg-background/50 rounded-lg flex flex-col items-center gap-4'>
                        <p className='font-medium'>Este é um recurso exclusivo para assinantes Premium.</p>
                        <Button asChild>
                           <Link href="/configuracoes">
                                <Zap className='mr-2 h-4 w-4' /> Fazer Upgrade Agora
                           </Link>
                        </Button>
                    </div>
                   )}
                </CardContent>
            </Card>
        )}
    </>
  )
}
