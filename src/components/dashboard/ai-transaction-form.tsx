"use client"

import React, { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleTransactionAnalysis } from "@/app/actions";
import { ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Analisando..." : "Adicionar Transação"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function AiTransactionForm() {
  const [state, formAction] = useActionState(handleTransactionAnalysis, undefined);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Sucesso!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state?.success === false) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="relative">
        <Textarea
          name="text"
          placeholder='Ex: "Aluguel R$ 1500" ou "Salário R$ 5000"'
          className="pr-10"
          rows={2}
        />
        <Sparkles className="absolute right-3 top-3 h-5 w-5 text-primary/70" />
      </div>
      <SubmitButton />
      {state?.data && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm">
            <h4 className="font-semibold mb-2">Dados da Última Transação:</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p><strong>Valor:</strong></p>
              <p>R$ {state.data.amount.toFixed(2).replace('.', ',')}</p>
              <p><strong>Descrição:</strong></p>
               <p>{state.data.description}</p>
              <p><strong>Categoria:</strong></p>
              <p>{state.data.category}</p>
              <p><strong>Recorrente:</strong></p>
               <p>{state.data.isRecurring ? 'Sim' : 'Não'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
