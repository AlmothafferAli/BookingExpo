import React from 'react';
import { View, FlatList } from 'react-native';
import { AppText as Text } from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { CurrentBooking } from './components/CurrentBooking';
import { UpcomingBookingItem } from './components/UpcomingBookingItem';
import { useGetCurrentBookingsQuery, useGetUpcomingBookingsQuery } from './data/homeSlice';
import { HomeSkeleton } from './components/HomeSkeleton';
import { EmptyState } from './components/EmptyState';

export default function HomeScreen() {
    const { data: currentBookings, isLoading: isCurrentLoading, error: currentError } = useGetCurrentBookingsQuery();
    const { data: upcomingBookings, isLoading: isUpcomingLoading, error: upcomingError } = useGetUpcomingBookingsQuery();



    const currentBooking = currentBookings && currentBookings.length > 0 ? currentBookings[0] : null;

    if (isCurrentLoading || isUpcomingLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <HomeSkeleton />
            </SafeAreaView>
        );
    }

    if ((currentError as any)?.status === 403 || (upcomingError as any)?.status === 403) {
        const { router } = require('expo-router');
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>Session Expired or Invalid</Text>
                <Text style={{ color: 'blue', fontSize: 16 }} onPress={() => router.replace('/(auth)/login')}>
                    Go to Login
                </Text>
            </SafeAreaView>
        );
    }

    const hasUpcoming = upcomingBookings && upcomingBookings.length > 0;
    const hasCurrent = !!currentBooking;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={upcomingBookings || []}
                renderItem={({ item }) => <UpcomingBookingItem item={item} />}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <>
                        {hasCurrent ? (
                            <CurrentBooking booking={currentBooking} />
                        ) : (
                            <View style={{ marginBottom: 20 }}>
                                <EmptyState
                                    title="لا يوجد حجز حالي"
                                    message="ليس لديك أي محاضرات أو معامل جارية الآن."
                                    icon="clock-outline"
                                />
                            </View>
                        )}
                        <Text style={[styles.upcomingHeader]}>حجوزاتك التالية</Text>
                    </>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="لا يوجد حجوزات قادمة"
                        message="ليس لديك أي حجوزات محددة في الوقت القريب."
                        icon="calendar-blank"
                    />
                )}
                contentContainerStyle={styles.listContent}
                style={styles.list}
            />
        </SafeAreaView>
    );
}
