// rakan Office Login System - Dual Authentication
// Admin Login (Local) + Firebase User Login

(() => {
  // DOM Elements
  const loginForm = document.forms["loginForm"];
  const loginButton = document.getElementById("loginButton");
  const loginMessage = document.getElementById("loginMessage");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const usernameError = document.getElementById("usernameError");
  const passwordError = document.getElementById("passwordError");
  const passwordToggle = document.getElementById("passwordToggle");
  const forgetPasswordLink = document.getElementById("forgetPasswordLink");

  // Password visibility toggle
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      const eyeIcon = passwordToggle.querySelector(".eye-icon");
      if (!eyeIcon) return;

      if (isHidden) {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1
                   5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1
                   -2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>`;
      } else {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>`;
      }
    });
  }

  // Forget password link handler
  if (forgetPasswordLink) {
    forgetPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/forgot-password.html";
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Hide/clear previous messages
      if (loginMessage) {
        loginMessage.style.display = "none";
      }
      if (usernameError) usernameError.textContent = "";
      if (passwordError) passwordError.textContent = "";

      // Validate form and show loading (user provided helper)
      if (typeof window.validateAndShowLoading !== "function" ||
          !window.validateAndShowLoading(loginForm, loginButton)) {
        // If validateAndShowLoading doesn't exist or returns falsy, stop.
        return;
      }

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      let userType = null;

      try {
        console.log("Attempting admin (local) auth for:", username);

        // Attempt admin login if available. Accepts sync boolean or Promise<boolean>.
        const secureAuth =
          window.systemCore &&
          window.systemCore.database &&
          window.systemCore.database.connection &&
          window.systemCore.database.connection.authenticate;

        if (typeof secureAuth === "function") {
          // call it and tolerate either sync boolean or Promise<boolean>
          const adminResult = await Promise.resolve(secureAuth(username, password));
          if (adminResult) {
            console.log("Admin login successful");
            userType = "admin";
            // Set cookie and redirect immediately for admin
            setAuthCookie(userType);
            redirectToMainContent();
            return;
          } else {
            console.log("Admin authentication failed or returned falsy");
          }
        } else {
          console.log("No local admin authenticator found");
        }

        // If not admin, try Firebase auth
        console.log("Trying Firebase login for:", username);
        if (window.firebaseAuth && typeof window.signInWithEmailAndPassword === "function") {
          // signInWithEmailAndPassword usually returns a Promise
          await window.signInWithEmailAndPassword(window.firebaseAuth, username, password);
          console.log("Firebase login successful");
          userType = "user";

          // Check OTP requirement (30 days since last verification)
          const email = username;
          const lastVerifiedRaw = localStorage.getItem(`lastVerified_${email}`);
          const lastVerified = lastVerifiedRaw ? parseInt(lastVerifiedRaw, 10) : 0;
          const now = Date.now();
          const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
          const needsOTP = !lastVerified || (now - lastVerified > THIRTY_DAYS_MS);

          if (needsOTP) {
            sessionStorage.setItem("resetEmail", email);
            sessionStorage.setItem("verifyMode", "login");
            // go to OTP page
            window.location.href = "otp.html";
            return;
          } else {
            setAuthCookie(userType);
            redirectToMainContent();
            return;
          }
        } else {
          throw new Error("Firebase not initialized");
        }
      } catch (error) {
        console.warn("Login failed:", error && error.message ? error.message : error);
        // Clear input fields on failure
        if (usernameInput) usernameInput.value = "";
        if (passwordInput) passwordInput.value = "";

        showMessage("اسم المستخدم أو كلمة المرور غير صحيحة", "error");
      } finally {
        // Ensure loader is hidden even if simpleLoader is missing
        try {
          if (window.simpleLoader && typeof window.simpleLoader.hide === "function") {
            window.simpleLoader.hide(loginButton);
          }
        } catch (e) {
          console.warn("Error hiding loader:", e);
        }
      }
    });
  }

  // Helper functions
  function showMessage(message, type) {
    if (!loginMessage) return;

    loginMessage.textContent = message;
    // Keep existing classes but add type for styling if present
    loginMessage.className = type; // preserves your CSS approach
    loginMessage.style.display = "block";

    // Auto-hide messages based on type
    if (type === "success") {
      setTimeout(() => {
        if (loginMessage.className === type) {
          loginMessage.style.display = "none";
        }
      }, 3000);
    } else if (type === "error") {
      setTimeout(() => {
        if (loginMessage.className === type) {
          loginMessage.style.display = "none";
        }
      }, 60000); // 60s
    }
  }

  function setAuthCookie(userType) {
    // NOTE: for best security, set cookies from server with HttpOnly & Secure flags.
    const now = new Date();
    now.setHours(now.getHours() + 24); // 24 hour expiry
    document.cookie = `loggedIn=true;expires=${now.toUTCString()};path=/`;
    document.cookie = `userType=${encodeURIComponent(userType)};expires=${now.toUTCString()};path=/`;
  }

  function redirectToMainContent() {
    window.location.href = "/";
  }

  // Check if already logged in and redirect
  function checkExistingLogin() {
    if (document.cookie.includes("loggedIn=true")) {
      redirectToMainContent();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/login.html") {
      checkExistingLogin();
    }
  });
})();
