import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Custom Text component that applies global font family 'Alexandria' by default.
 * This ensures consistency across the app without repeating fontFamily in every StyleSheet.
 */
export const AppText = ({ style, ...props }: TextProps) => {
    return (
        <RNText
            style={[styles.defaultFont, style]}
            {...props}
        />
    );
};

export const AnimatedAppText = Animated.createAnimatedComponent(AppText);

const styles = StyleSheet.create({
    defaultFont: {
        fontFamily: 'Alexandria-Regular',
        textAlign: 'right', // common for Arabic apps
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default AppText;
