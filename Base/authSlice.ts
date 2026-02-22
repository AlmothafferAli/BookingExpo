import { apiSlice } from "./apiSlice";
import { secureStore } from "./secureStore";
import { Alert } from 'react-native';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        login: builder.mutation({
            query: (credentials: any) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg: any, { dispatch, queryFulfilled }: any) {
                const { data } = await queryFulfilled;
                console.log('Login successful. Data received:', JSON.stringify(data, null, 2));
                if (data.token) {
                    await secureStore.setToken(data.token);
                    console.log('Token saved to SecureStore');
                } else {
                    console.error('No token in login response!');
                }
                if (data.user) {
                    await secureStore.setUser(data.user);
                }
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;
