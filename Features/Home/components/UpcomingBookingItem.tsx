import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles';

export const UpcomingBookingItem = ({ item }: { item: any }) => (
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
