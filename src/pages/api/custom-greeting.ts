// src/pages/api/custom-greeting.ts
import { NextApiRequest, NextApiResponse } from 'next';

type GreetingState = {
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GreetingState>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'O nome não pode estar vazio.' });
    }

    try {
        // ATENÇÃO: Substitua 'https://sua-api.com/responder' pela URL real da sua API.
        // Esta é uma URL de exemplo e não funcionará.
        const externalApiResponse = await fetch('https://sua-api.com/responder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // O corpo da requisição pode precisar ser ajustado para corresponder ao que sua API espera.
            body: JSON.stringify({ mensagem: `Crie uma saudação para ${name}` })
        });

        if (!externalApiResponse.ok) {
            // Se a API externa retornar um erro, nós o repassamos.
            const errorText = await externalApiResponse.text();
            console.error('External API Error:', errorText);
            throw new Error(`A chamada para a API externa falhou com o status: ${externalApiResponse.status}`);
        }

        const data = await externalApiResponse.json();

        // Assumindo que sua API retorna um objeto como: { "resposta": "Olá, [Nome]!" }
        const greeting = data.resposta; 
        
        return res.status(200).json({
            success: true,
            message: greeting || 'A API respondeu, mas sem uma saudação.',
        });

    } catch (error) {
        console.error('Erro ao chamar a IA externa:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        
        // Simula uma resposta de sucesso para fins de demonstração se a chamada falhar
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('failed')) {
             return res.status(200).json({
                success: true,
                message: `(Simulação) Olá, ${name}! Bem-vindo(a) ao FinanZen.`,
            });
        }
        
        return res.status(500).json({
            success: false,
            message: `Erro ao se comunicar com a IA: ${errorMessage}`,
        });
    }
}
