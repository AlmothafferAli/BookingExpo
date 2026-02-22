import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText as Text } from '../../../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../../Base/constants';

interface Props {
    title: string;
    message?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const EmptyState = ({ title, message, icon = 'calendar-blank' }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={64} color="#E1E9EE" />
            </View>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginTop: 20,
    },
    iconContainer: {
        marginBottom: 16,
        padding: 18,
    },
    title: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 18,
        color: COLORS.PrimarySlate,
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
});
