export type UserRole = 'teacher' | 'student';
export type Stage = 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Master';
export type Group = 'All' | 'A' | 'B' | 'C' | 'D';
export type ViewMode = 'teachers' | 'students';

export interface Contact {
    id: string;
    name: string;
    role: UserRole;
    avatar?: any; // require() path or uri
    department?: string; // For teachers
    stage?: Stage; // For students
    group?: Group; // For students
    isOnline?: boolean;
    lastSeen?: string;
}

export interface Notice {
    id: string;
    content: string;
    targetStage: Stage;
    targetGroup?: Group;
    senderId: string;
    timestamp: string;
}
