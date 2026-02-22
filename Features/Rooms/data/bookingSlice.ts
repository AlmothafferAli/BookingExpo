import { apiSlice } from '../../../Base/apiSlice';

export interface Course {
    id: string;
    userName: string;
    courseId: string;
    courseName: string;
    grade: number;
}

export interface CreateBookingRequest {
    roomId: string;
    teacherId: string;
    startTime: string;
    endTime: string;
    subject: string;
    course: string;
    stageName: string;
    groupName: string;
}

export interface CreateBookingResponse {
    id: string;
    // Add other fields if needed
}

export const bookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyCourses: builder.query<Course[], void>({
            query: () => '/enrollment/MyCourses',
        }),
        createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
            query: (booking) => ({
                url: '/bookings',
                method: 'POST',
                body: booking,
            }),
            invalidatesTags: ['Booking', 'Room'],
        }),
    }),
});

export const {
    useGetMyCoursesQuery,
    useCreateBookingMutation,
} = bookingApi;
