import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../Base/constants';

// Data & Components
import { useGetRoomsQuery, useGetBookedRoomsQuery, useGetFiltersQuery } from '../../Features/Rooms/data/roomSlice';
import { RoomCard } from '../../Features/Rooms/components/RoomCard';
import { ActivityIndicator } from 'react-native';

export default function RoomsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'available' | 'booked'>('available');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{ stage: string | null; group: string | null }>({
        stage: null,
        group: null,
    });

    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [selectedDate, setSelectedDate] = useState(tomorrow);

    const { data: availableRooms, isLoading: isAvailableLoading, isFetching: isAvailableFetching } = useGetRoomsQuery({
        status: 'available',
        stage: filters.stage || undefined,
        group: filters.group || undefined,
    }, { skip: activeTab !== 'available' });

    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const { data: bookedRooms, isLoading: isBookedLoading, isFetching: isBookedFetching } = useGetBookedRoomsQuery({
        date: formattedDate,
        stageName: filters.stage || undefined,
        groupName: filters.group || undefined,
    }, { skip: activeTab !== 'booked' });

    const rooms = activeTab === 'available' ? availableRooms : bookedRooms;
    const isLoading = activeTab === 'available' ? isAvailableLoading : isBookedLoading;
    const isFetching = activeTab === 'available' ? isAvailableFetching : isBookedFetching;

    const { data: filterOptions } = useGetFiltersQuery();

    const updateFilter = (type: 'stage' | 'group', value: string | null) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    // Generate days for the pretty picker
    const generateDays = () => {
        const days = [];
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const calendarDays = generateDays();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header Content (The main global header handles the date/belt/avatar) */}
            <View style={styles.header}>
                {/* Local Title and Filter Row */}
                <View style={styles.headerMainRow}>
                    <TouchableOpacity
                        style={[styles.iconButton, showFilters && styles.iconButtonActive]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <MaterialCommunityIcons
                            name="tune-variant"
                            size={22}
                            color={showFilters ? '#FFF' : COLORS.PrimarySlate}
                        />
                    </TouchableOpacity>

                    <Text style={styles.mainTitle}>القاعات الدراسية</Text>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'booked' && styles.activeTab]}
                        onPress={() => setActiveTab('booked')}
                    >
                        <Text style={[styles.tabText, activeTab === 'booked' && styles.activeTabText]}>
                            محجوزة {bookedRooms && activeTab === 'booked' ? `(${bookedRooms.length})` : ''}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                        onPress={() => setActiveTab('available')}
                    >
                        <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                            متاحة {availableRooms && activeTab === 'available' ? `(${availableRooms.length})` : ''}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Pretty Day Picker */}
            {activeTab === 'booked' && (
                <View style={styles.dayPickerContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dayPickerScroll}
                        style={{ flexDirection: 'row' }}
                    >
                        {calendarDays.map((date) => {
                            const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth();
                            return (
                                <TouchableOpacity
                                    key={date.toISOString()}
                                    style={[styles.dayChip, isSelected && styles.dayChipActive]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.dayTextActive]}>
                                        {date.toLocaleDateString('ar-EG', { weekday: 'short' })}
                                    </Text>
                                    <Text style={[styles.dayNumber, isSelected && styles.dayTextActive]}>
                                        {date.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* Collapsible Filters */}
            {showFilters && filterOptions && (
                <View style={styles.filtersWrapper}>
                    <Text style={styles.filterLabel}>تصفية حسب:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={{ flexDirection: 'row-reverse' }}>
                        {filterOptions.stages.map(stage => (
                            <TouchableOpacity
                                key={stage}
                                style={[styles.filterChip, filters.stage === stage && styles.filterChipActive]}
                                onPress={() => updateFilter('stage', filters.stage === stage ? null : stage)}
                            >
                                <Text style={[styles.filterChipText, filters.stage === stage && styles.filterChipTextActive]}>{stage}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={{ flexDirection: 'row-reverse', marginTop: 10 }}>
                        {filterOptions.groups.map(group => (
                            <TouchableOpacity
                                key={group}
                                style={[styles.filterChip, filters.group === group && styles.filterChipActive]}
                                onPress={() => updateFilter('group', filters.group === group ? null : group)}
                            >
                                <Text style={[styles.filterChipText, filters.group === group && styles.filterChipTextActive]}>{group}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Loading Indicator */}
            {(isLoading || isFetching) && !rooms && (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="large" color={COLORS.PrimarySlate} />
                </View>
            )}

            {/* Main Content List */}
            <FlatList
                data={rooms || []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <RoomCard
                        room={item}
                        stageName={filters.stage || ''}
                        groupName={filters.group || ''}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>لا توجد نتائج</Text>
                        <Text style={styles.emptySubtitle}>
                            {activeTab === 'available'
                                ? 'لا توجد قاعات متاحة تطابق بحثك حالياً'
                                : `لا توجد قاعات مشغولة في تاريخ ${selectedDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}`}
                        </Text>
                    </View>
                }
                // Bottom padding for tab bar
                ListFooterComponent={<View style={{ height: 100 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        direction: 'ltr',
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        backgroundColor: '#F8F9FB',
        paddingHorizontal: 24,
        paddingBottom: 16,
        paddingTop: 8,
        zIndex: 10,
        marginTop: 80, // Increased to clear the centered date in the global header
    },
    headerMainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    mainTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 24,
        color: COLORS.PrimarySlate,
        textAlign: 'right',
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconButtonActive: {
        backgroundColor: COLORS.PrimarySlate,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 13,
        color: '#94A3B8',
    },
    activeTabText: {
        color: COLORS.PrimarySlate,
        fontFamily: 'Alexandria-Bold',
    },
    filtersWrapper: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    filterLabel: {
        textAlign: 'right',
        fontFamily: 'Alexandria-Bold',
        color: COLORS.PrimarySlate,
        fontSize: 14,
        marginBottom: 12,
        opacity: 0.8,
    },
    filterScroll: {
        paddingBottom: 8,
        flexDirection: 'row-reverse',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: COLORS.PrimarySlate,
        borderColor: COLORS.PrimarySlate,
    },
    filterChipText: {
        fontFamily: 'Alexandria-Medium',
        color: '#64748B',
        fontSize: 12,
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 20,
        color: COLORS.PrimarySlate,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: '75%',
    },
    dayPickerContainer: {
        backgroundColor: '#F8F9FB',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    dayPickerScroll: {
        paddingHorizontal: 24,
        gap: 12,
    },
    dayChip: {
        width: 60,
        height: 70,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    dayChipActive: {
        backgroundColor: COLORS.PrimarySlate,
        borderColor: COLORS.PrimarySlate,
    },
    dayName: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 2,
    },
    dayNumber: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        color: COLORS.PrimarySlate,
    },
    dayTextActive: {
        color: '#FFF',
    },
});
