import React from 'react';
import { View, Image } from 'react-native';
import { AppText as Text } from '../../../components/AppText';
import { styles } from '../styles';
import { Booking } from '../data/homeSlice';

export const UpcomingBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
        <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>{item.name}</Text>
            {/* Removed Time, Location, Stage as per API response in todos.md */}
            <View style={styles.bookingRow}>
                <Text style={styles.bookingText}>{item.type}</Text>
            </View>
            <View style={styles.bookingRow}>
                <Text style={styles.bookingText}>{item.status}</Text>
            </View>
            <View style={styles.bookingRow}>
                <Text style={styles.bookingText}>
                    {new Date(item.startTime).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} • {new Date(item.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </Text>
            </View>
        </View>
        <Image source={{ uri: item.image }} style={styles.bookingImage} />
    </View>
);
