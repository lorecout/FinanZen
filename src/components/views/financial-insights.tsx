
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { handleFinancialInsights } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { type Transaction } from '@/types';
import { useAuth } from '@/hooks/use-auth';

type FinancialInsightsProps = {
    transactions: Transaction[];
}

// Basic markdown to HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    // Replace **text** with <strong>text</strong>
    const bolded = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    const italized = bolded.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Replace newlines with <br />
    const withLineBreaks = italized.replace(/\n/g, '<br />');

    return (
        <div 
            className="text-sm text-card-foreground space-y-2" 
            dangerouslySetInnerHTML={{ __html: withLineBreaks }} 
        />
    );
};


export default function FinancialInsights({ transactions }: FinancialInsightsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);
    const { toast } = useToast();
    
    const hasTransactions = transactions && transactions.length > 0;

    const getInsights = async () => {
        setIsLoading(true);
        setInsights(null);
        try {
            const result = await handleFinancialInsights({ transactions });
            if (result.success && result.data) {
                setInsights(result.data.summary);
            } else {
                 setInsights(result.message); // Display error or info message from backend
                toast({
                    variant: 'destructive',
                    title: 'Erro ao gerar insights',
                    description: result.message,
                });
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Erro inesperado',
                description: 'Ocorreu um erro ao se comunicar com o servidor.',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                    <Lightbulb className="text-primary" />
                    Insights Financeiros com IA
                </CardTitle>
                <CardDescription>
                   Deixe nossa IA analisar suas finanças e te dar dicas valiosas para economizar.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : insights ? (
                    <div className="p-4 bg-background/50 rounded-lg">
                       <MarkdownRenderer content={insights} />
                    </div>
                ) : null}

                <Button onClick={getInsights} disabled={isLoading || !hasTransactions} className="w-full">
                    {isLoading ? 'Analisando suas finanças...' : 'Gerar Novos Insights'}
                </Button>
                </>
            </CardContent>
        </Card>
    );
}
