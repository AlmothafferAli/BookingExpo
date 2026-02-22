import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { AppText as Text } from '../../../components/AppText';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Room } from '../data/types';
import COLORS from '../../../Base/constants';
import { BookingModal } from './BookingModal';
import { useRouter } from 'expo-router';

interface RoomCardProps {
    room: Room;
    style?: StyleProp<ViewStyle>;
    stageName?: string;
    groupName?: string;
}

export const RoomCard = ({ room, style, stageName = '', groupName = '' }: RoomCardProps) => {
    const router = useRouter();
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
    const isBooked = room.status === 'booked';
    const booker = room.booker;

    const translateType = (type: string) => {
        if (type === 'LAP') return 'مختبر';
        if (type === 'LECTURE_ROOM') return 'قاعة محاضرات';
        return type;
    };

    const formatTime = (isoString: string | null) => {
        if (!isoString) return '--:--';
        try {
            const d = new Date(isoString);
            return d.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '--:--';
        }
    };

    return (
        <View style={[styles.cardContainer, style]}>
            <Image source={{ uri: room.image }} style={styles.cardImage} resizeMode="cover" />

            {/* Status Badge - Top Right */}
            <View style={styles.statusBadgeContainer}>
                <BlurView intensity={40} tint="dark" style={styles.statusBlur}>
                    <View style={[styles.statusDot, { backgroundColor: isBooked ? '#EF4444' : '#22C55E' }]} />
                    <Text style={styles.statusText}>{isBooked ? 'محجوز' : 'متاح'}</Text>
                </BlurView>
            </View>

            {isBooked && (<View style={styles.capacityBadgeContainer}>
                <TouchableOpacity onPress={() => {
                    router.push(`/chat/${booker?.id}`);
                }} activeOpacity={0.8}>
                    <BlurView intensity={20} tint="light" style={styles.modernChatButton}>
                        <MaterialCommunityIcons name="chat-outline" size={18} color="#FFF" />
                        <Text style={styles.chatButtonText}>محادثة</Text>
                    </BlurView>
                </TouchableOpacity>

            </View>)}
            {/* Capacity Badge - Top Left (if available) */}
            {!isBooked && (
                <View style={styles.capacityBadgeContainer}>
                    <BlurView intensity={40} tint="dark" style={styles.statusBlur}>
                        <MaterialCommunityIcons name="account-group" size={16} color="#FFF" />
                        <Text style={styles.capacityText}>{room.capacity}</Text>
                    </BlurView>
                </View>
            )}

            {/* Bottom Info Glass */}
            <View style={styles.infoOverlay}>
                <BlurView intensity={80} tint="dark" style={styles.infoBlur}>
                    <View style={styles.infoContent}>
                        <View style={styles.mainInfo}>
                            <Text style={styles.roomName}>{room.name}</Text>
                            <Text style={styles.roomType} numberOfLines={1}>
                                {isBooked && room.course ? room.course : translateType(room.type)}
                            </Text>
                        </View>

                        {isBooked && booker ? (

                            <View style={styles.bookerSection}>
                                <View style={styles.bookerRefBox}>
                                    <Text style={styles.bookerRefText}>{booker.stage}</Text>
                                    <Text style={styles.bookerRefTextSecondary}>{booker.group}</Text>
                                </View>
                                <View style={styles.bookerMeta}>
                                    <Text style={styles.bookerName}>{booker.name}</Text>
                                    <View style={styles.timerRow}>
                                        <MaterialCommunityIcons name="clock-time-three-outline" size={12} color="#FCD34D" />
                                        <Text style={styles.timerText}>
                                            {formatTime(room.startTime)} - {formatTime(room.endTime)}
                                        </Text>
                                    </View>
                                </View>
                                <Image
                                    source={{
                                        uri: booker.avatar && booker.avatar.startsWith('http')
                                            ? booker.avatar
                                            : 'https://ui-avatars.com/api/?name=' + booker.name
                                    }}
                                    style={styles.avatar}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setIsBookingModalVisible(true)}
                            >
                                <Text style={styles.actionButtonText}>احجز الآن</Text>
                                <MaterialCommunityIcons name="calendar-plus" size={18} color={COLORS.PrimarySlate} />
                            </TouchableOpacity>
                        )}
                    </View>
                </BlurView>
            </View>

            <BookingModal
                visible={isBookingModalVisible}
                onClose={() => setIsBookingModalVisible(false)}
                room={room}
                stageName={stageName}
                groupName={groupName}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: 260,
        borderRadius: 32,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        backgroundColor: '#1E293B',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    statusBadgeContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        overflow: 'hidden',
        borderRadius: 20,
    },
    capacityBadgeContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        overflow: 'hidden',
        borderRadius: 20,
    },
    statusBlur: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        color: '#FFF',
        fontFamily: 'Alexandria-Bold',
        fontSize: 12,
    },
    capacityText: {
        color: '#FFF',
        fontFamily: 'Alexandria-Bold',
        fontSize: 12,
        marginRight: 4,
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Adjust dynamically if possible, hardcoded for now
    },
    infoBlur: {
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    infoContent: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainInfo: {
        alignItems: 'flex-end',
        flex: 1,
    },
    roomName: {
        color: '#FFF',
        fontFamily: 'Alexandria-Bold',
        fontSize: 22,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 8,
    },
    roomType: {
        color: '#94A3B8',
        fontFamily: 'Alexandria-Medium',
        fontSize: 12,
    },
    bookerSection: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 16,
    },
    bookerMeta: {
        alignItems: 'flex-end',
        marginLeft: 12,
        marginRight: 8,
    },
    bookerName: {
        color: '#FFF',
        fontFamily: 'Alexandria-SemiBold',
        fontSize: 13,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    timerRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginTop: 2,
        gap: 4,
    },
    timerText: {
        color: '#FCD34D',
        fontFamily: 'Alexandria-Medium',
        fontSize: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    bookerRefBox: {
        alignItems: 'center',
        marginLeft: 8,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        paddingLeft: 8,
    },
    bookerRefText: {
        color: '#E2E8F0',
        fontFamily: 'Alexandria-Bold',
        fontSize: 10,
    },
    bookerRefTextSecondary: {
        color: '#94A3B8',
        fontFamily: 'Alexandria-Regular',
        fontSize: 9,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        gap: 8,
    },
    actionButtonText: {
        color: COLORS.PrimarySlate,
        fontFamily: 'Alexandria-Bold',
        fontSize: 12,
    },
    modernChatButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        gap: 6,
    },
    chatButtonText: {
        color: '#FFF',
        fontFamily: 'Alexandria-Medium',
        fontSize: 12,
    },
});
