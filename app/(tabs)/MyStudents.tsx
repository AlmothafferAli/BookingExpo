import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Alert, StatusBar, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StudentCard } from '../../Features/Students/components/StudentCard';
import { StudentDetailModal } from '../../Features/Students/components/StudentDetailModal';
import { GradeFormModal } from '../../Features/Students/components/GradeFormModal';
import { Student, Grade, TeacherStudentResponse } from '../../Features/Students/types';
import { AppText } from '../../components/AppText';
import { useGetMyStudentsQuery, useCreateExamMutation, useSubmitScoreMutation } from '../../Features/Students/data/examSlice';
import COLORS from '../../Base/constants';

export default function MyStudents() {
    const router = useRouter();
    // For now we pass empty params, but you can wire up search inputs to these

    const { data: rawStudents, isLoading, isError, refetch } = useGetMyStudentsQuery({});
    // TODO: Add useGetExamsQuery to fetch created exams list
    // const { data: exams } = useGetExamsQuery(); 
    
    // For now, we will simulate passing exams into the modal or fetching them inside it.
    // Ideally, there should be an endpoint to 'getTeacherExams'
    
    const [submitScore] = useSubmitScoreMutation();

    const [selectedStudent, setSelectedStudent] = useState<TeacherStudentResponse | null>(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isGradeFormVisible, setIsGradeFormVisible] = useState(false);

    const students = useMemo(() => {
        if (!rawStudents) return [];
        return rawStudents;
    }, [rawStudents]);

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
            // GradeData should now include examId selected from the form
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

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <AppText style={{ marginTop: 12 }}>جاري تحميل الطلاب...</AppText>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <AppText>فشل في تحميل الطلاب.</AppText>
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
                <AppText style={styles.headerTitle}>طلابي</AppText>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item) => item.userid}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <StudentCard
                            student={item}
                            onPress={() => handleStudentPress(item)}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
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
        paddingVertical: 14,
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