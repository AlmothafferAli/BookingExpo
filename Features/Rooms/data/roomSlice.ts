import { apiSlice } from '../../../Base/apiSlice';
import { Room } from './types';

export interface FilterOptions {
    stages: string[];
    groups: string[];
}

export const roomsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query<Room[], { status?: string, stage?: string, group?: string }>({
            query: (params) => ({
                url: '/rooms',
                params,
            }),
            providesTags: ['Room'],
        }),
        getBookedRooms: builder.query<Room[], { date: string, stageName?: string, groupName?: string }>({
            query: (params) => ({
                url: '/rooms/booked',
                params,
            }),
            providesTags: ['Room'],
        }),
        getFilters: builder.query<FilterOptions, void>({
            query: () => '/rooms/filters',
        }),
    }),
});

export const {
    useGetRoomsQuery,
    useGetBookedRoomsQuery,
    useGetFiltersQuery,
} = roomsApiSlice;
