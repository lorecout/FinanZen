export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
};

export type Category = {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};

export type Bill = {
  id: string;
  name:string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'due' | 'overdue';
};
