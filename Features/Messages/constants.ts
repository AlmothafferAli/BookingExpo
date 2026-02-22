import { Contact, Stage, Group } from './types';

export const TEACHERS: Contact[] = [
    { id: 't1', name: 'د. محمد أحمد', role: 'teacher', department: 'علوم الحاسب', isOnline: true, avatar: require('@/assets/avatar.png') },
    { id: 't2', name: 'أ. سارة علي', role: 'teacher', department: 'نظم المعلومات', isOnline: false, lastSeen: 'منذ ١٠ دقائق', avatar: require('@/assets/avatar.png') },
    { id: 't3', name: 'د. خالد عمر', role: 'teacher', department: 'الشبكات', isOnline: true, avatar: require('@/assets/avatar.png') },
    { id: 't4', name: 'أ. ليلى حسن', role: 'teacher', department: 'الذكاء الاصطناعي', isOnline: false, lastSeen: 'منذ ساعة', avatar: require('@/assets/avatar.png') },
];

export const STUDENTS_MOCK: Contact[] = [
    { id: 's1', name: 'أحمد محمود', role: 'student', stage: 'Stage 1', group: 'A', isOnline: true, avatar: require('@/assets/avatar.png') },
    { id: 's2', name: 'فاطمة الزهراء', role: 'student', stage: 'Stage 1', group: 'B', isOnline: false, lastSeen: 'منذ ٥ دقائق', avatar: require('@/assets/avatar.png') },
    { id: 's3', name: 'عمر ياسر', role: 'student', stage: 'Stage 2', group: 'A', isOnline: true, avatar: require('@/assets/avatar.png') },
    { id: 's4', name: 'نور الدين', role: 'student', stage: 'Stage 3', group: 'C', isOnline: true, avatar: require('@/assets/avatar.png') },
    { id: 's5', name: 'مريم عادل', role: 'student', stage: 'Stage 4', group: 'A', isOnline: false, lastSeen: 'أمس', avatar: require('@/assets/avatar.png') },
    { id: 's6', name: 'كريم وائل', role: 'student', stage: 'Master', group: 'All', isOnline: true, avatar: require('@/assets/avatar.png') },
];

export const ALL_STAGES: Stage[] = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Master'];
export const ALL_GROUPS: Group[] = ['All', 'A', 'B', 'C', 'D'];

export const STAGE_LABELS: Record<Stage, string> = {
    'Stage 1': 'الفرقة الأولى',
    'Stage 2': 'الفرقة الثانية',
    'Stage 3': 'الفرقة الثالثة',
    'Stage 4': 'الفرقة الرابعة',
    'Master': 'دراسات عليا',
};
