// =============================================================================
// Demo closure: contatore di operazioni nella sessione bancaria
// PATTERN: module pattern con closure per data privacy
// =============================================================================

/**
 * createSessionTracker: factory function che restituisce un tracker
 * con stato privato inaccessibile dall'esterno.
 *
 * In un'app bancaria reale: traccia operazioni per rilevare anomalie
 * (es: troppi tentativi di login → blocco account).
 *
 * @param {number} maxOperations - soglia massima di operazioni
 * @returns {Object} - API pubblica del tracker
 */
const createSessionTracker = (maxOperations = 10) => {
  // 'count' e 'operations' non sono accessibili fuori da questa funzione
  // SONO "private" grazie alla closure
  let count = 0;
  const operations = [];
  const startTime = Date.now();

  return {
    /**
     * Registra un'operazione — incrementa il contatore
     * @param {string} operationName
     * @returns {{ count: number, blocked: boolean }}
     */
    track(operationName) {
      count++; // accede alla variabile privata 'count' tramite closure
      operations.push({
        name: operationName,
        timestamp: new Date().toISOString(),
        sequenceNumber: count,
      });

      const blocked = count >= maxOperations;
      if (blocked) {
        console.warn(
          `Sessione bloccata: raggiunte ${maxOperations} operazioni`,
        );
      }

      return { count, blocked };
    },

    getCount() {
      return count;
    }, // getter read-only

    getSummary() {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      return {
        totalOperations: count,
        sessionDuration: `${duration}s`,
        operations: [...operations], // copia shallow — non espone il reference
        isAtRisk: count > maxOperations * 0.8,
      };
    },

    reset() {
      count = 0;
      operations.length = 0; // svuota l'array mantenendo il reference
      console.log("Sessione resettata");
    },
  };
};

// Utilizzo
const sessionTracker = createSessionTracker(5);
sessionTracker.track("login");
sessionTracker.track("view_balance");
sessionTracker.track("view_transactions");
console.log(sessionTracker.getCount()); // 3
console.log(sessionTracker.count); // undefined — non accessibile!
