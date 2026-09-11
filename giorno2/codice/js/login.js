// =============================================================================
// Validazione form login LipariBank — Giorno 2
// Pattern: event-driven validation con feedback visivo real-time
// =============================================================================

// Seleziona elementi DOM — fatto UNA SOLA VOLTA all'inizializzazione
// PERCHÉ: document.querySelector è costoso se ripetuto ad ogni evento.
// In Angular/React non esiste questo problema (il framework gestisce il DOM).
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const loginAlert = document.getElementById("loginAlert");
const submitBtn = document.getElementById("loginSubmitBtn");

// =============================================================================
// UTILITY FUNCTIONS — funzioni pure (input → output, no side effects)
// PERCHÉ funzioni pure: testabili, prevedibili, riutilizzabili in utils.js
// =============================================================================

/**
 * Valida un indirizzo email
 * @param {string} email - l'email da validare
 * @returns {{ valid: boolean, message: string }}
 */
const validateEmail = (email) => {
  // Regex email: RFC 5322 semplificato (versione enterprise — non RFC completo)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim() === "") {
    return { valid: false, message: "L'email è obbligatoria" };
  }
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Inserisci un'email valida (es: nome@liparibank.it)",
    };
  }
  return { valid: true, message: "" };
};

/**
 * Valida la password con strength indicator
 * @param {string} password - la password da validare
 * @returns {{ valid: boolean, strength: 'weak'|'medium'|'strong', message: string, checks: object }}
 */
const validatePassword = (password) => {
  // Oggetto checks: ogni regola è una proprietà booleana
  // PERCHÉ oggetto checks: permette di mostrare feedback granulare nel UI
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  if (!password)
    return {
      valid: false,
      strength: "none",
      message: "La password è obbligatoria",
      checks,
    };
  if (passedChecks < 2)
    return {
      valid: false,
      strength: "weak",
      message: "Password troppo debole",
      checks,
    };
  if (passedChecks < 4)
    return {
      valid: false,
      strength: "medium",
      message: "Password media — aggiungi un simbolo",
      checks,
    };
  return { valid: true, strength: "strong", message: "Password forte", checks };
};

// =============================================================================
// UI FEEDBACK FUNCTIONS — effetti sul DOM
// PERCHÉ separare: la logica di validazione è separata dall'aggiornamento UI.
// In Angular, questo sarebbe nel template con [(ngModel)]. In React, con useState.
// =============================================================================

/**
 * Mostra o nasconde un messaggio di errore per un campo form
 * @param {HTMLElement} errorEl - l'elemento span dell'errore
 * @param {string} message - messaggio ('' per nascondere)
 * @param {'error'|'success'|''} type - tipo di stato
 */
const setFieldState = (input, errorEl, message, type) => {
  // Rimuove tutte le classi di stato precedenti
  input.classList.remove("form-input--error", "form-input--success");
  errorEl.classList.remove("form-error--visible");

  if (message) {
    errorEl.textContent = message;
    errorEl.classList.add("form-error--visible");
  }

  if (type === "error") {
    input.classList.add("form-input--error");
    input.setAttribute("aria-invalid", "true");
  } else if (type === "success") {
    input.classList.add("form-input--success");
    input.removeAttribute("aria-invalid");
  } else {
    input.removeAttribute("aria-invalid");
  }
};

/**
 * Aggiorna il password strength indicator nel DOM
 * @param {'none'|'weak'|'medium'|'strong'} strength
 * @param {object} checks - oggetto con i risultati di ogni regola
 */
const updatePasswordStrength = (strength, checks) => {
  const strengthBar = document.getElementById("passwordStrength");
  if (!strengthBar) return;

  // Rimuove classi precedenti con spread + join
  strengthBar.className = `password-strength password-strength--${strength}`;

  // Aggiorna le singole regole visivamente
  Object.entries(checks).forEach(([key, passed]) => {
    const checkEl = document.querySelector(`[data-check="${key}"]`);
    if (checkEl) {
      // classList.toggle: aggiunge se second param true, rimuove se false
      checkEl.classList.toggle("check--passed", passed);
      checkEl.classList.toggle("check--failed", !passed);
    }
  });
};

// =============================================================================
// EVENT LISTENERS — validazione real-time
// PERCHÉ 'input' e non 'change': 'input' si attiva ad ogni carattere digitato
// 'change' si attiva solo quando il campo perde focus — UX peggiore
// =============================================================================

emailInput?.addEventListener("input", (event) => {
  // event.target.value: il valore corrente del campo
  // PERCHÉ optional chaining (emailInput?.): se l'elemento non esiste,
  // non lancia TypeError — graceful degradation
  const { valid, message } = validateEmail(event.target.value);
  setFieldState(
    emailInput,
    emailError,
    valid ? "" : message,
    valid ? "success" : "error",
  );
});

passwordInput?.addEventListener("input", (event) => {
  const { valid, strength, message, checks } = validatePassword(
    event.target.value,
  );
  setFieldState(
    passwordInput,
    passwordError,
    valid ? "" : message,
    valid ? "success" : "error",
  );
  updatePasswordStrength(strength, checks);
});

// Toggle visibilità password
document
  .querySelector('[data-toggle-target="password"]')
  ?.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    // aria-label aggiornato per screen reader
    const btn = document.querySelector('[data-toggle-target="password"]');
    btn.setAttribute(
      "aria-label",
      isPassword ? "Nascondi password" : "Mostra password",
    );
  });

// =============================================================================
// FORM SUBMIT
// =============================================================================
loginForm?.addEventListener("submit", (event) => {
  // SEMPRE preventDefault() su submit form — evita il reload della pagina
  event.preventDefault();

  const emailVal = emailInput.value.trim();
  const passwordVal = passwordInput.value;

  // Ri-valida tutto al submit (l'utente potrebbe non aver toccato i campi)
  const emailResult = validateEmail(emailVal);
  const passwordResult = validatePassword(passwordVal);

  setFieldState(
    emailInput,
    emailError,
    emailResult.valid ? "" : emailResult.message,
    emailResult.valid ? "success" : "error",
  );
  setFieldState(
    passwordInput,
    passwordError,
    passwordResult.valid ? "" : passwordResult.message,
    passwordResult.valid ? "success" : "error",
  );

  // Se validazione fallisce, blocca il submit
  if (!emailResult.valid || !passwordResult.valid) return;

  // Qui al Giorno 3 faremo la chiamata fetch() — per ora simuliamo
  console.log("Form valido — pronto per Giorno 3 con fetch()");
});
