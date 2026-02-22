# Backend API Style Guide & Prompts for Home/Rooms

This document outlines the API endpoints, cURL commands, and expected JSON responses mainly for `app/(tabs)/Home.tsx` and `app/(tabs)/Rooms.tsx`.

## 1. Home Screen (`app/(tabs)/Home.tsx`)

### 1.1 Get Current Booking
**Endpoint:** `GET /api/bookings/current`
**Description:** Fetches the single ongoing booking for the current user.

**cURL:**
```bash
curl -X GET "https://api.example.com/api/bookings/current" \
     -H "Authorization: Bearer <token>"
```

**Response (`res`):**
```json
{
  "data": {
    "title": "برمجة العاب",       // Main title (e.g., Course Name)
    "subtitle": "Collisions",      // Subtitle (e.g., Topic)
    "hall": "7",                   // displayed in the Hexagon Badge
    "time": "10:00-8:30",          // displayed in "وقت المحاضرة"
    "locationName": "قاعة 7",      // displayed in "مكان الحجز"
    "image": "https://example.com/assets/course_gaming.png" // Used for both background blur and main icon
  }
}
```

### 1.2 Get Upcoming Bookings
**Endpoint:** `GET /api/bookings/upcoming`
**Description:** Fetches a list of future bookings for the user.

**cURL:**
```bash
curl -X GET "https://api.example.com/api/bookings/upcoming" \
     -H "Authorization: Bearer <token>"
```

**Response (`res`):**
```json
{
  "data": [
    {
      "id": "1",
      "title": "برمجة العاب",      // Card Title
      "subtitle": "Collisions",     // (Optional) Not currently used in UI card but good to have
      "time": "10:00-8:30",         // displayed with "وقت المحاضرة"
      "location": "المختبر الذكي",  // displayed with "مكان الحجز"
      "stage": "مرحلة رابعة",       // displayed as bottom row tag
      "image": "https://example.com/assets/course_gaming.png" // Card image
    },
    {
      "id": "2",
      "title": "مصفوفات",
      "subtitle": "Determinants",
      "time": "10:00-8:30",
      "location": "المختبر الخامس",
      "stage": "مرحلة ثالثة",
      "image": "https://example.com/assets/course_smart.png"
    }
  ]
}
```

---

## 2. Rooms Screen (`app/(tabs)/Rooms.tsx`)

### 2.1 Get Rooms (With Filters)
**Endpoint:** `GET /api/rooms`
**Description:** Fetches a list of rooms with support for filtering by `status`, `stage`, and `group`.

**Filters (Query Params):**
- `status`: `available` | `booked`
- `stage`: e.g., `المرحلة 1`, `المرحلة 2`
- `group`: e.g., `Group A`

**cURL (Filtered by Available):**
```bash
curl -X GET "https://api.example.com/api/rooms?status=available" \
     -H "Authorization: Bearer <token>"
```

**cURL (Filtered by Booked, Stage 1, Group A):**
```bash
curl -X GET "https://api.example.com/api/rooms?status=booked&stage=المرحلة%201&group=Group%20A" \
     -H "Authorization: Bearer <token>"
```

**Response (`res`):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "قاعة 1",
      "type": "Lecture Hall",
      "capacity": 100,
      "status": "booked",
      "image": "https://example.com/assets/lecture_hall.png",
      "booker": {
        "name": "د. سارة أحمد",
        "avatar": "https://example.com/assets/avatar.png",
        "stage": "المرحلة 3",
        "group": "Group A",
        "timeRemaining": "45 دقيقة"
      }
    },
    {
      "id": "2",
      "name": "مختبر 1",
      "type": "Lab",
      "capacity": 25,
      "status": "available",
      "image": "https://example.com/assets/lecture_hall.png",
      "booker": null
    }
  ]
}
```

### 2.2 Book a Room (Action)
**Endpoint:** `POST /api/rooms/:id/book`
**Description:** Books a specific room. Triggered by the "احجز الآن" button.

**cURL:**
```bash
curl -X POST "https://api.example.com/api/rooms/2/book" \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
           "subject": "Introduction to AI",
           "duration_minutes": 60
         }'
```

**Response (`res`):**
```json
{
  "success": true,
  "message": "Room booked successfully",
  "data": {
    "bookingId": "bk_12345",
    "roomId": "2",
    "status": "booked"
  }
}
```

### 2.3 Get Filter Options (Metadata)
**Endpoint:** `GET /api/rooms/filters`
**Description:** Returns available values for dynamic filters (Stages, Groups).

**cURL:**
```bash
curl -X GET "https://api.example.com/api/rooms/filters" \
     -H "Authorization: Bearer <token>"
```

**Response (`res`):**
```json
{
  "stages": ["المرحلة 1", "المرحلة 2", "المرحلة 3", "المرحلة 4"],
  "groups": ["Group A", "Group B"]
}
```
