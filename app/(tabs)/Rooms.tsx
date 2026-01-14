import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../Base/constants';

// Data & Components
import { MOCK_ROOMS, AVAILABLE_STAGES, AVAILABLE_GROUPS } from '../../Features/Rooms/data/mockData';
import { useRoomFilters } from '../../Features/Rooms/data/useRoomFilters';
import { RoomCard } from '../../Features/Rooms/components/RoomCard';

export default function RoomsScreen() {
    const insets = useSafeAreaInsets();
    const { bookedRooms, availableRooms, updateFilter, filters } = useRoomFilters(MOCK_ROOMS);

    const [activeTab, setActiveTab] = useState<'available' | 'booked'>('available');
    const [showFilters, setShowFilters] = useState(false);

    // Filter Logic based on Active Tab
    const currentList = activeTab === 'available' ? availableRooms : bookedRooms;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity
                        style={[styles.iconButton, showFilters && styles.iconButtonActive]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <MaterialCommunityIcons
                            name="tune-variant"
                            size={24}
                            color={showFilters ? '#FFF' : COLORS.PrimarySlate}
                        />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.screenTitle}>القاعات الدراسية</Text>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </Text>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'booked' && styles.activeTab]}
                        onPress={() => setActiveTab('booked')}
                    >
                        <Text style={[styles.tabText, activeTab === 'booked' && styles.activeTabText]}>محجوزة ({bookedRooms.length})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                        onPress={() => setActiveTab('available')}
                    >
                        <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>متاحة ({availableRooms.length})</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Collapsible Filters */}
            {showFilters && (
                <View style={styles.filtersWrapper}>
                    <Text style={styles.filterLabel}>تصفية حسب:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={{ flexDirection: 'row-reverse' }}>
                        {AVAILABLE_STAGES.map(stage => (
                            <TouchableOpacity
                                key={stage}
                                style={[styles.filterChip, filters.stage === stage && styles.filterChipActive]}
                                onPress={() => updateFilter('stage', filters.stage === stage ? null : stage)}
                            >
                                <Text style={[styles.filterChipText, filters.stage === stage && styles.filterChipTextActive]}>{stage}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Main Content List */}
            <FlatList
                data={currentList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <RoomCard room={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>لا توجد نتائج</Text>
                        <Text style={styles.emptySubtitle}>
                            {activeTab === 'available'
                                ? 'لا توجد قاعات متاحة تطابق بحثك حالياً'
                                : 'لا توجد قاعات مشغولة حالياً'}
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
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        backgroundColor: '#F8F9FB',
        paddingHorizontal: 24,
        paddingBottom: 16,
        paddingTop: 12,
        zIndex: 10,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    titleContainer: {
        alignItems: 'flex-end',
    },
    screenTitle: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 32,
        color: COLORS.PrimarySlate,
    },
    dateText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    iconButton: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#FFF',
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
        fontSize: 14,
        color: '#64748B',
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
        fontFamily: 'Alexandria-Medium',
        color: '#94A3B8',
        marginBottom: 8,
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
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        maxWidth: '80%',
    },
});
