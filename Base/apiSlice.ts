import { BaseApiUrl } from '@/Base/types/Urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { secureStore } from './secureStore';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BaseApiUrl,
        prepareHeaders: async (headers: Headers, { endpoint }) => {
            // Never send token on login or registration
            if (endpoint === 'login') {
                headers.delete('authorization');
                console.log('[API] 🔐 Public endpoint detected:', endpoint, '- Skipping Authorization header');
                return headers;
            }

            const token = await secureStore.getToken();

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
                // console.log(`[API] 🔑 Token added to ${endpoint}`);
            } else {
                console.warn(`[API] ⚠️ No token found for ${endpoint}. Request might fail if it requires auth.`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Booking', 'Room'], // Updated tag types for this app
    endpoints: () => ({}),
});
