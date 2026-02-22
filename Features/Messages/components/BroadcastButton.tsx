import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles';

interface BroadcastButtonProps {
    onPress: () => void;
}

export const BroadcastButton = ({ onPress }: BroadcastButtonProps) => (
    <TouchableOpacity
        style={styles.broadcastButton}
        onPress={onPress}
    >
        <MaterialCommunityIcons name="bullhorn-outline" size={20} color="#FFF" />
        <Text style={styles.broadcastText}>إرسال تنبيه لكل الطلاب</Text>
    </TouchableOpacity>
);
