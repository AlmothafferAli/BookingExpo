import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, Layout, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import COLORS from '../../../Base/constants';
import { useGetMyCoursesQuery, useCreateBookingMutation } from '../data/bookingSlice';
import { useGetFiltersQuery, useGetBookedRoomsQuery } from '../data/roomSlice';
import { secureStore } from '../../../Base/secureStore';

import { TimeSlot } from './TimeSlot';

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    room: {
        id: string;
        name: string;
    };
    stageName: string;
    groupName: string;
}

export const BookingModal = ({ visible, onClose, room, stageName, groupName }: BookingModalProps) => {
    const [subject, setSubject] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<{ id: string, name: string } | null>(null);
    const [selectedStage, setSelectedStage] = useState(stageName || '');
    const [selectedGroup, setSelectedGroup] = useState(groupName || '');
    const [date, setDate] = useState(new Date());

    // New Time Selection States
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);

    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
    const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // API Hooks
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const { data: courses, isLoading: coursesLoading } = useGetMyCoursesQuery();
    const { data: filters } = useGetFiltersQuery(undefined, { skip: !visible });
    const { data: bookedRoomsData, isLoading: bookedLoading } = useGetBookedRoomsQuery({ date: formattedDate }, { skip: !visible });
    const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

    // Filter booked slots for current room
    const bookedTimeRanges = useMemo(() => {
        if (!bookedRoomsData) return [];
        return bookedRoomsData
            .filter(br => br.id === room.id)
            .map(br => ({
                start: br.startTime ? new Date(br.startTime).getHours() * 60 + new Date(br.startTime).getMinutes() : 0,
                end: br.endTime ? new Date(br.endTime).getHours() * 60 + new Date(br.endTime).getMinutes() : 0
            }));
    }, [bookedRoomsData, room.id]);

    useEffect(() => {
        if (visible) {
            setSelectedStage(stageName || '');
            setSelectedGroup(groupName || '');
            setStartTime(null);
            setEndTime(null);
        }
    }, [visible, stageName, groupName]);

    // Generate Slots
    const slots = useMemo(() => {
        const list = [];
        for (let h = 8; h <= 21; h++) {
            for (let m = 0; m < 60; m += 30) {
                const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                const totalMins = h * 60 + m;
                const isBooked = bookedTimeRanges.some(range => totalMins >= range.start && totalMins < range.end);
                list.push({ time: timeStr, minutes: totalMins, isBooked });
            }
        }
        return list;
    }, [bookedTimeRanges]);

    const handleSlotSelect = (time: string) => {
        if (!startTime || (startTime && endTime)) {
            setStartTime(time);
            setEndTime(null);
        } else {
            const startMins = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
            const endMins = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);

            if (endMins <= startMins) {
                setStartTime(time);
                return;
            }

            // Check if any booked slot is in between
            const conflictingSlot = slots.find(s => s.isBooked && s.minutes > startMins && s.minutes < endMins);
            if (conflictingSlot) {
                console.warn(`Time Conflict Detected: Slot ${conflictingSlot.time} is already booked within the range ${startTime} - ${time}`);
                Alert.alert('خطأ', 'الوقت المحدد يتداخل مع حجز موجود');
                return;
            }

            console.log(`Setting range selection: ${startTime} to ${time}`);
            setEndTime(time);
        }
    };

    const isSlotInRange = (time: string) => {
        if (!startTime || !endTime) return false;
        const mins = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
        const startMins = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMins = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        return mins > startMins && mins < endMins;
    };

    const handleCreateBooking = async () => {
        console.log('--- Validating Booking Data ---');
        console.log('Subject:', subject);
        console.log('Course:', selectedCourse);
        console.log('Stage:', selectedStage);
        console.log('Group:', selectedGroup);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        if (!subject || !selectedCourse || !selectedStage || !selectedGroup || !startTime || !endTime) {
            console.warn('Booking Validation Failed: Missing one or more required fields');
            Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            const user = await secureStore.getUser();
            console.log('Current User from SecureStore:', user);

            if (!user) {
                console.error('Booking Validation Failed: User not found in secure store');
                Alert.alert('خطأ', 'يرجى تسجيل الدخول');
                return;
            }

            const pad = (n: number) => String(n).padStart(2, '0');
            const localISODate = (timeStr: string) => {
                const [h, m] = timeStr.split(':');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(parseInt(h))}:${pad(parseInt(m))}:00.000`;
            };

            const payload = {
                roomId: room.id,
                teacherId: user.id || user.sub,
                subject,
                course: selectedCourse.name,
                startTime: localISODate(startTime),
                endTime: localISODate(endTime),
                stageName: selectedStage,
                groupName: selectedGroup,
            };

            console.log('Booking Request Body:', JSON.stringify(payload, null, 2));

            await createBooking(payload).unwrap();

            Alert.alert('نجاح', 'تم إنشاء الحجز بنجاح');
            onClose();
        } catch (error) {
            Alert.alert('خطأ', 'فشل الحجز، ربما تداخل الوقت');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
                        <Animated.View entering={FadeInUp.springify()} style={styles.modalContent}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.modalTitle}>حجز القاعة</Text>
                                    <Text style={styles.roomName}>{room.name}</Text>
                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                                <Text style={styles.label}>المادة (Subject)</Text>
                                <TextInput style={styles.input} placeholder="عنوان المادة..." value={subject} onChangeText={setSubject} textAlign="right" />

                                <Text style={styles.label}>المقرر والمرحلة</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={[styles.dropdownTrigger, { flex: 1 }]} onPress={() => setIsStageDropdownOpen(!isStageDropdownOpen)}>
                                        <Text style={styles.dropdownValue}>{selectedStage || 'المرحلة'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.dropdownTrigger, { flex: 1 }]} onPress={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}>
                                        <Text style={styles.dropdownValue}>{selectedCourse?.name || 'المقرر'}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Dropdowns expanded logic... (Simplified for brevity but fully functional in full write) */}
                                {isCourseDropdownOpen && (
                                    <View style={styles.miniDropdown}>
                                        {courses?.map(c => (
                                            <TouchableOpacity key={c.id} onPress={() => { setSelectedCourse({ id: c.courseId, name: c.courseName }); setIsCourseDropdownOpen(false); }} style={styles.miniItem}>
                                                <Text style={styles.miniText}>{c.courseName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                                {isStageDropdownOpen && (
                                    <View style={styles.miniDropdown}>
                                        {filters?.stages.map(s => (
                                            <TouchableOpacity key={s} onPress={() => { setSelectedStage(s); setIsStageDropdownOpen(false); }} style={styles.miniItem}>
                                                <Text style={styles.miniText}>{s}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <Text style={styles.label}>المجموعة (Group)</Text>
                                <TouchableOpacity
                                    style={styles.dropdownTrigger}
                                    onPress={() => {
                                        setIsGroupDropdownOpen(!isGroupDropdownOpen);
                                        setIsCourseDropdownOpen(false);
                                        setIsStageDropdownOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownValue}>{selectedGroup || 'اختر المجموعة...'}</Text>
                                </TouchableOpacity>

                                {isGroupDropdownOpen && (
                                    <View style={styles.miniDropdown}>
                                        {filters?.groups.map(g => (
                                            <TouchableOpacity key={g} onPress={() => { setSelectedGroup(g); setIsGroupDropdownOpen(false); }} style={styles.miniItem}>
                                                <Text style={styles.miniText}>{g}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <Text style={styles.label}>التاريخ</Text>
                                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                                    <Text style={{ textAlign: 'right' }}>{date.toLocaleDateString('ar-EG')}</Text>
                                </TouchableOpacity>
                                {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}

                                <Text style={styles.label}>اختر وقت الحجز (بالساعات)</Text>
                                {bookedLoading ? <ActivityIndicator color={COLORS.PrimarySlate} /> : (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.slotsScroll}
                                        nestedScrollEnabled={true}
                                    >
                                        {slots.map(s => (
                                            <TimeSlot
                                                key={s.time}
                                                time={s.time}
                                                isBooked={s.isBooked}
                                                isSelected={startTime === s.time || endTime === s.time}
                                                isRange={isSlotInRange(s.time)}
                                                onSelect={handleSlotSelect}
                                            />
                                        ))}
                                    </ScrollView>
                                )}

                                {startTime && (
                                    <Animated.View entering={FadeInDown} style={styles.selectionSummary}>
                                        <Text style={styles.summaryText}>
                                            {endTime ? `${endTime} ← ${startTime}` : `يبدأ من ${startTime}... اختر وقت الانتهاء`}
                                        </Text>
                                    </Animated.View>
                                )}
                            </ScrollView>

                            <TouchableOpacity
                                style={[styles.bookButton, (!subject || !selectedCourse || !startTime || !endTime) && styles.bookButtonDisabled]}
                                onPress={handleCreateBooking}
                                disabled={isBooking || !subject || !selectedCourse || !startTime || !endTime}
                            >
                                {isBooking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.bookButtonText}>إتمام الحجز</Text>}
                            </TouchableOpacity>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    keyboardContainer: { flex: 1, justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
        maxHeight: '92%',
        shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitleContainer: { alignItems: 'flex-end' },
    modalTitle: { fontFamily: 'Alexandria-Bold', fontSize: 24, color: COLORS.PrimarySlate },
    roomName: { fontFamily: 'Alexandria-Medium', fontSize: 14, color: '#64748B' },
    closeButton: { padding: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
    formScroll: { marginBottom: 10 },
    label: { fontFamily: 'Alexandria-SemiBold', fontSize: 14, color: '#475569', marginBottom: 8, textAlign: 'right', marginTop: 10 },
    input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, fontFamily: 'Alexandria-Regular' },
    row: { flexDirection: 'row-reverse', gap: 10 },
    dropdownTrigger: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, alignItems: 'center' },
    dropdownValue: { fontFamily: 'Alexandria-Medium', color: COLORS.PrimarySlate, fontSize: 13 },
    slotsScroll: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 8,
    },
    selectionSummary: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 16, marginTop: 15, alignItems: 'center' },
    summaryText: { fontFamily: 'Alexandria-Bold', color: COLORS.PrimarySlate, fontSize: 14 },
    bookButton: { backgroundColor: COLORS.PrimarySlate, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 10 },
    bookButtonDisabled: { backgroundColor: '#CBD5E1' },
    bookButtonText: { fontFamily: 'Alexandria-Bold', fontSize: 16, color: '#FFF' },
    miniDropdown: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, marginTop: 4, padding: 8, elevation: 4 },
    miniItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    miniText: { textAlign: 'right', fontFamily: 'Alexandria-Regular', fontSize: 13, color: '#475569' },
});

