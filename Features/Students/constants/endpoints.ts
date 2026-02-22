import { BaseApiUrl } from '../../../Base/types/Urls';

export const STUDENTS_ENDPOINTS = {
    GET_STUDENTS: `${BaseApiUrl}/students`,
    GET_STUDENT_DETAILS: (id: string) => `${BaseApiUrl}/students/${id}`,
    GET_STUDENT_GRADES: (id: string) => `${BaseApiUrl}/students/${id}/grades`,
    ASSIGN_GRADE: `${BaseApiUrl}/grades`,
    UPDATE_GRADE: (id: string) => `${BaseApiUrl}/grades/${id}`,
};

// Documentation: Expected Backend Logic (cURLs)

/*
1. Get All Students
curl -X GET "${BaseApiUrl}/students" \
     -H "Authorization: Bearer <token>"

2. Get Student Details
curl -X GET "${BaseApiUrl}/students/123" \
     -H "Authorization: Bearer <token>"

3. Get Student Grades
curl -X GET "${BaseApiUrl}/students/123/grades" \
     -H "Authorization: Bearer <token>"

4. Assign Grade
curl -X POST "${BaseApiUrl}/grades" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{
           "student_id": "123",
           "course_id": "456",
           "exam_title": "Final Project",
           "obtained_score": 85,
           "total_score": 100,
           "graded_at": "2023-10-27T10:00:00Z",
           "comments": "Great work on the UI!"
         }'

5. Update Grade
curl -X PUT "${BaseApiUrl}/grades/789" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{
           "obtained_score": 90,
           "comments": "Updated after re-evaluation"
         }'
*/
