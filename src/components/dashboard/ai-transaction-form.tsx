"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import type { AnalyzeTransactionOutput } from "@/ai/flows/transaction-analyzer";
import type { Transaction } from "@/types";

type AiTransactionFormProps = {
  onAddTransaction: (data: Omit<Transaction, 'id'>) => void;
};

export default function AiTransactionForm({ onAddTransaction }: AiTransactionFormProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<AnalyzeTransactionOutput | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setLastTransaction(null);

    try {
      const response = await fetch('/api/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        
        const newTransaction: Omit<Transaction, 'id'> = {
            ...result.data,
            date: new Date().toISOString(),
            type: result.data.description.toLowerCase().includes('salário') || result.data.description.toLowerCase().includes('renda') ? 'income' : 'expense',
            amount: result.data.amount
        };
        onAddTransaction(newTransaction);
        setLastTransaction(result.data);
        formRef.current?.reset();
        setText("");

      } else {
        toast({
          variant: "destructive",
          title: "Erro!",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Ocorreu um erro ao se comunicar com o servidor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          name="text"
          placeholder='Ex: "Aluguel R$ 1500" ou "Salário R$ 5000"'
          className="pr-10"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <Sparkles className="absolute right-3 top-3 h-5 w-5 text-primary/70" />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? "Analisando..." : "Adicionar Transação"}
        <Sparkles className="ml-2 h-4 w-4" />
      </Button>
      {lastTransaction && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm">
            <h4 className="font-semibold mb-2">Dados da Última Transação Adicionada:</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p><strong>Valor:</strong></p>
              <p>R$ {lastTransaction.amount.toFixed(2).replace('.', ',')}</p>
              <p><strong>Descrição:</strong></p>
               <p>{lastTransaction.description}</p>
              <p><strong>Categoria:</strong></p>
              <p>{lastTransaction.category}</p>
              <p><strong>Recorrente:</strong></p>
               <p>{lastTransaction.isRecurring ? 'Sim' : 'Não'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
