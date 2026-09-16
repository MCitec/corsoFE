"use strict";

import { TransactionService } from "./services/transaction.service";
import { initTransactionsUI } from "./ui/transactions.ui";

const service = new TransactionService();
initTransactionsUI(service);
