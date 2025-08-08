"use client";

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ExternalApiCard() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const onGenerateGreeting = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/custom-greeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const result = await response.json();
            
            if (result.success) {
                toast({
                    title: 'Resposta da IA Externa',
                    description: result.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro na API Externa',
                    description: result.message,
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro de comunicação',
                description: 'Não foi possível se comunicar com o servidor.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot /> Exemplo de API Externa
                </CardTitle>
                <CardDescription>
                    Este é um exemplo de como chamar uma API de IA externa a partir de uma Rota de API do Next.js.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input 
                    placeholder="Digite um nome" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
                <Button onClick={onGenerateGreeting} disabled={isLoading || !name} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : 'Gerar Saudação com IA'}
                </Button>
            </CardContent>
        </Card>
    );
}
