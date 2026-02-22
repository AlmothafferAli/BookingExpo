import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../components/AppText';
import { Student, TeacherStudentResponse } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import COLORS from '../../../Base/constants';

interface StudentCardProps {
    student: TeacherStudentResponse;
    onPress: () => void;
}

export const StudentCard = ({ student, onPress }: StudentCardProps) => {
    const handleChatPress = () => {
        router.push(`/chat/${student.userid}`);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.container}>
                {/* Chat Action */}
                <TouchableOpacity onPress={handleChatPress} activeOpacity={0.8}>
                    <View style={styles.modernChatButton}>
                        <MaterialCommunityIcons name="chat-outline" size={18} color="#FFF" />
                        <AppText style={styles.chatButtonText}>محادثة</AppText>
                    </View>
                </TouchableOpacity>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <AppText style={styles.name}>{student.userName}</AppText>
                    <View style={styles.detailRow}>
                        <AppText style={styles.detailText}>{student.stage || 'N/A'}</AppText>
                        <MaterialCommunityIcons name="office-building-outline" size={14} color={COLORS.textMuted} style={styles.icon} />
                    </View>
                    <View style={styles.detailRow}>
                        <AppText style={styles.detailText}>{student.group || 'N/A'}</AppText>
                        <MaterialCommunityIcons name="account-group-outline" size={14} color={COLORS.textMuted} style={styles.icon} />
                    </View>
                </View>

                {/* Avatar */}
                <Image 
                    source={{ uri: student.userImage }} 
                    style={styles.avatar}
                    contentFit="cover"
                    transition={200}
                    placeholder={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.userName)}&background=random&size=128`}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modernChatButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        gap: 6,
    },
    chatButtonText: {
        color: COLORS.card,
        fontFamily: 'Alexandria-Medium',
        fontSize: 12,
        marginBottom: 2,
    },
    infoContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginRight: 4,
    },
    icon: {
        marginTop: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
});
