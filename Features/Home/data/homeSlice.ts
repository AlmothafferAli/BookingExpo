import { apiSlice } from '@/Base/apiSlice';
import { BaseApiUrl } from '@/Base/types/Urls';
import { secureStore } from '@/Base/secureStore';

export interface Booking {
    id: string;
    name: string;
    type: string;
    capacity: number;
    status: string;
    image: string;
    booker: any | null;
    startTime: string;
    endTime: string;
    course: string;
}

export const homeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUpcomingBookings: builder.query<Booking[], void>({
            query: () => '/bookings/upcoming',
            providesTags: ['Booking'],
        }),
        getCurrentBookings: builder.query<Booking[], void>({
            query: () => '/bookings/current',
            providesTags: ['Booking'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const token = await secureStore.getToken();
                    console.log(`\n📦 CURL for Current Booking:\ncurl -X GET "${BaseApiUrl}/bookings/current" -H "Authorization: Bearer ${token}"\n`);
                } catch (error) {
                    console.error('Error generating curl:', error);
                }
            },
        }),
    }),
});

export const { useGetUpcomingBookingsQuery, useGetCurrentBookingsQuery } = homeApi;
