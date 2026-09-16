'use strict';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  type: 'credit' | 'debit';
  amount: number;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1,  date: '2024-01-15', description: 'Stipendio gennaio',        category: 'Lavoro',          type: 'credit', amount: 2500.00 },
  { id: 2,  date: '2024-01-18', description: 'Affitto gennaio',          category: 'Casa',            type: 'debit',  amount: 950.00 },
  { id: 3,  date: '2024-01-20', description: 'Supermercato Esselunga',   category: 'Alimentari',      type: 'debit',  amount: 143.50 },
  { id: 4,  date: '2024-01-22', description: 'Bolletta ENEL',            category: 'Utenze',          type: 'debit',  amount: 87.30  },
  { id: 5,  date: '2024-01-25', description: 'Rimborso spese viaggio',   category: 'Lavoro',          type: 'credit', amount: 320.00 },
  { id: 6,  date: '2024-02-01', description: 'Netflix abbonamento',      category: 'Intrattenimento', type: 'debit',  amount: 15.99  },
  { id: 7,  date: '2024-02-05', description: 'Bonus produttività',       category: 'Lavoro',          type: 'credit', amount: 500.00 },
  { id: 8,  date: '2024-02-10', description: 'Farmacia',                 category: 'Salute',          type: 'debit',  amount: 34.20  },
  { id: 9,  date: '2024-02-14', description: 'Ristorante Centrale',      category: 'Ristorazione',    type: 'debit',  amount: 62.00  },
  { id: 10, date: '2024-02-20', description: 'Stipendio febbraio',       category: 'Lavoro',          type: 'credit', amount: 2500.00 },
];
