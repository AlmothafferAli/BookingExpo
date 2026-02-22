export interface Student {
    id: string;
    name: string;
    avatar: string;
    info: {
        email?: string;
        phone?: string;
        address?: string;
        enrollmentDate?: string;
    };
    contactId: string; // Link to chat
    overallGrade?: number;
    stage?: string;
    group?: string;
}

export interface Course {
    id: string;
    name: string;
    code?: string;
    description?: string;
}

export interface Exam {
    id: string;
    title: string;
    maxScore: number;
    weight: number;
    courseId: string;
    courseName?: string;
}

export interface Grade {
    id: string;
    studentId: string;
    courseId: string;
    title: string; // e.g. "Midterm Exam"
    score: number;
    maxScore: number;
    date: string;
    feedback?: string;
}

// Backend Responses & Requests
export interface TeacherStudentResponse {
    userName: string;
    userid: string;
    userImage?: string;
    stage?: string;
    group?: string;
}


export interface CreateExamRequest {
    title: string;
    maxScore: number;
    weight: number;
    courseId: string;
}

export interface SubmitScoreRequest {
    examId: string;
    studentId: string;
    score: number;
}


export interface ExamResult {
    id: string;
    examTitle: string;
    studentName: string;
    score: number;
    maxScore: number;
    weightedScore: number;
    weight: number;
}
