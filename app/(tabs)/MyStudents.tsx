import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Alert, StatusBar, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StudentCard } from '../../Features/Students/components/StudentCard';
import { TeacherCard } from '../../Features/Students/components/TeacherCard';
import { StudentDetailModal } from '../../Features/Students/components/StudentDetailModal';
import { GradeFormModal } from '../../Features/Students/components/GradeFormModal';
import { Student, Grade, TeacherStudentResponse, TeacherResponse } from '../../Features/Students/types';
import { AppText } from '../../components/AppText';
import { useGetMyStudentsQuery, useCreateExamMutation, useSubmitScoreMutation, useGetTeachersQuery } from '../../Features/Students/data/examSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../Base/constants';

export default function MyStudents() {
    const router = useRouter();
    // For now we pass empty params, but you can wire up search inputs to these

    const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
    const { data: rawStudents, isLoading: isStudentsLoading, isError: isStudentsError, error: studentsError, refetch: refetchStudents } = useGetMyStudentsQuery({});
    const { data: rawTeachers, isLoading: isTeachersLoading, isError: isTeachersError, error: teachersError, refetch: refetchTeachers } = useGetTeachersQuery({});
    
    const [submitScore] = useSubmitScoreMutation();

    const [selectedStudent, setSelectedStudent] = useState<TeacherStudentResponse | null>(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isGradeFormVisible, setIsGradeFormVisible] = useState(false);

    const students = useMemo(() => rawStudents || [], [rawStudents]);
    const teachers = useMemo(() => rawTeachers || [], [rawTeachers]);

    const isLoading = activeTab === 'students' ? isStudentsLoading : isTeachersLoading;
    const isError = activeTab === 'students' ? isStudentsError : isTeachersError;
    const error = activeTab === 'students' ? studentsError : teachersError;
    const refetch = activeTab === 'students' ? refetchStudents : refetchTeachers;

    const handleStudentPress = (student: TeacherStudentResponse) => {
        setSelectedStudent(student);
        setIsDetailVisible(true);
    };

    const handleAssignGrade = () => {
        setIsDetailVisible(false);
        setTimeout(() => setIsGradeFormVisible(true), 300);
    };

    const handleGradeSubmit = async (gradeData: any) => {
        try {
            await submitScore({
                examId: gradeData.examId,
                studentId: selectedStudent!.userid,
                score: gradeData.score,
            }).unwrap();

            Alert.alert("نجاح", "تم رصد الدرجة بنجاح!");
            setIsGradeFormVisible(false);
            setTimeout(() => setIsDetailVisible(true), 300);
        } catch (error) {
            console.error('Submission error:', error);
            Alert.alert("خطأ", "فشل في رصد الدرجة. تأكد من البيانات والاتصال.");
        }
    };

    if (isLoading && !rawStudents && !rawTeachers) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <AppText style={{ marginTop: 12 }}>جاري التحميل...</AppText>
            </SafeAreaView>
        );
    }

    if (isError && !rawStudents && !rawTeachers) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <AppText>فشل في التحميل.</AppText>
                <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                    <AppText style={styles.retryText}>إعادة المحاولة</AppText>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            <View style={styles.header}>
                <AppText style={styles.headerTitle}>المشتركين</AppText>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'teachers' && styles.activeTab]} 
                    onPress={() => setActiveTab('teachers')}
                >
                    <AppText style={[styles.tabText, activeTab === 'teachers' && styles.activeTabText]}>المعلمون</AppText>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'students' && styles.activeTab]} 
                    onPress={() => setActiveTab('students')}
                >
                    <AppText style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>الطلاب</AppText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={(activeTab === 'students' ? students : teachers) as any[]}
                keyExtractor={(item: any) => activeTab === 'students' ? item.userid : item.id}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        {activeTab === 'students' ? (
                            <StudentCard
                                student={item as any}
                                onPress={() => handleStudentPress(item as any)}
                            />
                        ) : (
                            <TeacherCard 
                                teacher={item as any}
                            />
                        )}
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="account-off-outline" size={64} color="#CBD5E1" />
                        <AppText style={styles.emptyText}>لا يوجد {activeTab === 'students' ? 'طلاب' : 'معلمون'} حالياً</AppText>
                    </View>
                }
            />

            <StudentDetailModal
                visible={isDetailVisible}
                student={selectedStudent}
                onClose={() => setIsDetailVisible(false)}
                onAssignGrade={handleAssignGrade}
            />

            <GradeFormModal
                visible={isGradeFormVisible}
                student={selectedStudent}
                onClose={() => setIsGradeFormVisible(false)}
                onSubmit={handleGradeSubmit}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 100, // Clear global absolute header
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Alexandria-Bold',
        color: COLORS.textMain,
    },
    tabContainer: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 20,
        marginBottom: 16,
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
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tabText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    activeTabText: {
        color: '#FFF',
    },
    listContent: {
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    cardWrapper: {
        marginBottom: 8,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 12,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryText: {
        color: COLORS.card,
        fontWeight: 'bold',
    },
});