import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../Base/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, ClipPath, Polygon, Image as SvgImage, Rect, Path } from 'react-native-svg';


// Mock Data
const CURRENT_BOOKING = {
    title: 'برمجة العاب',
    subtitle: 'Collisions',
    hall: '7',
    time: '10:00-8:30',
    locationName: 'قاعة 7',
    image: require('@/assets/course_gaming.png'),
};

const UPCOMING_BOOKINGS = [
    {
        id: '1',
        title: 'برمجة العاب',
        subtitle: 'Collisions',
        time: '10:00-8:30',
        location: 'المختبر الذكي',
        stage: 'مرحلة رابعة',
        image: require('@/assets/course_gaming.png'),
    },
    {
        id: '2',
        title: 'مصفوفات',
        subtitle: 'Determinants',
        time: '10:00-8:30',
        location: 'المختبر الخامس',
        stage: 'مرحلة ثالثة',
        image: require('@/assets/course_smart.png'),
    },
    {
        id: '3',
        title: 'ذكاء اصطناعي',
        subtitle: 'Neural Networks',
        time: '12:30-10:30',
        location: 'قاعة 3',
        stage: 'مرحلة رابعة',
        image: require('@/assets/course_smart.png'),
    },
];

export default function HomeScreen() {
    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.notificationContainer}>
                <MaterialCommunityIcons name="bell-outline" size={28} color="#000" />
                <View style={styles.notificationBadge} />
            </View>
            <View style={styles.avatarContainer}>
                <Image source={require('@/assets/avatar.png')} style={styles.avatar} />
            </View>
        </View>
    );

    const renderCurrentBooking = () => (
        <View style={styles.currentBookingSection}>
            <Text style={styles.sectionTitle}>الحجز الحالي</Text>

            {/* Hexagon Shape */}
            {/* Hexagon Shape */}
            <View style={styles.hexagonContainer}>
                {/* 1. Blurred Image Effect (Glassmorphism) */}
                <Image
                    source={CURRENT_BOOKING.image}
                    style={styles.hexagonImageBackground}
                    blurRadius={40} // Creates the "transparency"/glass effect
                />

                {/* 2. Dark Overlay for Contrast (Square, but clipped by Mask below) */}
                <View style={[StyleSheet.absoluteFill, styles.hexagonOverlay]} />

                {/* 3. Inverse Mask: Paints the corners the background color, creating the Hexagon shape */}
                <Svg height="300" width="300" style={StyleSheet.absoluteFill}>
                    <Path
                        fill="#F8F9FB" // Must match screen background color
                        fillRule="evenodd"
                        d="M0,0 H300 V300 H0 Z  M150,20 L270,90 L270,210 L150,280 L30,210 L30,90 Z"
                    />
                </Svg>

                {/* Content Overlay */}
                <View style={styles.hexagonContent}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={CURRENT_BOOKING.image} style={{ width: 100, height: 100, borderRadius: 10 }} />
                        <Text style={styles.overlayTitle}>{CURRENT_BOOKING.title}</Text>
                        <Text style={styles.overlaySubtitle}>{CURRENT_BOOKING.subtitle}</Text>
                    </View>
                </View>

                {/* Badge at Bottom Tip */}
                <View style={styles.hallBadge}>
                    <Text style={styles.hallBadgeText}>{CURRENT_BOOKING.hall}</Text>
                </View>
            </View>

            {/* Details Row */}
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="clock-time-four-outline" size={20} color="#999" />
                    <Text style={styles.detailLabel}>وقت المحاضرة</Text>
                    <Text style={styles.detailValue}>{CURRENT_BOOKING.time}</Text>
                </View>

                <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="map-marker-outline" size={20} color="#999" />
                    <Text style={styles.detailLabel}>مكان الحجز</Text>
                    <Text style={styles.detailValue}>{CURRENT_BOOKING.locationName}</Text>
                </View>
            </View>
        </View >
    );

    const renderUpcomingItem = ({ item }: { item: typeof UPCOMING_BOOKINGS[0] }) => (
        <View style={styles.bookingCard}>
            <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{item.title}</Text>
                <View style={styles.bookingRow}>
                    <Text style={styles.bookingText}>وقت المحاضرة {item.time}</Text>
                </View>
                <View style={styles.bookingRow}>
                    <Text style={styles.bookingText}>{item.location}</Text>
                    <Text style={styles.bookingLabel}>مكان الحجز</Text>
                </View>
                <View style={styles.bookingRow}>
                    <Text style={styles.bookingText}>{item.stage}</Text>
                </View>
            </View>
            <Image source={item.image} style={styles.bookingImage} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}
            <FlatList
                data={UPCOMING_BOOKINGS}
                renderItem={renderUpcomingItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <>
                        {renderCurrentBooking()}
                        <Text style={[styles.sectionTitle, styles.upcomingTitle]}>حجوزاتك التالية</Text>
                    </>
                )}
                contentContainerStyle={styles.listContent}
                style={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    notificationContainer: {
        position: 'relative',
        padding: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF5252',
        borderWidth: 1.5,
        borderColor: '#F8F9FB',
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#DDD',
    },
    sectionTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    upcomingTitle: {
        textAlign: 'right',
        marginBottom: 16,
        marginTop: 32,
    },
    currentBookingSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    hexagonContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    hexagonImageBackground: {
        transform: [{ scale: 0.35 }],
        position: 'absolute',

        transformOrigin: 'center',
    },
    hexagonOverlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    hexagonSvg: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        overflow: 'hidden',
        // Elevation implies native shadow which doesn't work well on Svg directly without View, 
        // but the Svg is inside a View
    },
    hexagonContent: {

        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 22,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    overlaySubtitle: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        color: '#DDD',
        textAlign: 'center',
    },
    hallBadge: {
        position: 'absolute',
        bottom: 15, // Approx tip location (300 height -> tip at 280)
        alignSelf: 'center',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333',
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
    },
    hallBadgeText: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 20,
        color: '#333',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 0,
        paddingHorizontal: 16,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontFamily: 'Alexandria-Light',
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        marginBottom: 2,
    },
    detailValue: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 14,
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    list: {
        flex: 1,
    },
    bookingCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    bookingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    bookingInfo: {
        flex: 1,
        marginRight: 16,
        alignItems: 'flex-end',
    },
    bookingTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        color: COLORS.PrimarySlate,
        marginBottom: 4,
    },
    bookingRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 2,
    },
    bookingText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    bookingLabel: {
        fontFamily: 'Alexandria-Light',
        fontSize: 10,
        color: '#999',
    },
});
