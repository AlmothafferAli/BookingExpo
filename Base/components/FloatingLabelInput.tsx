import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants';

interface FloatingLabelInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    style?: any;
}

const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    icon,
    style
}: FloatingLabelInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        animatedValue.value = withTiming(isFocused || value ? 1 : 0, { duration: 250 });
    }, [isFocused, value]);

    const labelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(animatedValue.value, [0, 1], [0, -28]) },
                { scale: interpolate(animatedValue.value, [0, 1], [1, 0.85]) },
            ],
            color: isFocused ? COLORS.PrimarySlate : '#999',
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 6,
            // Adjust position for RTL
            right: 12,
        };
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            borderColor: isFocused ? COLORS.PrimarySlate : '#E0E0E0',
            borderWidth: isFocused ? 2 : 1,
        };
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={[styles.inputContainer, containerStyle]}>
                <Animated.Text style={[styles.label, labelStyle]}>
                    {label}
                </Animated.Text>

                <View style={styles.innerWrapper}>
                    {icon && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={22}
                            color={isFocused ? COLORS.PrimarySlate : '#666'}
                            style={styles.icon}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        secureTextEntry={secureTextEntry}
                        placeholder={isFocused ? placeholder : ''}
                        placeholderTextColor="#999"
                        selectionColor={COLORS.PrimarySlate}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        width: '100%',
    },
    inputContainer: {
        height: 58,
        borderRadius: 50,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    innerWrapper: {
        flexDirection: 'row', // Icons at left
        alignItems: 'center',
        paddingHorizontal: 14,
        height: '100%',
    },
    label: {
        position: 'absolute',
        fontFamily: 'Alexandria-Medium',
        zIndex: 1,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLORS.PrimarySlate,
        fontFamily: 'Alexandria-Regular',
        fontSize: 16,
        textAlign: 'right', // Arabic text alignment
    },
});

export default FloatingLabelInput;
