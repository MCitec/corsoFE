const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const strengthBar = document.querySelector(".password-strength");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function updatePasswordStrength(password) {
    strengthBar.className = "password-strength";

    if (password.length < 8) {
      strengthBar.classList.add("password-strength--weak");
      strengthBar.textContent = "Debole";
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^a-zA-Z\d]/.test(password);

    if (hasLetters && hasNumbers && hasSymbols) {
      strengthBar.classList.add("password-strength--strong");
      strengthBar.textContent = "Forte";
    } else if (hasLetters && hasNumbers) {
      strengthBar.classList.add("password-strength--medium");
      strengthBar.textContent = "Media";
    } else {
      strengthBar.classList.add("password-strength--weak");
      strengthBar.textContent = "Debole";
    }
  }

  passwordInput.addEventListener("input", (event) => {
    updatePasswordStrength(event.target.value);
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordIsValid =
      password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    let isValid = true;

    if (!emailPattern.test(email)) {
      emailError.textContent = "Email non valida";
      isValid = false;
    }

    if (!passwordIsValid) {
      passwordError.textContent =
        "La password deve avere almeno 8 caratteri, una maiuscola e un numero";
      isValid = false;
    }

    if (isValid) {
      console.log("Login OK:", { email });
    }
  });
}
