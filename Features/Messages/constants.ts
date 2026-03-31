import { Stage, Group } from './types';

// Mock data removed as per user request to use real endpoints
export const TEACHERS: any[] = [];
export const STUDENTS_MOCK: any[] = [];

export const ALL_STAGES: Stage[] = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Master'];
export const ALL_GROUPS: Group[] = ['All', 'A', 'B', 'C', 'D'];

export const STAGE_LABELS: Record<Stage, string> = {
    'Stage 1': 'الفرقة الأولى',
    'Stage 2': 'الفرقة الثانية',
    'Stage 3': 'الفرقة الثالثة',
    'Stage 4': 'الفرقة الرابعة',
    'Master': 'دراسات عليا',
};
