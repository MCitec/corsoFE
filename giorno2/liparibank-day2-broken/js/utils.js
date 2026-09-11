/**
 * utils.js — Dati mock e funzioni condivise
 * LipariBank Day 2
 */

// =============================================================================
// Dati mock — array transazioni
// =============================================================================

const transactions = [
  {
    id: 1,
    date: '2024-01-03',
    description: 'Stipendio — Acme S.r.l.',
    category: 'Entrata',
    amount: '1500',
    type: 'credit',
  },
  {
    id: 2,
    date: '2024-01-02',
    description: 'Esselunga — Spesa settimanale',
    category: 'Alimentari',
    amount: -87.40,
    type: 'debit',
  },
  {
    id: 3,
    date: '2024-01-01',
    description: 'Enel Energia — Bolletta dicembre',
    category: 'Utenze',
    amount: -124.00,
    type: 'debit',
  },
  {
    id: 4,
    date: '2023-12-31',
    description: 'Netflix — Abbonamento mensile',
    category: 'Svago',
    amount: -15.99,
    type: 'debit',
  },
  {
    id: 5,
    date: '2023-12-30',
    description: 'Rimborso spese — Mario V.',
    category: 'Bonifico',
    amount: '200.50',
    type: 'credit',
  },
  {
    id: 6,
    date: '2023-12-29',
    description: 'Amazon — Ordine #114-789',
    category: 'Shopping',
    amount: -239.00,
    type: 'debit',
  },
  {
    id: 7,
    date: '2023-12-28',
    description: 'Trenitalia — Milano-Roma',
    category: 'Trasporti',
    amount: -68.50,
    type: 'debit',
  },
  {
    id: 8,
    date: '2023-12-22',
    description: 'Mutuo casa — rata dicembre',
    category: 'Casa',
    amount: -780.00,
    type: 'debit',
  },
  {
    id: 9,
    date: '2023-12-26',
    description: 'Bonus produttività Q4',
    category: 'Entrata',
    amount: 400.00,
    type: 'credit',
  },
  {
    id: 10,
    date: '2023-12-15',
    description: 'Rimborso assicurazione auto',
    category: 'Entrata',
    amount: 180.00,
    type: 'credit',
  },
];

// =============================================================================
// calculateBalance
// =============================================================================

function calculateBalance(txList) {
  return txList.reduce((acc, tx) => {
    return acc + tx.amount;
  }, 0);
}

// =============================================================================
// Utility — formattazione
// =============================================================================

/**
 * Formatta un numero come valuta EUR (it-IT).
 * Restituisce 'NaN €' se amount non è un numero valido.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Formatta una stringa ISO date in formato leggibile italiano.
 * Es. '2024-01-03' → '03 gen 2024'
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00'); // forza UTC locale
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Restituisce la classe CSS badge appropriata per una categoria.
 */
function getCategoryBadgeClass(category) {
  const map = {
    Entrata:    'badge--success',
    Bonifico:   'badge--info',
    Alimentari: 'badge--neutral',
    Utenze:     'badge--neutral',
    Svago:      'badge--neutral',
    Shopping:   'badge--neutral',
    Trasporti:  'badge--neutral',
    Casa:       'badge--neutral',
  };
  return map[category] || 'badge--neutral';
}
