xss-demo// =============================================================================
// DEMO EDUCATIVA: vulnerabilità XSS e come prevenirla
// DA USARE SOLO IN AMBIENTE DI SVILUPPO — mai in produzione
// =============================================================================

/**
 * Simula un'API che ritorna dati con contenuto malevolo
 * (nella realtà: dati inseriti da un utente malintenzionato)
 */
const maliciousApiData = {
  id: 'T999',
  description: '<img src=x onerror="alert(\'XSS! Cookie: \' + document.cookie)">',
  amount: 1000,
  type: 'debit',
};

// =============================================================================
// DIMOSTRAZIONE DEL PROBLEMA
// =============================================================================

function demoVulnerable() {
  const td = document.getElementById('demoCell');
  // ❌ innerHTML: il browser ESEGUE l'HTML iniettato
  // L'img src invalida esegue onerror → alert con i cookie!
  td.innerHTML = maliciousApiData.description;
  // In un'app reale: il cookie di sessione viene inviato a un server attaccante
}

function demoSafe() {
  const td = document.getElementById('demoCell');
  // ✅ textContent: tratta tutto come testo — i tag non vengono interpretati
  // Mostra letteralmente: <img src=x onerror="alert('XSS! Cookie: ...')">
  td.textContent = maliciousApiData.description;
}

// =============================================================================
// SOLUZIONE CON DOMPurify (per HTML trustato ma da fonte esterna)
// =============================================================================
// Quando DEVI usare innerHTML con dati esterni (es: rich text da CMS bancario),
// usa DOMPurify per sanitizzare:
// import DOMPurify from 'dompurify'; // npm install dompurify
//
// const sanitized = DOMPurify.sanitize(maliciousApiData.description);
// td.innerHTML = sanitized; // il tag img viene rimosso, il testo rimane
