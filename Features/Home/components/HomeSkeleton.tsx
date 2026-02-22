import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { styles as homeStyles } from '../styles';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ style }: { style: any }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        backgroundColor: '#E1E9EE',
    }));

    return <Animated.View style={[style, animatedStyle]} />;
};

const CurrentBookingSkeleton = () => {
    return (
        <View style={homeStyles.currentBookingSection}>
            {/* Title Skeleton */}
            <SkeletonItem style={{ width: 150, height: 32, borderRadius: 16, marginBottom: 24, marginTop: 8 }} />

            {/* Hexagon Skeleton */}
            <View style={homeStyles.hexagonContainer}>
                <Svg height="330" width="300" style={StyleSheet.absoluteFill}>
                    <Path
                        fill="#F4F7FC"
                        fillRule="evenodd"
                        d="M0,0 H300 V330 H0 Z M165,31 L255,90 Q270,99 270,116 L270,215 Q270,231 255,240 L165,299 Q150,308 135,299 L45,240 Q30,231 30,215 L30,116 Q30,99 45,90 L135,31 Q150,22 165,31 Z"
                    />
                </Svg>

                {/* Content Overlay Skeleton */}
                <View style={homeStyles.hexagonContent}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <SkeletonItem style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 12 }} />
                        <SkeletonItem style={{ width: 120, height: 24, borderRadius: 4, marginBottom: 8 }} />
                        <SkeletonItem style={{ width: 80, height: 16, borderRadius: 4 }} />
                    </View>
                </View>

                {/* Badge Skeleton */}
                <View style={[homeStyles.hallBadge, { borderColor: '#E1E9EE' }]}>
                    <SkeletonItem style={{ width: 24, height: 24, borderRadius: 12 }} />
                </View>
            </View>

            {/* Details Row Skeleton */}
            <View style={homeStyles.detailsRow}>
                <View style={homeStyles.detailItem}>
                    <SkeletonItem style={{ width: 24, height: 24, borderRadius: 12, marginBottom: 4 }} />
                    <SkeletonItem style={{ width: 40, height: 12, borderRadius: 4, marginBottom: 4 }} />
                    <SkeletonItem style={{ width: 100, height: 16, borderRadius: 4 }} />
                </View>

                <View style={homeStyles.detailItem}>
                    <SkeletonItem style={{ width: 24, height: 24, borderRadius: 12, marginBottom: 4 }} />
                    <SkeletonItem style={{ width: 40, height: 12, borderRadius: 4, marginBottom: 4 }} />
                    <SkeletonItem style={{ width: 80, height: 16, borderRadius: 4 }} />
                </View>
            </View>
        </View>
    );
};

const UpcomingBookingSkeleton = () => (
    <View style={homeStyles.bookingCard}>
        <View style={homeStyles.bookingInfo}>
            <SkeletonItem style={{ width: 120, height: 20, borderRadius: 4, marginBottom: 8, alignSelf: 'flex-end' }} />
            <SkeletonItem style={{ width: 80, height: 14, borderRadius: 4, marginBottom: 6, alignSelf: 'flex-end' }} />
            <SkeletonItem style={{ width: 60, height: 14, borderRadius: 4, marginBottom: 6, alignSelf: 'flex-end' }} />
            <SkeletonItem style={{ width: 100, height: 14, borderRadius: 4, alignSelf: 'flex-end' }} />
        </View>
        <SkeletonItem style={homeStyles.bookingImage} />
    </View>
);

export const HomeSkeleton = () => {
    return (
        <View style={[homeStyles.container, { direction: 'rtl' }]}>
            <CurrentBookingSkeleton />
            <View style={{ paddingHorizontal: 24, marginTop: 24, alignItems: 'flex-end' }}>
                <SkeletonItem style={{ width: 120, height: 24, borderRadius: 4, marginBottom: 16 }} />
                <UpcomingBookingSkeleton />
                <UpcomingBookingSkeleton />
            </View>
        </View>
    );
};
