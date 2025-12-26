// rakan Office Authentication Protection System
// Protects ALL pages automatically except login/auth pages

// 1. Check if user is logged in (কুকি চেক করা)
function isUserLoggedIn() {
  return document.cookie.includes("loggedIn=true");
}

// 2. Get current page path (বর্তমান পেজের লিংক)
function getCurrentPath() {
  return window.location.pathname;
}

// 3. Check if current page is an Auth Page (public pages)
function isAuthPage() {
  const path = getCurrentPath();
  return (
    path.includes("/login.html") ||
    path.includes("/forgot-password.html")
  );
}

// 4. Check if current page is a flow-protected page
function isFlowProtectedPage() {
  const path = getCurrentPath();
  return (
    path.includes("/otp.html") ||
    path.includes("/check-email.html")
  );
}

// 5. Validate flow for otp.html and check-email.html
function validateFlowAccess() {
  const path = getCurrentPath();
  
  // otp.html এর জন্য চেক
  if (path.includes("/otp.html")) {
    const resetEmail = sessionStorage.getItem("resetEmail");
    const verifyMode = sessionStorage.getItem("verifyMode");
    
    if (!resetEmail || !verifyMode) {
      return false;
    }
    return true;
  }
  
  // check-email.html এর জন্য চেক
  if (path.includes("/check-email.html")) {
    const resetEmail = sessionStorage.getItem("resetEmail");
    const otpVerified = sessionStorage.getItem("otpVerified");
    
    if (!resetEmail || !otpVerified) {
      return false;
    }
    return true;
  }
  
  return true;
}

// 6. Redirect to login (লগইন পেজে পাঠানো)
function redirectToLogin() {
  if (!window.location.pathname.includes("/login.html")) {
    window.location.href = "/login.html";
  }
}

// 7. Redirect to main content (হোম পেজে পাঠানো)
function redirectToMainContent() {
  window.location.href = "/";
}

// 8. MAIN PROTECTION LOGIC (ইউনিভার্সাল প্রোটেকশন লজিক)
function protectPage() {
  const isLoggedIn = isUserLoggedIn();
  const isAuth = isAuthPage();
  const isFlowProtected = isFlowProtectedPage();

  // Flow-protected pages (otp.html, check-email.html) এর জন্য চেক
  if (isFlowProtected) {
    if (!validateFlowAccess()) {
      // সঠিক ফ্লো ছাড়া অ্যাক্সেস নেই
      if (isLoggedIn) {
        redirectToMainContent();
      } else {
        redirectToLogin();
      }
      return;
    }
    // ফ্লো সঠিক হলে পেজে থাকতে দেওয়া
    return;
  }

  // Normal auth pages (login, forgot-password)
  if (isAuth) {
    // লগইন থাকলে হোমে পাঠানো
    if (isLoggedIn) {
      redirectToMainContent();
    }
    return;
  }

  // Protected content pages
  if (!isAuth && !isLoggedIn) {
    redirectToLogin();
  }
}

// 9. Logout functionality (লগআউট ফাংশন)
function logout() {
  // সব কুকি ডিলিট করা
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // লোকাল স্টোরেজ ক্লিয়ার করা
  localStorage.clear();
  sessionStorage.clear();
  
  // ফায়ারবেস সাইনআউট (যদি থাকে)
  if (window.firebaseAuth && window.firebaseAuth.signOut) {
    window.firebaseAuth.signOut().catch(console.warn);
  }

  // লগইন পেজে রিডাইরেক্ট
  window.location.href = "/login.html";
}

// 10. Initialize protection when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // পেজ লোড হওয়ামাত্রই প্রোটেকশন চেক শুরু হবে
  protectPage();

  // সব লগআউট বাটনে ক্লিক ইভেন্ট সেট করা
  const logoutBtns = document.querySelectorAll("#logoutBtn, .logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", logout);
  });
});

// Global functions export (যাতে অন্য জায়গা থেকে কল করা যায়)
window.logout = logout;
window.isUserLoggedIn = isUserLoggedIn;
window.protectPage = protectPage;
