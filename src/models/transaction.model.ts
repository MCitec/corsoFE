export type TransactionType = "credit" | "debit";

export type TransactionCategory =
  | "Entrata"
  | "Casa"
  | "Alimentari"
  | "Utenze"
  | "Svago"
  | "Shopping"
  | "Trasporti";

export interface ITransaction {
  readonly id: number;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface ITransactionFilters {
  type?: TransactionType;
  minAmount?: number;
  searchQuery?: string;
}
