import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { UPCOMING_BOOKINGS } from './constants';
import { Header } from './components/Header';
import { CurrentBooking } from './components/CurrentBooking';
import { UpcomingBookingItem } from './components/UpcomingBookingItem';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header />
            <FlatList
                data={UPCOMING_BOOKINGS}
                renderItem={({ item }) => <UpcomingBookingItem item={item} />}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <>
                        <CurrentBooking />
                        <Text style={[styles.upcomingHeader]}>حجوزاتك التالية</Text>
                    </>
                )}
                contentContainerStyle={styles.listContent}
                style={styles.list}
            />
        </SafeAreaView>
    );
}
