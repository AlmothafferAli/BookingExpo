import { apiSlice } from '../../../Base/apiSlice';
import { TeacherStudentResponse, CreateExamRequest, SubmitScoreRequest, Exam, Grade, ExamResult, TeacherResponse } from '../types';
import { BaseUrl } from '../../../Base/types/Urls';

export const examApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyStudents: builder.query<TeacherStudentResponse[], { termSearch?: string, stageId?: string, groupId?: string, courseId?: string }>({
            query: (params) => ({
                url: '/enrollment/my-students',
                params,
            }),
            transformResponse: (response: any) => {
                const studentsArray = Array.isArray(response) ? response : (response?.data || []);
                return studentsArray.map((student: TeacherStudentResponse) => {
                    let finalImage = student.userImage;

                    if (finalImage && typeof finalImage === 'string' && finalImage.length > 5 && finalImage !== 'string' && finalImage !== 'stringwqdqw') {
                        // Replace localhost with actual IP if found in URL
                        if (finalImage.includes('localhost')) {
                            const host = BaseUrl.replace('http://', '').replace('https://', '').split(':')[0];
                            finalImage = finalImage.replace('localhost', host);
                        }

                        // Prepend BaseUrl if it's a relative path (e.g. "photo.jpg")
                        if (!finalImage.startsWith('http')) {
                            const cleanPath = finalImage.startsWith('/') ? finalImage : `/${finalImage}`;
                            finalImage = `${BaseUrl}/uploads${cleanPath}`;
                        }
                    } else {
                        // Fallback to UI Avatars
                        finalImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.userName)}&background=random&size=128`;
                    }

                    return {
                        ...student,
                        userImage: finalImage
                    };
                });
            },
        }),
        createExam: builder.mutation<Exam, CreateExamRequest>({
            query: (examData) => ({
                url: '/exams',
                method: 'POST',
                body: examData,
            }),
            transformResponse: (response: { success: boolean, data: Exam }) => response.data,
        }),
        getTeacherExams: builder.query<Exam[], { termSearch?: string, courseId?: string } | void>({
            query: (params) => ({
                url: '/exams',
                params: params || {},
            }),
            transformResponse: (response: Exam[]) => response,
        }),
        submitScore: builder.mutation<{ success: boolean; message: string; data: any }, SubmitScoreRequest>({
            query: (scoreData) => ({
                url: '/exams/score',
                method: 'POST',
                body: scoreData,
            }),
        }),
        getMyGrade: builder.query<number, string>({
            query: (courseId) => `/exams/my-grade/${courseId}`,
            transformResponse: (response: { success: boolean, data: number }) => response.data,
        }),
        getStudentResults: builder.query<ExamResult[], { courseId: string; studentId: string }>({
            query: ({ courseId, studentId }) => `/exams/results/${courseId}/${studentId}`,
            transformResponse: (response: ExamResult[]) => response,
        }),
        getTeachers: builder.query<TeacherResponse[], { termSearch?: string } | void>({
            query: (params) => ({
                url: '/users/teachers',
                params: params || {},
            }),
            transformResponse: (response: any) => {
                const teachersArray = Array.isArray(response) ? response : (response?.data || []);
                return teachersArray.map((teacher: TeacherResponse) => {
                    let finalImage = teacher.image;
                    if (finalImage && typeof finalImage === 'string' && !finalImage.startsWith('http')) {
                        finalImage = `${BaseUrl}/uploads/${finalImage}`;
                    } else if (!finalImage) {
                        finalImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.username)}&background=random&size=128`;
                    }
                    return { ...teacher, image: finalImage };
                });
            },
        }),
    }),
});

export const {
    useGetMyStudentsQuery,
    useCreateExamMutation,
    useGetTeacherExamsQuery,
    useSubmitScoreMutation,
    useGetMyGradeQuery,
    useGetStudentResultsQuery,
    useGetTeachersQuery,
} = examApiSlice;
