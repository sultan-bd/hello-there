document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.getElementById('popupTriggerBtn');
    const popupOverlay = document.getElementById('customPopup');
    const closeIcon = document.getElementById('popupCloseIcon');

    // এলিমেন্ট না থাকলে রিটার্ন করবে (এরর প্রিভেনশন)
    if (!triggerBtn || !popupOverlay || !closeIcon) return;

    // ১. পপআপ খোলা
    triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // স্ক্রল বন্ধ
    });

    // ২. পপআপ বন্ধ করার ফাংশন
    const closePopup = () => {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = ''; // স্ক্রল চালু
    };

    // ৩. শুধুমাত্র ক্রস (X) বাটনে ক্লিক করলে বন্ধ হবে
    closeIcon.addEventListener('click', (e) => {
        e.preventDefault(); // বাটনের ডিফল্ট আচরণ বন্ধ করা
        closePopup();
    });

    // বি.দ্র: ওভারলেতে ক্লিক করলে বন্ধ হবে না (আপনার রিকোয়ারমেন্ট অনুযায়ী)
    
    // ৪. ESC বাটন চাপলে বন্ধ হবে (কম্পিউটার ইউজারদের সুবিধার্থে রাখা ভালো)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });
});