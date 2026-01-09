// Onboarding content data
export const BOARDING_DATA = {
    1: {
        Title: "نحو بيئة أكاديمية رقمية متكاملة",
        Description: "نسعى لتعزيز الكفاءة الإدارية من خلال أتمتة حجز القاعات وتنظيم الجداول الدراسية والامتحانات، لتوفير وقت وجهد الهيئة التدريسية والطلبة"
    },
    2: {
        Title: "إدارة ذكية للموارد والقاعات الدراسية",
        Description: "تابع توفر القاعات بشكل لحظي (Real-time) ونظم حجوزاتك بدقة عالية، مما يضمن انسيابية عالية في سير العملية التعليمية"
    },
    3: {
        Title: "قنوات تواصل رسمية ومباشرة",
        Description: "جسر تواصل يربط التدريسي بالطلبة والزملاء؛ لإرسال التبليغات العاجلة، تبادل المرفقات، وتنسيق المواعيد بمرونة تامة"
    },
    4: {
        Title: "متابعة وتقارير أداء فورية",
        Description: "نظام متطور لمتابعة الحضور الفعلي والأداء الأكاديمي، يتيح لك حفظ بيانات المحاضرات والنتائج لتسهيل المتابعة والتقييم"
    },
    5: {
        Title: 'جاهز للمحاضرة؟ سجّل دخولك الآن.'
        ,
        Description: ''
    }
};

// Static image mapping - required for React Native's require()
export const BOARDING_IMAGES: Record<number, any> = {
    1: require('../../assets/phone.png'),
    2: require('../../assets/phone.png'),
    3: require('../../assets/phone.png'),
    4: require('../../assets/phone.png'),
    5: require('../../assets/LoginPhone.png')
};

// Animation timing constants
export const ANIMATION_CONFIG = {
    EXIT: {
        TEXT_DURATION: 350,      // Increased from 200ms
        IMAGE_DURATION: 500,     // Increased from 300ms
        INDICATOR_DURATION: 250, // Increased from 150ms
    },
    ENTER: {
        DELAY: 250,              // Increased from 150ms
        TEXT_DURATION: 650,      // Increased from 400ms
        IMAGE_DURATION: 800,     // Increased from 500ms
        INDICATOR_DURATION: 500, // Increased from 300ms
    },
    VALUES: {
        TEXT_SLIDE_DISTANCE: -20,
        IMAGE_SLIDE_DISTANCE: 1500,
        INDICATOR_SCALE: 0.8,
    },
    EASING: {
        TEXT_BOUNCE: 1.1,
        IMAGE_BOUNCE: 1.3,
        INDICATOR_BOUNCE: 1.5,
    }
};
