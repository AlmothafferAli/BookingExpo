import { useState } from 'react';
import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { BOARDING_DATA, BOARDING_IMAGES } from './constants';
import { useOnboardingAnimation } from './animation';
import { styles } from './styles';

/**
 * Main Onboarding Screen Component
 * Displays paginated onboarding content with smooth animations
 */
export default function OnboardingScreen() {
    const [activePage, setActivePage] = useState(1);

    // Get animation values from custom hook
    const { imageOpacity, imageTranslateY, textOpacity, textTranslateY, indicatorScale } =
        useOnboardingAnimation(activePage);

    // Animated style for the image (fade + slide + conditional scale)
    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [
            { translateY: imageTranslateY.value },
            { scale: activePage === 5 ? 1.2 : 1 },
            { translateY: activePage === 5 ? -30 : 0 }
        ],
    }));

    // Animated style for text content (fade + slide)
    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    // Animated style for page indicators (subtle scale)
    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: indicatorScale.value }],
    }));

    // Handle page navigation
    const handlePress = () => {
        if (activePage !== Object.keys(BOARDING_DATA).length) {
            setActivePage(activePage + 1);
        }
    };

    return (
        <Pressable style={styles.container} onPress={handlePress}>
            {/* Top Section: Title, Description, and Indicators */}
            <View style={styles.topSection}>
                <Animated.Text style={[styles.topText, textAnimatedStyle]}>
                    {BOARDING_DATA[activePage as keyof typeof BOARDING_DATA]?.Title}
                </Animated.Text>

                <Animated.Text style={[styles.descriptionText, textAnimatedStyle]}>
                    {BOARDING_DATA[activePage as keyof typeof BOARDING_DATA]?.Description}
                </Animated.Text>

                <View style={styles.pageIndicatorContainer}>
                    {Object.keys(BOARDING_DATA).map((key) => (
                        <Animated.View
                            key={key}
                            style={[
                                styles.pageIndicator,
                                activePage === parseInt(key) && styles.pageIndicatorActive,
                                indicatorAnimatedStyle,
                            ]}
                        />
                    ))}
                </View>
            </View>


            {/* Bottom Section: Animated Image */}
            <View style={styles.bottomSection}>
                <Animated.Image
                    source={BOARDING_IMAGES[activePage as keyof typeof BOARDING_IMAGES]}
                    style={[styles.phoneImage, imageAnimatedStyle]}
                    resizeMode="contain"
                />
            </View>

            {/* Action Buttons - Only on last page */}
            {activePage === 5 && (
                <View style={styles.actionButtonsContainer}>
                    <Link href="/(auth)/Registration" asChild>
                        <Pressable style={styles.registerButton}>
                            <Animated.Text style={[styles.registerButtonText, textAnimatedStyle]}>
                                انشئ حسابك
                            </Animated.Text>
                        </Pressable>
                    </Link>

                    <Link href="/(auth)/login" asChild>
                        <Pressable style={styles.loginLink}>
                            <Animated.Text style={[styles.loginLinkText, textAnimatedStyle]}>
                                لديك حساب بالفعل؟
                            </Animated.Text>
                        </Pressable>
                    </Link>
                </View>
            )}
        </Pressable>
    );
}
