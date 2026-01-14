import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../styles';
import { CURRENT_BOOKING } from '../constants';

export const CurrentBooking = () => (
    <View style={styles.currentBookingSection}>
        <Text style={styles.sectionTitle}>الحجز الحالي</Text>

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
            <Svg height="330" width="300" style={StyleSheet.absoluteFill}>
                <Path
                    fill="#F8F9FB" // Must match screen background color
                    fillRule="evenodd"
                    d="M0,0 H300 V330 H0 Z M165,31 L255,90 Q270,99 270,116 L270,215 Q270,231 255,240 L165,299 Q150,308 135,299 L45,240 Q30,231 30,215 L30,116 Q30,99 45,90 L135,31 Q150,22 165,31 Z"
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
    </View>
);
