"use strict";

function handleSubmit(
  e: Event,
  emailInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
): void {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === "demo@liparibank.it" && password === "demo1234") {
    window.location.href = "dashboard.html";
  } else {
    const loginError = document.getElementById("loginError");
    if (loginError) loginError.style.display = "block";
  }
}

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

if (
  loginForm instanceof HTMLFormElement &&
  emailInput instanceof HTMLInputElement &&
  passwordInput instanceof HTMLInputElement
) {
  loginForm.addEventListener("submit", (event) =>
    handleSubmit(event, emailInput, passwordInput),
  );
}
