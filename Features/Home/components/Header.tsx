import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles';
import { AppText as Text } from '../../../components/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../../Base/constants';

export const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            {/* Left Action (Notification) */}
            <TouchableOpacity style={styles.notificationContainer}>
                <MaterialCommunityIcons name="bell-outline" size={26} color={COLORS.PrimarySlate} />
                <View style={[styles.notificationBadge, { borderColor: '#F8F9FB' }]} />
            </TouchableOpacity>

            {/* Center Date */}
            <View style={styles.dateHeaderContainer}>
                <Text style={styles.topDateText}>
                    {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
            </View>

            {/* Right Action (Profile) */}
            <TouchableOpacity style={styles.avatarContainer}>
                <Image
                    source={require('@/assets/avatar.png')}
                    style={styles.avatar}
                />
            </TouchableOpacity>
        </View>
    );
};
