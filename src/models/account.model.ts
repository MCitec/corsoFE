export type AccountType = "current" | "savings";

export interface IAccount {
  readonly id: number;
  name: string;
  iban: string;
  balance: number;
  accountType: AccountType;
}
