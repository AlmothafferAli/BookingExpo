import { useState, useMemo } from 'react';
import { useGetMyStudentsQuery } from '../../Students/data/examSlice';
import { useGetConversationsQuery } from '../../Chat/chatApi';

export const useMessages = () => {
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);

    // Main list: Conversations (Recent Chats)
    const { data: conversationsData, isLoading: conversationsLoading, refetch: refetchConversations } = useGetConversationsQuery();
    
    // FAB list: All Students
    const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents } = useGetMyStudentsQuery({});

    const conversations = useMemo(() => conversationsData || [], [conversationsData]);
    const students = useMemo(() => studentsData || [], [studentsData]);

    return {
        conversations,
        conversationsLoading,
        refetchConversations,
        students,
        studentsLoading,
        refetchStudents,
        isContactModalVisible,
        setIsContactModalVisible,
    };
};
