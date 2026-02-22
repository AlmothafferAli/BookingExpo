import { Message } from './types';

export const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        senderId: 't1',
        text: 'السلام عليكم، هل لديك أي استفسار بخصوص المحاضرة القادمة؟',
        timestamp: '10:00 AM',
        status: 'read',
    },
    {
        id: '2',
        senderId: 'me',
        text: 'وعليكم السلام دكتور. نعم، بخصوص الجزء الخاص بالذكاء الاصطناعي.',
        timestamp: '10:05 AM',
        status: 'read',
    },
    {
        id: '3',
        senderId: 't1',
        text: 'لقد أرسلت بعض الملفات التوضيحية، يمكنك مراجعتها.',
        timestamp: '10:10 AM',
        status: 'read',
    },
    {
        id: '4',
        senderId: 't1',
        fileName: 'Lecture_Slides.pdf',
        fileUrl: '#',
        timestamp: '10:11 AM',
        status: 'read',
    }
];
