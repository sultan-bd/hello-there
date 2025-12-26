 // --- Constants ---
        const COOLDOWN_SEC = 180; // ৩ মিনিট টাইমার
        const STORAGE_KEY = 'rakan_check_email_end';

        // --- DOM Elements ---
        const resendBtn = document.getElementById('resendBtn');
        const timerContainer = document.getElementById('timerContainer');
        const timerDisplay = document.getElementById('timer');
        const messageDiv = document.getElementById('resendMessage');
        const displayEmailEl = document.getElementById('displayEmail');
        const emailStatusEl = document.getElementById('emailStatus');
        const goHomeLink = document.getElementById('goHomeLink');

        // --- Helper Functions ---
        function toArabicNumerals(num) {
            return num.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
        }

        function formatTime(totalSeconds) {
            const m = Math.floor(totalSeconds / 60);
            const s = totalSeconds % 60;
            const mStr = m < 10 ? '0' + m : m;
            const sStr = s < 10 ? '0' + s : s;
            return toArabicNumerals(`${mStr}:${sStr}`);
        }

        function maskEmail(email) {
            if (!email) return '';
            const [name, domain] = email.split('@');
            if (!name || !domain) return email;
            const visible = name.substring(0, 2);
            const masked = '*'.repeat(Math.max(name.length - 2, 3));
            return `${visible}${masked}@${domain}`;
        }

        function showEmailStatus(type, message) {
            emailStatusEl.className = `email-status ${type}`;
            emailStatusEl.innerHTML = `
                <i class="fa-solid ${type === 'sending' ? 'fa-spinner fa-spin' : type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            emailStatusEl.style.display = 'flex';
        }

        function hideEmailStatus() {
            emailStatusEl.style.display = 'none';
        }

        // --- Firebase Wait Function ---
        async function waitForFirebase(maxAttempts = 100) {
            if (window.firebaseAuth && window.sendPasswordResetEmail) {
                return true;
            }
            return new Promise((resolve) => {
                let attempts = 0;
                const handleReady = () => {
                    window.removeEventListener('firebaseReady', handleReady);
                    resolve(true);
                };
                window.addEventListener('firebaseReady', handleReady);

                const checkInterval = setInterval(() => {
                    attempts++;
                    if (window.firebaseAuth && window.sendPasswordResetEmail) {
                        clearInterval(checkInterval);
                        window.removeEventListener('firebaseReady', handleReady);
                        resolve(true);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        window.removeEventListener('firebaseReady', handleReady);
                        resolve(false);
                    }
                }, 100);
            });
        }

        // --- Send Password Reset Email ---
        // ADDED showSuccessUI parameter to control double messages
        async function sendResetEmail(email, showSuccessUI = true) {
            try {
                showEmailStatus('sending', 'جاري إرسال البريد الإلكتروني...');

                const isReady = await waitForFirebase();
                if (!isReady) {
                    showEmailStatus('error', 'خطأ في تحميل النظام. يرجى تحديث الصفحة.');
                    return false;
                }

                await window.sendPasswordResetEmail(window.firebaseAuth, email);

                // Logic to prevent double success messages
                if (showSuccessUI) {
                    showEmailStatus('success', 'تم إرسال الرابط بنجاح! تحقق من بريدك.');
                    setTimeout(() => {
                        hideEmailStatus();
                    }, 3000);
                } else {
                    // If we are showing custom UI elsewhere (Resend button), hide the status box immediately
                    hideEmailStatus();
                }

                return true;
            } catch (error) {
                console.error('Error sending password reset email:', error);

                let errorMsg = 'حدث خطأ أثناء إرسال البريد. حاول مرة أخرى.';

                if (error.code === 'auth/too-many-requests') {
                    errorMsg = 'طلبات كثيرة جداً. يرجى الانتظار قليلاً.';
                } else if (error.code === 'auth/user-not-found') {
                    errorMsg = 'البريد الإلكتروني غير موجود.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMsg = 'البريد الإلكتروني غير صالح.';
                }

                showEmailStatus('error', errorMsg);
                return false;
            }
        }

        // --- Timer Functions ---
        let timerInterval = null;

        function startCountdown(seconds) {
            clearInterval(timerInterval);

            resendBtn.style.display = "none";
            timerContainer.style.display = "flex";

            let timeLeft = seconds;
            timerDisplay.textContent = formatTime(timeLeft);

            timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    resetUI();
                }
            }, 1000);
        }

        function resetUI() {
            resendBtn.disabled = false;
            resendBtn.style.display = "flex";
            resendBtn.innerHTML = '<span class="btn-text">إعادة الإرسال</span><span class="btn-icon"><i class="fa-solid fa-arrow-rotate-left"></i></span>';

            timerContainer.style.display = "none";
            messageDiv.style.display = "none";
            messageDiv.classList.remove('fade-out');
            localStorage.removeItem(STORAGE_KEY);
        }

        // --- Resend Handler ---
        async function handleResend() {
            const email = sessionStorage.getItem('resetEmail');
            if (!email) {
                showEmailStatus('error', 'خطأ: البريد الإلكتروني غير موجود.');
                return;
            }

            messageDiv.style.display = "none";
            messageDiv.classList.remove('fade-out');

            resendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
            resendBtn.disabled = true;

            // Pass 'false' so we don't show the generic success box, only the custom text below
            const success = await sendResetEmail(email, false);

            if (success) {
                const now = Math.floor(Date.now() / 1000);
                localStorage.setItem(STORAGE_KEY, now + COOLDOWN_SEC);

                // Show ONLY the custom success message
                messageDiv.style.display = "block";

                startCountdown(COOLDOWN_SEC);

                setTimeout(() => {
                    messageDiv.classList.add('fade-out');
                    setTimeout(() => {
                        messageDiv.style.display = "none";
                        messageDiv.classList.remove('fade-out');
                    }, 500);
                }, 3000);
            } else {
                resendBtn.disabled = false;
                resendBtn.innerHTML = '<span class="btn-text">إعادة الإرسال</span><span class="btn-icon"><i class="fa-solid fa-arrow-rotate-left"></i></span>';
            }
        }

        // Go to Home Link handler
        function handleGoHome(e) {
            e.preventDefault();
            cleanupAndRedirect();
        }

        // Clean up session and redirect to login
        function cleanupAndRedirect() {
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('otpVerified');
            sessionStorage.removeItem('verifyMode');
            sessionStorage.removeItem('otpExpiry');
            localStorage.removeItem(STORAGE_KEY);
            window.location.replace('/login.html');
        }

        // Handle back button - redirect to login instead of OTP
        function handleBackNavigation() {
            history.replaceState(null, '', window.location.href);
            window.addEventListener('popstate', function (e) {
                cleanupAndRedirect();
            });
            history.pushState(null, '', window.location.href);
        }

        // --- Main Initialization (UPDATED LOGIC) ---
        async function initPage() {
            const resetEmail = sessionStorage.getItem('resetEmail');
            const otpVerified = sessionStorage.getItem('otpVerified');

            if (!resetEmail || !otpVerified) {
                window.location.replace('login.html');
                return;
            }

            handleBackNavigation();
            displayEmailEl.textContent = maskEmail(resetEmail);
            goHomeLink.addEventListener('click', handleGoHome);
            resendBtn.addEventListener('click', handleResend);

            const savedEnd = localStorage.getItem(STORAGE_KEY);
            const now = Math.floor(Date.now() / 1000);

            // লজিক ফিক্স: savedEnd না থাকলে নতুন ভিজিট। কিন্তু savedEnd থাকলে এবং সময় শেষ হয়ে গেলে নতুন ভিজিট নয়।
            if (!savedEnd) {
                // ১. একদম নতুন: আগের কোনো রেকর্ড নেই
                console.log('Fresh visit, sending initial email...');
                const success = await sendResetEmail(resetEmail, true);
                if (success) {
                    localStorage.setItem(STORAGE_KEY, now + COOLDOWN_SEC);
                    startCountdown(COOLDOWN_SEC);
                } else {
                    resendBtn.disabled = false;
                }
            } else {
                // ২. রেকর্ড আছে (হয়তো রিফ্রেশ করা হয়েছে)
                if (parseInt(savedEnd, 10) <= now) {
                    // সময় শেষ হয়ে গেছে: অটো সেন্ড হবে না, Resend বাটন দেখাবে
                    console.log('Timer expired on refresh. Waiting for user action.');
                    localStorage.removeItem(STORAGE_KEY); // ক্লিনআপ
                    resendBtn.disabled = false; // বাটন এনাবল
                } else {
                    // সময় বাকি আছে: টাইমার চলবে
                    const remaining = parseInt(savedEnd, 10) - now;
                    console.log('Timer continuing:', remaining);
                    startCountdown(remaining);
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }