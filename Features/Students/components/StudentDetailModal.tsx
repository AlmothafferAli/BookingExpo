import React, { useMemo, useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../components/AppText';
import { Student, TeacherStudentResponse } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetMyCoursesQuery } from '../../Rooms/data/bookingSlice';
import { useGetStudentResultsQuery } from '../data/examSlice';
import COLORS from '../../../Base/constants';

interface StudentDetailModalProps {
    visible: boolean;
    student: TeacherStudentResponse | null;
    onClose: () => void;
    onAssignGrade: () => void;
}

export const StudentDetailModal = ({ visible, student, onClose, onAssignGrade }: StudentDetailModalProps) => {
    const { data: courses } = useGetMyCoursesQuery();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const { data: allGrades, isLoading: gradesLoading } = useGetStudentResultsQuery(
        { courseId: selectedCourseId || '', studentId: student?.userid || '' }, 
        { skip: !student || !visible || !selectedCourseId }
    );

    // Reset selection when modal opens or student changes
    useEffect(() => {
        if (!visible) {
            setSelectedCourseId(null);
        }
    }, [visible, student?.userid]);

    // Use the grades returned by the query (already filtered by API)
    const studentGrades = useMemo(() => {
        if (!student || !allGrades || !selectedCourseId) return [];
        return allGrades;
    }, [allGrades, student, selectedCourseId]);

    if (!student) return null;

    const getCourseName = (courseId: string) => {
        if (!courses) return 'جاري التحميل...';
        return courses.find(c => c.courseId === courseId)?.courseName || 'مادة غير معروفة';
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <AppText style={styles.title}>تفاصيل الطالب</AppText>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Profile Section */}
                        <View style={styles.profileSection}>
                            <Image 
                                source={{ uri: student.userImage }} 
                                style={styles.avatar}
                                contentFit="cover"
                                transition={300}
                                placeholder={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.userName)}&background=random&size=128`}
                            />
                            <AppText style={styles.name}>{student.userName}</AppText>
                            <View style={styles.badgeRow}>
                                {student.stage && (
                                    <View style={styles.infoBadge}>
                                        <AppText style={styles.badgeText}>{student.stage}</AppText>
                                    </View>
                                )}
                                {student.group && (
                                    <View style={[styles.infoBadge, { backgroundColor: '#EEF2FF' }]}>
                                        <AppText style={[styles.badgeText, { color: '#4F46E5' }]}>{student.group}</AppText>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.primaryButton} onPress={onAssignGrade}>
                                <AppText style={styles.primaryButtonText}>إضافة درجة</AppText>
                                <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>

                        {/* Grades List */}
                        <AppText style={styles.sectionTitle}>السجل الأكاديمي</AppText>
                        
                        {/* Course Selector */}
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.courseList}
                            contentContainerStyle={styles.courseListContent}
                        >
                            {courses?.map(course => (
                                <TouchableOpacity 
                                    key={course.courseId}
                                    style={[
                                        styles.courseItem,
                                        selectedCourseId === course.courseId && styles.selectedCourseItem
                                    ]}
                                    onPress={() => setSelectedCourseId(course.courseId)}
                                >
                                    <AppText style={[
                                        styles.courseItemText,
                                        selectedCourseId === course.courseId && styles.selectedCourseItemText
                                    ]}>
                                        {course.courseName}
                                    </AppText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {gradesLoading ? (
                            <View style={styles.emptyState}>
                                <ActivityIndicator color="#4F46E5" />
                            </View>
                        ) : studentGrades.length === 0 ? (
                            <View style={styles.emptyState}>
                                <AppText style={styles.emptyText}>
                                    {!selectedCourseId ? "يرجى اختيار مادة لعرض الدرجات" : "لا توجد درجات مسجلة في هذه المادة."}
                                </AppText>
                            </View>
                        ) : (
                            studentGrades.map((grade) => (
                                <View key={grade.id} style={styles.gradeCard}>
                                    <AppText style={styles.subTitle}>{grade.examTitle}</AppText>
                                    
                                    <View
                                    style={styles.gradeHeader}
                                     
                                    >
                                        <AppText style={styles.courseName} >الدرجة من السعي</AppText>
                                        <View style={styles.weightedBadge}>
                                            <AppText style={styles.weightedValue}>{grade.weightedScore.toFixed(2)} / {grade.weight}</AppText>
                                        </View>
                                    </View>
                                    <View style={styles.gradeDetails} >
                                        <AppText style={styles.subTitle}>الدرجة الحاصلة</AppText>
                                        <View style={[styles.scoreBadge, { backgroundColor: grade.score / grade.maxScore >= 0.5 ? COLORS.successBg : COLORS.errorBg }]}>
                                            <AppText style={[styles.scoreText, { color: grade.score / grade.maxScore >= 0.5 ? COLORS.successText : COLORS.errorText }]}>
                                                {grade.score.toFixed(2)} / {grade.maxScore}
                                            </AppText>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
        direction: "ltr",
    },
    content: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        padding: 8,
        backgroundColor: COLORS.borderLight,
        borderRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    badgeRow: {
        flexDirection: 'row-reverse',
        gap: 8,
        marginBottom: 12,
    },
    infoBadge: {
        backgroundColor: COLORS.borderLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textGray,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: COLORS.borderLight,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: COLORS.card,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Alexandria-Bold',
        color: COLORS.textMain,
        alignSelf: 'flex-end',
        marginBottom: 12,
    },
    gradeCard: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    gradeHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textContent,
    },
    scoreBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'Alexandria-Medium',
        textAlign: 'center',
        color: COLORS.textMuted,
    },
    gradeDetails: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    weightedBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: COLORS.infoBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.infoBorder,
    },
    weightedLabel: {
        fontSize: 11,
        color: COLORS.infoText,
        fontFamily: 'Alexandria-Regular',
    },
    weightedValue: {
        fontSize: 13,
        color: COLORS.infoText,
        fontFamily: 'Alexandria-Bold',
    },
    feedbackContainer: {
        backgroundColor: COLORS.card,
        padding: 10,
        borderRadius: 8,
        marginTop: 4,
    },
    feedback: {
        fontSize: 13,
        color: COLORS.textGray,
        fontStyle: 'italic',
        textAlign: 'right',
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: COLORS.textDim,
        textAlign: 'center',
    },
    courseList: {
        marginBottom: 16,
    },
    courseListContent: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 4,
        gap: 8,
    },
    courseItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.borderLight,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedCourseItem: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    courseItemText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    selectedCourseItemText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});
