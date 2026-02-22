import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateExamMutation } from '../../Features/Students/data/examSlice';
import { useGetMyCoursesQuery } from '../../Features/Rooms/data/bookingSlice';
import COLORS from '@/Base/constants';

export default function ExamCreationScreen() {
    const router = useRouter();
    const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
    const { data: courses, isLoading: isLoadingCourses } = useGetMyCoursesQuery();

    const [title, setTitle] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    const handleCreateExam = async () => {
        if (!selectedCourse || !title || !maxScore || !weight) {
            Alert.alert("تنبيه", "يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        try {
            await createExam({
                title,
                maxScore: parseFloat(maxScore),
                weight: parseFloat(weight),
                courseId: selectedCourse,
            }).unwrap();

            Alert.alert("نجاح", "تم إنشاء الاختبار بنجاح", [
                { text: "حسناً", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Failed to create exam:', error);
            Alert.alert("خطأ", "فشل إنشاء الاختبار. يرجى المحاولة مرة أخرى.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>إنشاء اختبار جديد</AppText>
            </View>

            <View style={styles.content}>
                {/* Course Selection */}
                <AppText style={styles.label}>اختر المادة</AppText>
                <View style={{ marginBottom: 20, minHeight: 60 }}>
                    {isLoadingCourses ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ alignSelf: 'flex-start' }} />
                    ) : (
                        <FlatList
                            data={courses || []}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.courseId}
                            contentContainerStyle={{ gap: 10, paddingRight: 4, flexDirection: 'row-reverse' }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.courseChip,
                                        selectedCourse === item.courseId && styles.selectedCourseChip
                                    ]}
                                    onPress={() => setSelectedCourse(item.courseId)}
                                >
                                    <AppText style={[
                                        styles.courseText,
                                        selectedCourse === item.courseId && styles.selectedCourseText
                                    ]}>
                                        {item.courseName}
                                    </AppText>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <AppText style={styles.emptyText}>لا توجد مواد مسجلة</AppText>
                            }
                        />
                    )}
                </View>

                {/* Exam Title */}
                <AppText style={styles.label}>عنوان الاختبار</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="مثال: اختبار الشهر الأول"
                    value={title}
                    onChangeText={setTitle}
                    textAlign="right"
                />

                {/* Max Score & Weight */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <AppText style={styles.label}>الوزن %</AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="20"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            textAlign="center"
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <AppText style={styles.label}>الدرجة العظمى</AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="100"
                            keyboardType="numeric"
                            value={maxScore}
                            onChangeText={setMaxScore}
                            textAlign="center"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, isCreating && styles.disabledButton]} 
                    onPress={handleCreateExam}
                    disabled={isCreating}
                >
                    {isCreating ? (
                        <ActivityIndicator color={COLORS.card} />
                    ) : (
                        <AppText style={styles.submitButtonText}>إنشاء الاختبار</AppText>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
       direction: 'rtl',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Alexandria-Bold',
        color: COLORS.textMain,
        flex: 1, 
        textAlign: 'center',
        marginRight: 34 // Balance back button width roughly
    },
    content: {
        padding: 24,
        direction: 'ltr',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Alexandria-Bold',
        color: COLORS.textContent,
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'Alexandria-Regular',
        textAlign: 'right'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    courseChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedCourseChip: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    courseText: {
        fontSize: 14,
        color: COLORS.textGray,
        fontFamily: 'Alexandria-Medium',
    },
    selectedCourseText: {
        color: COLORS.primary,
        fontFamily: 'Alexandria-Bold',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: COLORS.infoBorder,
    },
    submitButtonText: {
        color: COLORS.card,
        fontSize: 16,
        fontFamily: 'Alexandria-Bold',
    },
    emptyText: {
        color: COLORS.textDim,
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        padding: 8,
    }
});
