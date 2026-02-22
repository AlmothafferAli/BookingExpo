import { Student, Course, Grade } from '../types';

export const MOCK_STUDENTS: Student[] = [
    {
        id: '1',
        name: 'أحمد حسن',
        avatar: 'https://i.pravatar.cc/150?u=ahmed',
        info: {
            email: 'ahmed.hassan@example.com',
            phone: '+20 123 456 7890',
            address: 'القاهرة، مصر',
            enrollmentDate: '2023-09-01',
        },
        contactId: 'contact_1',
        overallGrade: 88,
    },
    {
        id: '2',
        name: 'سارة علي',
        avatar: 'https://i.pravatar.cc/150?u=sara',
        info: {
            email: 'sara.ali@example.com',
            phone: '+20 100 200 3000',
            address: 'الجيزة، مصر',
            enrollmentDate: '2023-09-01',
        },
        contactId: 'contact_2',
        overallGrade: 92,
    },
    {
        id: '3',
        name: 'محمد إبراهيم',
        avatar: 'https://i.pravatar.cc/150?u=mohamed',
        info: {
            email: 'm.ibrahim@example.com',
            phone: '+20 111 222 3333',
            address: 'الإسكندرية، مصر',
            enrollmentDate: '2023-09-15',
        },
        contactId: 'contact_3',
        overallGrade: 75,
    },
    {
        id: '4',
        name: 'ليلى يوسف',
        avatar: 'https://i.pravatar.cc/150?u=layla',
        info: {
            email: 'layla.y@example.com',
            phone: '+20 155 555 5555',
            address: 'المنصورة، مصر',
            enrollmentDate: '2023-09-10',
        },
        contactId: 'contact_4',
        overallGrade: 85,
    },
    {
        id: '5',
        name: 'عمر خالد',
        avatar: 'https://i.pravatar.cc/150?u=omar',
        info: {
            email: 'omar.k@example.com',
            phone: '+20 122 333 4444',
            address: 'الأقصر، مصر',
            enrollmentDate: '2023-10-01',
        },
        contactId: 'contact_5',
        overallGrade: 65,
    },
];

export const MOCK_COURSES: Course[] = [
    { id: 'c1', name: 'الرياضيات', code: 'MATH101', description: 'مقدمة في التفاضل والتكامل' },
    { id: 'c2', name: 'الفيزياء', code: 'PHYS101', description: 'الميكانيكا والديناميكا الحرارية' },
    { id: 'c3', name: 'علوم الحاسب', code: 'CS101', description: 'مقدمة في البرمجة باستخدام بايثون' },
    { id: 'c4', name: 'الآداب', code: 'ENG101', description: 'الأدب المعاصر' },
];

export const MOCK_GRADES: Grade[] = [
    { id: 'g1', studentId: '1', courseId: 'c1', title: 'اختبار نصفي', score: 45, maxScore: 50, date: '2023-11-10' },
    { id: 'g2', studentId: '1', courseId: 'c1', title: 'اختبار نهائي', score: 90, maxScore: 100, date: '2024-01-15', feedback: 'عمل ممتاز!' },
    { id: 'g3', studentId: '1', courseId: 'c2', title: 'تقرير معمل', score: 18, maxScore: 20, date: '2023-12-05' },

    { id: 'g4', studentId: '2', courseId: 'c1', title: 'اختبار نصفي', score: 48, maxScore: 50, date: '2023-11-10' },
    { id: 'g5', studentId: '2', courseId: 'c3', title: 'مشروع', score: 98, maxScore: 100, date: '2024-01-20', feedback: 'تنفيذ رائع.' },

    { id: 'g6', studentId: '3', courseId: 'c2', title: 'اختبار نصفي', score: 35, maxScore: 50, date: '2023-11-12' },
];
