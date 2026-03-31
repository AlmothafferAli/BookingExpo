import React, { useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Modal, 
    ActivityIndicator,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
import { ContactCard } from '../../Features/Messages/components/ContactCard';
import { StudentCard } from '../../Features/Students/components/StudentCard';
import { TeacherCard } from '../../Features/Students/components/TeacherCard';
import { useGetTeachersQuery } from '../../Features/Students/data/examSlice';
import COLORS from '../../Base/constants';
import { useMessages } from '../../Features/Messages/hooks/useMessages';
import { useRouter } from 'expo-router';
import { socketService } from '../../Base/SocketService';
import { useEffect } from 'react';

export default function MessagesScreen() {
    const router = useRouter();
    const {
        conversations,
        conversationsLoading,
        refetchConversations,
        students,
        studentsLoading,
        isContactModalVisible,
        setIsContactModalVisible,
    } = useMessages();

    useEffect(() => {
        socketService.connect();
        socketService.subscribeToPrivateMessages('MessagesScreen', () => {
            refetchConversations();
        });
        return () => {
            socketService.unsubscribe('MessagesScreen');
        }
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [modalTab, setModalTab] = useState<'students' | 'teachers'>('students');

    const { data: rawTeachers, isLoading: teachersLoading } = useGetTeachersQuery(
        modalTab === 'teachers' && searchQuery ? { termSearch: searchQuery } : {}
    );

    const filteredStudents = students.filter((s: any) => 
        s.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatPress = (id: string) => {
        setIsContactModalVisible(false);
        router.push(`/chat/${id}`);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>الرسائل</Text>
                </View>

                {/* Main Screen Tabs (Optional but requested "chatcontent page has two tabs") */}
                <View style={[styles.tabContainer, { marginVertical: 10 }]}>
                    <TouchableOpacity 
                        style={[styles.miniTab, modalTab === 'teachers' && styles.activeMiniTab]} 
                        onPress={() => setModalTab('teachers')}
                    >
                        <Text style={[styles.miniTabText, modalTab === 'teachers' && styles.activeMiniTabText]}>المعلمون</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.miniTab, modalTab === 'students' && styles.activeMiniTab]} 
                        onPress={() => setModalTab('students')}
                    >
                        <Text style={[styles.miniTabText, modalTab === 'students' && styles.activeMiniTabText]}>الطلاب</Text>
                    </TouchableOpacity>
                </View>

                {conversationsLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={item => item.id || item.userid || Math.random().toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item, index }) => {
                            const contactId = item.id || item.userid || item.senderId;
                            return (
                                <Animated.View entering={FadeInDown.delay(index * 100)}>
                                    <ContactCard 
                                        contact={{
                                            id: contactId,
                                            name: item.userName || item.senderName || 'Student',
                                            role: 'student',
                                            avatar: item.userImage ? { uri: item.userImage } : null,
                                            isOnline: false,
                                            stage: item.stage || '',
                                            group: item.group || '',
                                        }} 
                                        onPress={() => handleChatPress(contactId)}
                                    />
                                </Animated.View>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="message-off-outline" size={64} color="#CBD5E1" />
                                <Text style={styles.emptyText}>لا توجد محادثات نشطة</Text>
                            </View>
                        }
                        refreshing={conversationsLoading}
                        onRefresh={refetchConversations}
                    />
                )}
            </SafeAreaView>

            {/* Floating Action Button */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => setIsContactModalVisible(true)}
            >
                <MaterialCommunityIcons name="message-plus" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Contacts Modal */}
            <Modal
                visible={isContactModalVisible}
                animationType="slide"
                onRequestClose={() => setIsContactModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsContactModalVisible(false)}>
                            <MaterialCommunityIcons name="close" size={28} color={COLORS.PrimarySlate} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>بدء محادثة جديدة</Text>
                    </View>

                    {/* Modal Tabs */}
                    <View style={styles.modalTabContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, modalTab === 'teachers' && styles.activeTab]} 
                            onPress={() => setModalTab('teachers')}
                        >
                            <Text style={[styles.tabText, modalTab === 'teachers' && styles.activeTabText]}>المعلمون</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, modalTab === 'students' && styles.activeTab]} 
                            onPress={() => setModalTab('students')}
                        >
                            <Text style={[styles.tabText, modalTab === 'students' && styles.activeTabText]}>الطلاب</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchBarContainer}>
                        <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchBar}
                            placeholder={modalTab === 'students' ? "بحث عن طالب..." : "بحث عن معلم..."}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {studentsLoading || (modalTab === 'teachers' && teachersLoading) ? (
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : (
                        <FlatList
                            data={(modalTab === 'students' ? filteredStudents : rawTeachers) as any[]}
                            keyExtractor={(item: any) => modalTab === 'students' ? item.userid : item.id}
                            contentContainerStyle={styles.modalListContent}
                            renderItem={({ item }) => (
                                modalTab === 'students' ? (
                                    <StudentCard 
                                        student={item as any} 
                                        onPress={() => handleChatPress((item as any).userid)} 
                                    />
                                ) : (
                                    <TeacherCard 
                                        teacher={item as any}
                                    />
                                )
                            )}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        marginTop: 100, // Clear global absolute header
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 22,
        color: COLORS.PrimarySlate,
        textAlign: 'right',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 100,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 120,
        left: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.PrimarySlate,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.PrimarySlate,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 18,
        color: COLORS.PrimarySlate,
    },
    searchBarContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    searchBar: {
        flex: 1,
        fontFamily: 'Alexandria-Regular',
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'right',
    },
    modalListContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    tabContainer: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 16,
        gap: 8,
    },
    modalTabContainer: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 20,
        marginVertical: 10,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeTab: {
        backgroundColor: COLORS.PrimarySlate,
        borderColor: COLORS.PrimarySlate,
    },
    tabText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    activeTabText: {
        color: '#FFF',
    },
    miniTab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
    },
    activeMiniTab: {
        backgroundColor: COLORS.PrimarySlate,
    },
    miniTabText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 12,
        color: '#64748B',
    },
    activeMiniTabText: {
        color: '#FFF',
    },
});
