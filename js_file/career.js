document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.career-hero');
    const bubbleColors = [
        'rgba(232, 217, 197, 0.3)', // كريمي
        'rgba(142, 108, 136, 0.2)', // بنفسجي
        'rgba(212, 163, 115, 0.25)', // ترابي
        'rgba(255, 255, 255, 0.4)'  // أبيض لامع
    ];

    // إنشاء 15 فقاعة بإعدادات عشوائية
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('soap-bubble');

        // أحجام عشوائية (صغير، متوسط، كبير)
        const sizeType = Math.floor(Math.random() * 3);
        const sizeClass = ['bubble-small', 'bubble-medium', 'bubble-large'][sizeType];
        bubble.classList.add(sizeClass);

        // مواقع عشوائية
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // إعدادات الحركة الفريدة لكل فقاعة
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;
        const movementRange = 50 + Math.random() * 100;

        bubble.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            background: ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]};
            animation-duration: ${duration}s;
            animation-delay: ${-delay}s;
            --movement: ${movementRange}px;
        `;

        // تأثير خاص عند النقر
        bubble.addEventListener('click', function() {
            this.style.animation = 'popBubble 0.5s forwards';
            setTimeout(() => {
                this.remove();
                createNewBubble(); // استبدال الفقاعة التي انفجرت بأخرى جديدة
            }, 500);
        });

        heroSection.appendChild(bubble);
    }

    // إنشاء فقاعة جديدة
    function createNewBubble() {
        const newBubble = document.createElement('div');
        // ... (نفس كود الإنشاء السابق)
        heroSection.appendChild(newBubble);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.career-hero');
    const bubbleColors = [
        'rgba(212, 201, 184, 0.25)', // بيج
        'rgba(180, 151, 109, 0.2)',  // بني فاتح
        'rgba(139, 106, 71, 0.15)',  // بني متوسط
        'rgba(92, 58, 33, 0.1)'      // بني داكن
    ];

    // إنشاء فقاعات بتدرجات البني والبيج
    for (let i = 0; i < 12; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('soap-bubble');

        // إضافة تأثيرات عشوائية
        const size = 30 + Math.random() * 70;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;

        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            background: ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]};
            animation-duration: ${duration}s;
            animation-delay: ${-delay}s;
            border: 1px solid rgba(92, 58, 33, 0.1);
        `;

        heroSection.appendChild(bubble);
    }
});