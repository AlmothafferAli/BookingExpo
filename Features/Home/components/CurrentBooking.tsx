import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppText as Text } from '../../../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../styles';
import { Booking } from '../data/homeSlice';

interface Props {
    booking: Booking;
}

const getStageGroupDisplay = (booker: any) => {
    if (!booker) return '';

    // 1. Try to find a digit
    let stageNum = booker.stage?.match(/\d/)?.[0] || '';

    // 2. If no digit, map common Arabic ordinals
    if (!stageNum && booker.stage) {
        const arabicMap: { [key: string]: string } = {
            'الأولى': '1',
            'الثانية': '2',
            'الثالثة': '3',
            'الرابعة': '4',
            'الخامسة': '5',
        };
        for (const [key, val] of Object.entries(arabicMap)) {
            if (booker.stage.includes(key)) {
                stageNum = val;
                break;
            }
        }
    }

    const groupChar = booker.group?.trim()?.charAt(0)?.toUpperCase() || '';
    return `${stageNum}${groupChar}`;
};

export const CurrentBooking = ({ booking }: Props) => (
    <View style={styles.currentBookingSection}>
        <Text style={styles.sectionTitle}>الحجز الحالي</Text>

        {/* Hexagon Shape */}
        <View style={styles.hexagonContainer}>
            {/* 1. Blurred Image Effect (Glassmorphism) */}
            <Image
                source={{ uri: booking.image }}
                style={styles.hexagonImageBackground}
                blurRadius={40} // Creates the "transparency"/glass effect
            />

            {/* 2. Dark Overlay for Contrast (Square, but clipped by Mask below) */}
            <View style={[StyleSheet.absoluteFill, styles.hexagonOverlay]} />

            {/* 3. Inverse Mask: Paints the corners the background color, creating the Hexagon shape */}
            <Svg height="330" width="300" style={StyleSheet.absoluteFill}>
                <Path
                    fill="#F4F7FC" // Must match screen background color
                    fillRule="evenodd"
                    d="M0,0 H300 V330 H0 Z M165,31 L255,90 Q270,99 270,116 L270,215 Q270,231 255,240 L165,299 Q150,308 135,299 L45,240 Q30,231 30,215 L30,116 Q30,99 45,90 L135,31 Q150,22 165,31 Z"
                />
            </Svg>

            {/* Content Overlay */}
            <View style={styles.hexagonContent}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={{ uri: booking.image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                    <Text style={styles.overlayTitle}>{booking.course}</Text>
                    <Text style={styles.overlaySubtitle}>{booking.name}</Text>
                </View>
            </View>

            {/* Badge at Bottom Tip */}
            {booking.booker && (
                <View style={[styles.hallBadge, { borderColor: '#4A5568' }]}>
                    <Text style={[styles.hallBadgeText, { color: '#2D3748' }]}>
                        {getStageGroupDisplay(booking.booker)}
                    </Text>
                </View>
            )}
        </View>

        {/* Details Row */}
        <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={24} color="#B0B5C1" />
                <Text style={styles.detailLabel}>وقت المحاضرة</Text>
                <Text style={styles.detailValue}>
                    {new Date(booking.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    -
                    {new Date(booking.endTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
            </View>

            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={24} color="#B0B5C1" />
                <Text style={styles.detailLabel}>مكان الحجز</Text>
                <Text style={styles.detailValue}>{booking.type}</Text>
            </View>
        </View>
    </View>
);
