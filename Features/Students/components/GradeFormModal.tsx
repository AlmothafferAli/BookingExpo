import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Student, Exam, TeacherStudentResponse } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetTeacherExamsQuery } from '../data/examSlice';

interface GradeFormModalProps {
    visible: boolean;
    student: TeacherStudentResponse | null;
    onClose: () => void;
    onSubmit: (gradeData: any) => void;
}

export const GradeFormModal = ({ visible, student, onClose, onSubmit }: GradeFormModalProps) => {
    const { data: exams, isLoading } = useGetTeacherExamsQuery(undefined, {
        skip: !visible, // Only fetch when modal is open
    });

    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    
    // Display-only fields (populated from selected Exam)
    const [displayInfo, setDisplayInfo] = useState<{ title: string, maxScore: number, weight: number, courseName?: string } | null>(null);

    useEffect(() => {
        if (selectedExamId && exams) {
            const exam = exams.find(e => e.id === selectedExamId);
            if (exam) {
                setDisplayInfo({
                    title: exam.title,
                    maxScore: exam.maxScore,
                    weight: exam.weight,
                    courseName: exam.courseName
                });
            }
        } else {
            setDisplayInfo(null);
        }
    }, [selectedExamId, exams]);

    const handleSubmit = () => {
        if (!selectedExamId || !score || !displayInfo) return;

        const gradeData = {
            examId: selectedExamId,
            score: parseFloat(score),
            feedback,
            // Pass these purely for local UI update until re-fetch
            title: displayInfo.title,
            maxScore: displayInfo.maxScore,
            weight: displayInfo.weight,
            courseId: exams?.find(e => e.id === selectedExamId)?.courseId || '',
        };

        onSubmit(gradeData);
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setSelectedExamId('');
        setScore('');
        setFeedback('');
        setDisplayInfo(null);
    };

    if (!student) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText style={styles.title}>رصد درجة للطالب: {student.userName}</AppText>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#4F46E5" />
                            <AppText>جاري تحميل الاختبارات...</AppText>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.form}>
                            {/* Exam Selection */}
                            <AppText style={styles.label}>اختر الاختبار</AppText>
                            <View style={styles.courseContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {exams && exams.length > 0 ? (
                                        exams.map(exam => (
                                            <TouchableOpacity
                                                key={exam.id}
                                                style={[styles.courseChip, selectedExamId === exam.id && styles.selectedCourse]}
                                                onPress={() => setSelectedExamId(exam.id)}
                                            >
                                                <AppText style={[styles.courseText, selectedExamId === exam.id && styles.selectedCourseText]}>
                                                    {exam.title}
                                                </AppText>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <AppText style={{ color: '#9CA3AF', padding: 10 }}>لا توجد اختبارات متاحة. قم بإنشاء اختبار أولاً.</AppText>
                                    )}
                                </ScrollView>
                            </View>

                            {/* Read-Only Exam Info */}
                            {displayInfo && (
                                <View style={styles.infoBox}>
                                    <View style={styles.infoRow}>
                                        <AppText style={styles.infoLabel}>المادة:</AppText>
                                        <AppText style={styles.infoValue}>{displayInfo.courseName || 'N/A'}</AppText>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <AppText style={styles.infoLabel}>الوزن:</AppText>
                                        <AppText style={styles.infoValue}>{displayInfo.weight}%</AppText>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <AppText style={styles.infoLabel}>الدرجة القصوى:</AppText>
                                        <AppText style={styles.infoValue}>{displayInfo.maxScore}</AppText>
                                    </View>
                                </View>
                            )}

                            {/* Score Input */}
                            <AppText style={styles.label}>الدرجة المستحقة</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={score}
                                onChangeText={setScore}
                                textAlign="center"
                            />

                            {/* Feedback */}
                            <AppText style={styles.label}>ملاحظات (اختياري)</AppText>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="أكتب ملاحظاتك..."
                                multiline
                                numberOfLines={3}
                                value={feedback}
                                onChangeText={setFeedback}
                                textAlign="right"
                            />

                            <TouchableOpacity 
                                style={[styles.submitButton, (!selectedExamId || !score) && { opacity: 0.5 }]} 
                                onPress={handleSubmit}
                                disabled={!selectedExamId || !score}
                            >
                                <AppText style={styles.submitButtonText}>حفظ الدرجة</AppText>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Alexandria-Bold',
        color: '#111827',
        textAlign: 'right',
        flex: 1,
    },
    form: {
        paddingBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Alexandria-Medium',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        fontFamily: 'Alexandria-Regular',
    },
    courseContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    courseChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCourse: {
        backgroundColor: '#EEF2FF',
        borderColor: '#4F46E5',
    },
    courseText: {
        color: '#4B5563',
        fontSize: 14,
        fontFamily: 'Alexandria-Medium',
    },
    selectedCourseText: {
        color: '#4F46E5',
    },
    infoBox: {
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: {
        color: '#6B7280',
        fontFamily: 'Alexandria-Regular',
        fontSize: 13,
    },
    infoValue: {
        color: '#1F2937',
        fontFamily: 'Alexandria-Bold',
        fontSize: 13,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Alexandria-Bold',
    },
});
