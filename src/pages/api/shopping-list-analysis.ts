// src/pages/api/shopping-list-analysis.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeShoppingList, AnalyzeShoppingListInput } from '@/ai/flows/shopping-list-analyzer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const input: AnalyzeShoppingListInput = req.body;
        if (input.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'A lista de compras está vazia.',
            });
        }
        const result = await analyzeShoppingList(input);
        return res.status(200).json({
            success: true,
            message: 'Análise da lista de compras concluída!',
            data: result,
        });
    } catch (error) {
        console.error('Error analyzing shopping list:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({
            success: false,
            message: `Erro ao analisar a lista de compras: ${errorMessage}`,
        });
    }
}
