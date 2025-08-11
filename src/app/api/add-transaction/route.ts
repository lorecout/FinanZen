import { NextResponse } from 'next/server';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '@/lib/firebase/server-app';
import { getAuth } from 'firebase-admin/auth';
import { headers } from 'next/headers';
import { TransactionSchema } from '@/types/schemas';

const db = getDatabase(app);

async function getUserIdFromToken(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await getAuth(app).verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const uid = await getUserIdFromToken(request);

        if (!uid) {
            return NextResponse.json({ success: false, message: 'Usuário não autenticado.' }, { status: 401 });
        }

        const body = await request.json();
        
        // Validate the transaction data against a schema
        const validation = TransactionSchema.omit({ id: true }).safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, message: 'Dados da transação inválidos.', errors: validation.error.flatten() }, { status: 400 });
        }

        const transaction = validation.data;

        // Push new transaction to the database
        const transactionsRef = ref(db, `users/${uid}/transactions`);
        const newTransactionRef = push(transactionsRef);
        
        await set(newTransactionRef, { ...transaction, id: newTransactionRef.key });

        return NextResponse.json({ success: true, message: 'Transação adicionada com sucesso!', id: newTransactionRef.key });

    } catch (error) {
        console.error('Error adding transaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, message: `Erro no servidor: ${errorMessage}` }, { status: 500 });
    }
}
