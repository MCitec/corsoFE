/**
 * login.js — Gestione autenticazione
 * LipariBank Day 2
 */

"use strict";

class LoginController {
  constructor() {
    this.loginForm = document.getElementById("login-form");
    this.errorMsg = document.getElementById("error-message");
    this.submitBtn = document.getElementById("submit-btn");
    this.isLoading = false;

    this.loginForm.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    this.isLoading = true;
    this.setLoading(true);

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    this.showError("");

    if (!username || !password) {
      this.showError("Inserisci username e password.");
      this.isLoading = false;
      this.setLoading(false);
      return;
    }

    // Simulazione chiamata API con delay
    setTimeout(() => {
      if (username === "mario.rossi" && password === "password123") {
        window.location.href = "transactions.html";
      } else {
        this.showError("Credenziali non valide. Riprova.");
        this.isLoading = false;
        this.setLoading(false);
      }
    }, 800);
  }

  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = message ? "block" : "none";
  }

  setLoading(loading) {
    if (loading) {
      this.submitBtn.textContent = "Accesso in corso…";
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add("btn--loading");
    } else {
      this.submitBtn.textContent = "Accedi";
      this.submitBtn.disabled = false;
      this.submitBtn.classList.remove("btn--loading");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LoginController();
});
