import React from 'react';
import { View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <View style={styles.notificationContainer}>
                <MaterialCommunityIcons name="bell-outline" size={28} color="#000" />
                <View style={styles.notificationBadge} />
            </View>
            <View style={styles.avatarContainer}>
                <Image source={require('@/assets/avatar.png')} style={styles.avatar} />
            </View>
        </View>
    );
};
