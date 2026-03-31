import { apiSlice } from "../../Base/apiSlice";
import { ChatUrl, BaseUrl } from "../../Base/types/Urls";

export interface ChatMessageDto {
    id?: string;
    senderId?: string;
    senderName?: string;
    recipientId?: string;
    courseId?: string;
    content: string;
    timestamp?: string;
}

export interface ContactResponse {
    userid: string;
    userName: string;
    userImage?: string;
    stage?: string;
    group?: string;
}

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateHistory: builder.query<ChatMessageDto[], string>({
            query: (recipientId) => ({
                url: `${ChatUrl}/history/private`,
                params: { recipientId },
            }),
        }),
        getCourseHistory: builder.query<ChatMessageDto[], string>({
            query: (courseId) => ({
                url: `${ChatUrl}/history/course`,
                params: { courseId },
            }),
        }),
        // Extra helpful endpoints
        getConversations: builder.query<any[], void>({
            query: () => `${ChatUrl}/conversations`,
            transformResponse: (response: any) => Array.isArray(response) ? response : (response?.data || []),
        }),
    }),
});

export const { 
    useGetPrivateHistoryQuery, 
    useGetCourseHistoryQuery,
    useGetConversationsQuery,
} = chatApi;
