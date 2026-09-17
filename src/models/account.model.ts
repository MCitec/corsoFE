'use strict';

export interface Account {
  id: string;
  iban: string;
  holder: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
}

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    iban: 'IT60 X054 2811 1010 0000 0123 456',
    holder: 'Mario Rossi',
    balance: 4_231.80,
    currency: 'EUR',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-01', date: '2024-02-20', description: 'Stipendio febbraio',      category: 'Lavoro',          type: 'credit', amount: 2500.00 },
  { id: 't-02', date: '2024-02-18', description: 'Affitto febbraio',        category: 'Casa',            type: 'debit',  amount: 950.00 },
  { id: 't-03', date: '2024-02-15', description: 'Supermercato Esselunga',  category: 'Alimentari',      type: 'debit',  amount: 143.50 },
  { id: 't-04', date: '2024-02-12', description: 'Bolletta ENEL',           category: 'Utenze',          type: 'debit',  amount: 87.30  },
  { id: 't-05', date: '2024-02-10', description: 'Netflix abbonamento',     category: 'Intrattenimento', type: 'debit',  amount: 15.99  },
  { id: 't-06', date: '2024-02-07', description: 'Rimborso spese viaggio',  category: 'Lavoro',          type: 'credit', amount: 320.00 },
  { id: 't-07', date: '2024-02-05', description: 'Farmacia',                category: 'Salute',          type: 'debit',  amount: 34.20  },
  { id: 't-08', date: '2024-02-01', description: 'Ristorante Centrale',     category: 'Ristorazione',    type: 'debit',  amount: 62.00  },
];
