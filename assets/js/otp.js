// --- শুধুমাত্র সংখ্যা ইনপুট লজিক ---
const inputs = document.querySelectorAll(".otp-input");
const verifyBtn = document.getElementById("verifyBtn");

inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (
      [
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Tab",
        "Enter",
      ].includes(e.key) ||
      (e.ctrlKey && (e.key === "v" || e.key === "V"))
    ) {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        inputs[index - 1].focus();
      }
      return;
    }
    if (e.key >= "0" && e.key <= "9") {
      input.value = "";
      setTimeout(() => {
        if (index < inputs.length - 1) inputs[index + 1].focus();
      }, 10);
    } else {
      e.preventDefault();
    }
  });

  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    checkInputs();
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!text) return;
    inputs.forEach((item, idx) => {
      if (text[idx]) {
        item.value = text[idx];
        if (idx < inputs.length - 1) inputs[idx + 1].focus();
      }
    });
    checkInputs();
  });
});

function checkInputs() {
  let allFilled = true;
  let otpValue = "";
  inputs.forEach((input) => {
    if (input.value === "" ) allFilled = false;
    otpValue += input.value;
  });

  if (allFilled && otpValue.length === 6) {
    verifyBtn.disabled = false;
    verifyBtn.style.opacity = "1";
    verifyBtn.style.cursor = "pointer";
  } else {
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = "0.6";
    verifyBtn.style.cursor = "not-allowed";
  }
}

// --- আপডেটেড স্মার্ট টাইমার এবং UI লজিক ---
let timerId;
const timerDisplay = document.getElementById("timerCountdown");
const timerContainer = document.getElementById("timerContainer");
const resendBtn = document.getElementById("resendBtn");
const btnGroup = document.querySelector(".btn-timer-group"); 

const OTP_DURATION = 180; // ৩ মিনিট

function toArabicNumerals(str) {
  return str.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
}

function updateDisplay(secondsLeft) {
  if (secondsLeft < 0) secondsLeft = 0;
  let minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let timeString = `${minutes}:${seconds}`;
  timerDisplay.textContent = toArabicNumerals(timeString);
}

function toggleTimerUI(isRunning) {
  if (isRunning) {
    resendBtn.style.display = "none";
    timerContainer.style.display = "flex";
    if(btnGroup) btnGroup.classList.add("center-active");
  } else {
    resendBtn.style.display = "flex";
    resendBtn.innerHTML = `
        <span class="btn-icon"><i class="fa-solid fa-arrow-rotate-left"></i></span>
        <span class="btn-text">إعادة إرسال الرمز</span>
    `;
    resendBtn.disabled = false;
    timerContainer.style.display = "none";
    if(btnGroup) btnGroup.classList.remove("center-active");
  }
}

function handleTimer() {
  const now = Date.now();
  let endTimestamp = sessionStorage.getItem("otpExpiry");

  // এখানে নতুন লজিক: যদি স্টোরেজে টাইম না থাকে, তবেই সেট করবে
  if (!endTimestamp) {
    // এটি কেবল Resend বাটন বা প্রথমবার লোড থেকেই আসা উচিত
    endTimestamp = now + OTP_DURATION * 1000;
    sessionStorage.setItem("otpExpiry", endTimestamp);
  }
  
  runCountdown(endTimestamp);
}

function runCountdown(endTimestamp) {
  clearInterval(timerId);

  const nowStart = Date.now();
  
  // চেক করা সময় শেষ কি না
  if (Math.round((endTimestamp - nowStart) / 1000) > 0) {
    toggleTimerUI(true);
  } else {
    // সময় আগেই শেষ হয়ে থাকলে OTP বাতিল করো এবং UI রিসেট করো
    expireOTP(); 
    toggleTimerUI(false);
    updateDisplay(0);
    return;
  }

  timerId = setInterval(() => {
    const now = Date.now();
    const secondsLeft = Math.round((endTimestamp - now) / 1000);

    if (secondsLeft <= 0) {
      clearInterval(timerId);
      updateDisplay(0);
      expireOTP(); // সময় শেষ হওয়ার সাথে সাথে OTP বাতিল
      toggleTimerUI(false); 
    } else {
      updateDisplay(secondsLeft);
      if (timerContainer.style.display === "none") {
         toggleTimerUI(true);
      }
    }
  }, 1000);

  const nowInitial = Date.now();
  const initialSeconds = Math.round((endTimestamp - nowInitial) / 1000);
  updateDisplay(initialSeconds);
}

// রিসেন্ড বাটন লজিক
resendBtn.addEventListener("click", () => {
  resendBtn.innerHTML = `
      <span class="btn-icon"><i class="fa-solid fa-spinner fa-spin"></i></span>
      <span class="btn-text">جاري الإرسال...</span>
  `;
  resendBtn.disabled = true;

  setTimeout(() => {
      inputs.forEach((input) => (input.value = ""));
      inputs[0].focus();
      checkInputs();

      // রিসেন্ডে ক্লিক করলেই কেবল নতুন সময় সেট হবে
      const now = Date.now();
      const newExpiry = now + OTP_DURATION * 1000;
      sessionStorage.setItem("otpExpiry", newExpiry);
      
      toggleTimerUI(true);
      runCountdown(newExpiry);

      generateAndSendOTP();
  }, 5000);
});

// --- অন্যান্য ফাংশন ---

const feedback = document.getElementById("feedback");
function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = `text ${type}`;
  feedback.style.display = "block";
  setTimeout(() => {
    feedback.style.display = "none";
  }, 5000);
}

// গ্লোবাল ভেরিয়েবল
let currentOTP = null; 

// ১. OTP জেনারেট এবং সেট করার ফাংশন
function generateAndSendOTP() {
  currentOTP = window.generateOTP(); 
  console.log("New OTP Generated:", currentOTP); 

  if(window.sendOTPToTelegram && resetEmail) {
      window.sendOTPToTelegram(resetEmail, currentOTP);
      showFeedback("تم إرسال رمز جديد", "success");
  } else {
      console.log("Telegram Utils or Email missing");
  }
}

// ২. OTP বাতিল করার ফাংশন 
function expireOTP() {
    // শুধুমাত্র যদি OTP আগে থেকে থাকে তবেই এক্সপায়ার মেসেজ দেখাবে
    if (currentOTP !== null) {
        currentOTP = null; 
        showFeedback("انتهت صلاحية الرمز. يرجى طلب رمز جديد", "error"); 
        console.log("OTP Expired");
    }
}

const resetEmail = sessionStorage.getItem("resetEmail");
const verifyMode = sessionStorage.getItem("verifyMode");

// সিকিউরিটি চেক
if (!resetEmail || !verifyMode) {
  window.location.href = "forgot-password.html";
}

// ভেরিফাই বাটন ক্লিক লজিক 
verifyBtn.addEventListener("click", async () => {
  if (currentOTP === null) {
      showFeedback("انتهت صلاحية الرمز. يرجى طلب رمز جديد", "error");
      return;
  }

  const entered = Array.from(inputs).map(i => i.value).join("");
  
  if (entered === currentOTP) {
    showFeedback("الرمز صحيح! جاري التحقق...", "success");
    sessionStorage.setItem("otpVerified", "true");
    sessionStorage.removeItem("otpExpiry");

    if (verifyMode === "forgot") {
      setTimeout(() => {
        window.location.replace("check-email.html");
      }, 1500);
    } else if (verifyMode === "login") {
      localStorage.setItem(`lastVerified_${resetEmail}`, Date.now());
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("verifyMode");
      sessionStorage.removeItem("otpVerified");
      setTimeout(() => window.location.replace("/"), 2000);
    }
  } else {
    showFeedback("الرمز غير صحيح. حاول مرة أخرى", "error");
  }
});

// --- পেজ লোড লজিক (FIXED) ---
document.addEventListener("DOMContentLoaded", () => {
    // সেশন স্টোরেজ চেক করা
    const existingExpiry = sessionStorage.getItem("otpExpiry");
    
    if (!existingExpiry) {
        // ১. যদি একদমই নতুন ভিজিট হয় (স্টোরেজে কিছু নেই) -> সেন্ড করো
        generateAndSendOTP(); 
        handleTimer();       
    } else {
        // ২. যদি স্টোরেজে ডেটা থাকে, চেক করো সময় আছে কিনা
        const now = Date.now();
        if (parseInt(existingExpiry) <= now) {
            // সময় শেষ: নতুন করে পাঠাবে না, শুধু UI রিসেট করবে
            console.log("Session expired, waiting for user resend...");
            expireOTP();
            toggleTimerUI(false); // Resend বাটন দেখাবে
            updateDisplay(0);
        } else {
            // সময় বাকি আছে: টাইমার কন্টিনিউ করো
            handleTimer();
        }
    }
});






    document.addEventListener("DOMContentLoaded", function () {
      const inputs = Array.from(document.querySelectorAll(".otp-input"));

      // Function to sync Visual Display
      const updateVisualState = (input) => {
        const wrapper = input.parentElement;
        const display = wrapper.querySelector('.otp-display');

        if (input.value.length > 0) {
          display.textContent = input.value;
          wrapper.classList.add("filled");

          // Enter Animation (0.15s - Very Fast)
          display.classList.remove('animate-out');
          display.classList.add('animate-in');

        } else {
          wrapper.classList.remove("filled");
          // Exit Animation (0.1s - Instant)
          if (display.textContent !== "") {
            display.classList.remove('animate-in');
            display.classList.add('animate-out');

            // Clear text quicker (100ms) to match animation speed
            setTimeout(() => {
              if (input.value === "") display.textContent = "";
            }, 100);
          }
        }
      };

      const handleFocusStyles = (focusedIndex) => {
        inputs.forEach((inp, idx) => {
          const wrapper = inp.parentElement;
          if (idx === focusedIndex) {
            wrapper.classList.add('focused');
          } else {
            wrapper.classList.remove('focused');
          }
        });
      };

      const getActiveIndex = () => {
        const firstEmptyIndex = inputs.findIndex(input => input.value === "");
        return firstEmptyIndex === -1 ? inputs.length - 1 : firstEmptyIndex;
      };

      inputs.forEach(input => {
        updateVisualState(input);
        input.addEventListener('blur', () => {
          input.parentElement.classList.remove('focused');
        });
      });

      inputs.forEach((input, index) => {

        // 1. STRICT FOCUS & CLICK HANDLING
        const handleInteraction = (e) => {
          const correctIndex = getActiveIndex();
          if (index !== correctIndex) {
            e.preventDefault();
            inputs[correctIndex].focus();
            handleFocusStyles(correctIndex);
          } else {
            handleFocusStyles(index);
          }
        };

        input.addEventListener("mousedown", handleInteraction);
        input.addEventListener("touchstart", handleInteraction);

        // 2. FOCUS EVENT
        input.addEventListener("focus", () => {
          const correctIndex = getActiveIndex();
          if (index !== correctIndex) {
            inputs[correctIndex].focus();
            handleFocusStyles(correctIndex);
          } else {
            handleFocusStyles(index);
          }
        });

        // 3. TYPING LOGIC
        input.addEventListener("input", (e) => {
          const val = e.target.value;

          if (val.length > 0) {
            updateVisualState(input);
            if (index < inputs.length - 1) {
              inputs[index + 1].focus();
              handleFocusStyles(index + 1);
            }
          } else {
            updateVisualState(input);
          }
        });

        // 4. BACKSPACE LOGIC
        input.addEventListener("keydown", (e) => {
          if (e.key === "Backspace") {
            if (input.value === "") {
              if (index > 0) {
                const prevInput = inputs[index - 1];
                prevInput.value = "";
                updateVisualState(prevInput);
                prevInput.focus();
                handleFocusStyles(index - 1);
              }
            } else {
              input.value = "";
              updateVisualState(input);
            }
          }
        });

        // 5. PASTE LOGIC
        input.addEventListener("paste", (e) => {
          e.preventDefault();
          const pasteData = e.clipboardData.getData("text").replace(/\D/g, '').split('');

          if (pasteData.length > 0) {
            let currentIndex = index;
            pasteData.forEach((char) => {
              if (currentIndex < inputs.length) {
                inputs[currentIndex].value = char;
                updateVisualState(inputs[currentIndex]);
                currentIndex++;
              }
            });
            const nextFocus = Math.min(currentIndex, inputs.length - 1);
            inputs[nextFocus].focus();
            handleFocusStyles(nextFocus);
          }
        });

      });
    });