# Exam System Documentation

This document explains the Exam System within the **BookingSpring** project. The system allows teachers to create exams for specific courses, assign weights to them, and record scores for students. Students can then view their final grades calculated based on these weights.

## Core Concepts

1.  **Exam**: Associated with a `Course`. It has a title, a maximum score, and a weight (percentage).
2.  **Weight**: The contribution of an exam to the final grade. The total weight of all exams in a course should not exceed 100%.
3.  **Exam Result**: The score obtained by a student in a specific exam.
4.  **Final Grade**: Calculated as:
    `Sum( (Student Score / Max Score) * Exam Weight )`

---

## Roles & Permissions

-   **TEACHER**: Can create exams and submit scores for students in their assigned courses.
-   **STUDENT**: Can view their results and final grades for courses they are enrolled in.

---

## API Endpoints

### 0. Get My Students (Helper for Teachers)
**Description:** Returns a list of students enrolled in the teacher's courses. Useful for finding `studentId`s to record scores.
- **Method:** `GET`
- **URL:** `/api/enrollment/my-students`
- **Auth required:** `hasRole('TEACHER')`
- **Optional Params:** `stageId` (UUID), `groupId` (UUID)

#### CURL Request:
```bash
curl -X GET "http://localhost:8080/api/enrollment/my-students?stageId=uuid&groupId=uuid" \
-H "Authorization: Bearer <TEACHER_TOKEN>"
```

#### Success Response (200 OK):
```json
{
    "success": true,
    "data": [
        {
            "userName": "Ali Ahmed",
            "userid": "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
            "userImage": "http://example.com/image.jpg",
            "stage": "Third Stage",
            "group": "Group A"
        }
    ]
}
```

---

### 1. Create a New Exam
**Description:** Allows a teacher to create an exam for a specific course.
- **Method:** `POST`
- **URL:** `/api/exams`
- **Auth required:** `hasRole('TEACHER')`

#### CURL Request:
```bash
curl -X POST http://localhost:8080/api/exams \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TEACHER_TOKEN>" \
-d '{
    "title": "Midterm Exam",
    "maxScore": 50.0,
    "weight": 20.0,
    "courseId": "550e8400-e29b-41d4-a716-446655440000"
}'
```

#### Success Response (200 OK):
```json
{
    "success": true,
    "data": {
        "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "title": "Midterm Exam",
        "maxScore": 50.0,
        "weight": 20.0,
        "courseName": "Mathematics"
    }
}
```

---

### 2. Submit Student Score
**Description:** Records or updates a student's score for a specific exam.
- **Method:** `POST`
- **URL:** `/api/exams/score`
- **Auth required:** `hasRole('TEACHER')`

#### CURL Request:
```bash
curl -X POST http://localhost:8080/api/exams/score \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TEACHER_TOKEN>" \
-d '{
    "examId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "studentId": "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
    "score": 42.5
}'
```

#### Success Response (200 OK):
```json
{
    "success": true,
    "message": "Score submitted successfully",
    "data": "Score submitted successfully"
}
```

---

### 3. Get My Final Grade (For Students)
**Description:** Allows a student to see their calculated final grade for a course.
- **Method:** `GET`
- **URL:** `/api/exams/my-grade/{courseId}`
- **Auth required:** Logged-in Student

#### CURL Request:
```bash
curl -X GET http://localhost:8080/api/exams/my-grade/550e8400-e29b-41d4-a716-446655440000 \
-H "Authorization: Bearer <STUDENT_TOKEN>"
```

#### Success Response (200 OK):
```json
{
    "success": true,
    "data": 85.0
}
```

---

### 4. Get Student's Final Grade (General/Admin/Teacher)
**Description:** Fetches the final grade of a specific student in a course.
- **Method:** `GET`
- **URL:** `/api/exams/grade/{courseId}/{studentId}`

#### CURL Request:
```bash
curl -X GET http://localhost:8080/api/exams/grade/550e8400-e29b-41d4-a716-446655440000/z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4 \
-H "Authorization: Bearer <TOKEN>"
```

#### Success Response (200 OK):
```json
{
    "success": true,
    "data": 85.0
}
```
