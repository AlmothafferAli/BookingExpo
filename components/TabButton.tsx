import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
    useAnimatedStyle,
    withTiming,
    LinearTransition
} from 'react-native-reanimated';
import COLORS from '../Base/constants';

// Shared constants (Make sure they match CustomTabBar or pass them as props)
const TAB_BAR_HEIGHT = 70;
const FLOAT_OFFSET = 27;
const ANIMATION_DURATION = 100;

export type TabItem = {
    name: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof MaterialIcons.glyphMap;
    route: string;
    key: string;
};

interface TabButtonProps {
    tab: TabItem;
    isMiddle: boolean;
    isActive: boolean;
    onPress: () => void;
}

export const TabButton = ({ tab, isMiddle, isActive, onPress }: TabButtonProps) => {

    // Animate Y position: Middle icons float up, side icons stay down
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withTiming(isMiddle ? -FLOAT_OFFSET : 0, { duration: ANIMATION_DURATION }) }
            ]
        };
    });

    // Animate Scale/Color for feedback
    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withTiming(isActive ? 1.2 : 1, { duration: ANIMATION_DURATION }) }],
            opacity: withTiming(1, { duration: ANIMATION_DURATION })
        };
    });

    const iconName = (isActive ? tab.icon.replace('-outline', '') : tab.icon) as any;
    const iconColor = isActive && !isMiddle ? COLORS.PrimarySlate : (isMiddle ? '#FFF' : '#999');

    return (
        <Animated.View
            layout={LinearTransition.duration(ANIMATION_DURATION)}
            style={[styles.tabButton, animatedStyle]}
        >
            <TouchableOpacity onPress={onPress} style={styles.touchableArea}>
                <Animated.View style={iconStyle}>
                    <MaterialCommunityIcons
                        name={iconName}
                        size={isMiddle ? 32 : 28}
                        color={iconColor}
                    />
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    tabButton: {
        flex: 1,
        height: TAB_BAR_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10, // Ensure clickability
    },
    touchableArea: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
