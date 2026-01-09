import { useEffect } from 'react';
import { useSharedValue, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { ANIMATION_CONFIG } from './constants';

/**
 * Custom hook for managing onboarding page transition animations
 * @param activePage - Current active page number
 * @returns Object containing animated values and styles
 */
export const useOnboardingAnimation = (activePage: number) => {
    // Animation values for different elements
    const imageOpacity = useSharedValue(1);
    const imageTranslateY = useSharedValue(0);
    const textOpacity = useSharedValue(1);
    const textTranslateY = useSharedValue(0);
    const indicatorScale = useSharedValue(1);

    // Trigger coordinated animation when page changes
    useEffect(() => {
        // Simple, elegant approach: Fade out everything, then fade in with subtle slide

        // Phase 1: Fade out current content
        textOpacity.value = withTiming(0, {
            duration: 300,
            easing: Easing.ease,
        });

        imageOpacity.value = withTiming(0, {
            duration: 300,
            easing: Easing.ease,
        });

        // Indicators subtle pulse
        indicatorScale.value = withSequence(
            withTiming(0.85, { duration: 200, easing: Easing.ease }),
            withTiming(1, { duration: 300, easing: Easing.ease })
        );

        // Phase 2: After fade out, prepare for entrance and fade in
        setTimeout(() => {
            // Reset positions for slide-up entrance
            textTranslateY.value = 30;
            imageTranslateY.value = 50;

            // Fade in text with slide up
            textOpacity.value = withTiming(1, {
                duration: 600,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            textTranslateY.value = withTiming(0, {
                duration: 600,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });

            // Fade in image with slide up (slightly delayed)
            setTimeout(() => {
                imageOpacity.value = withTiming(1, {
                    duration: 700,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
                imageTranslateY.value = withTiming(0, {
                    duration: 700,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
            }, 100);
        }, 300);
    }, [activePage]);

    return {
        imageOpacity,
        imageTranslateY,
        textOpacity,
        textTranslateY,
        indicatorScale,
    };
};
