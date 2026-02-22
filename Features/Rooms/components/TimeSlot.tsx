import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import COLORS from '../../../Base/constants';

interface TimeSlotProps {
    time: string;
    isBooked: boolean;
    isSelected: boolean;
    isRange: boolean;
    onSelect: (time: string) => void;
}

export const TimeSlot = ({ time, isBooked, isSelected, isRange, onSelect }: TimeSlotProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(isSelected || isRange ? 1.05 : 1) }],
    }));

    return (
        <TouchableOpacity
            disabled={isBooked}
            onPress={() => onSelect(time)}
            style={styles.slotWrapper}
        >
            <Animated.View style={[
                styles.slotBox,
                isBooked && styles.slotBooked,
                isSelected && styles.slotSelected,
                isRange && styles.slotInRange,
                animatedStyle
            ]}>
                <Text style={[
                    styles.slotText,
                    isBooked && styles.slotTextBooked,
                    (isSelected || isRange) && styles.slotTextSelected
                ]}>
                    {time}
                </Text>
                {isBooked && <View style={styles.bookedIndicator} />}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    slotWrapper: {
        width: 80,
    },
    slotBox: {
        height: 45,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    slotBooked: {
        backgroundColor: '#F1F5F9',
        borderColor: '#E2E8F0',
        opacity: 0.5,
    },
    slotSelected: {
        backgroundColor: COLORS.PrimarySlate,
        borderColor: COLORS.PrimarySlate,
    },
    slotInRange: {
        backgroundColor: 'rgba(21, 101, 192, 0.2)',
        borderColor: COLORS.PrimarySlate,
    },
    slotText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 13,
        color: '#64748B',
    },
    slotTextBooked: {
        color: '#CBD5E1',
        textDecorationLine: 'line-through',
    },
    slotTextSelected: {
        color: '#FFF',
    },
    bookedIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF5252',
    },
});
