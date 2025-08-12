
"use client";

import { useState, useRef, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { analyzeTransaction, type AnalyzeTransactionOutput } from "@/ai/flows/transaction-analyzer";
import type { Transaction } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { getAuth, getIdToken } from "firebase/auth";

type AiTransactionFormProps = {
  onAddTransaction: (data: Omit<Transaction, 'id'>) => void;
};

export default function AiTransactionForm({ onAddTransaction }: AiTransactionFormProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<AnalyzeTransactionOutput | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { refreshData } = useAuth(); // Assuming useAuth provides a way to trigger data refresh

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Entrada Inválida",
        description: "Por favor, descreva uma transação.",
      });
      return;
    }
    setIsLoading(true);
    setLastTransaction(null);

    try {
      // 1. Analyze the text to get transaction details
      const analyzeResult = await analyzeTransaction({ text });
      
      setLastTransaction(analyzeResult);
      
      const transactionData: Omit<Transaction, 'id'> = {
        ...analyzeResult,
        date: new Date().toISOString(),
        type: analyzeResult.description.toLowerCase().includes('salário') || analyzeResult.description.toLowerCase().includes('renda') ? 'income' : 'expense',
        amount: analyzeResult.amount
      };

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }
      const token = await getIdToken(user);


      // 2. Add the transaction via the new secure endpoint
      const addResponse = await fetch('/api/add-transaction', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(transactionData),
      });

      const addResult = await addResponse.json();

      if (!addResponse.ok) {
          throw new Error(addResult.message || 'Falha ao adicionar a transação.');
      }

      toast({
        title: "Sucesso!",
        description: "Sua transação foi adicionada com segurança.",
      });

      formRef.current?.reset();
      setText("");
      refreshData(); // Refresh data from the database

    } catch (error: any) {
      console.error("Transaction submission error:", error);
      toast({
        variant: "destructive",
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao se comunicar com o servidor.",
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
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analisando...</> : "Adicionar Transação"}
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

    