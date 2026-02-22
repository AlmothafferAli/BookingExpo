import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { Contact } from '../../Features/Messages/types';
import { STAGE_LABELS } from '../../Features/Messages/constants';
import { ContactCard } from '../../Features/Messages/components/ContactCard';
import { MessageToggle } from '../../Features/Messages/components/MessageToggle';
import { StageFilters } from '../../Features/Messages/components/StageFilters';
import { BroadcastButton } from '../../Features/Messages/components/BroadcastButton';
import { BroadcastModal } from '../../Features/Messages/components/BroadcastModal';
import { useMessages } from '../../Features/Messages/hooks/useMessages';
import { styles } from '../../Features/Messages/styles';

export default function MessagesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const {
        viewMode,
        setViewMode,
        selectedStage,
        setSelectedStage,
        selectedGroup,
        setSelectedGroup,
        isBroadcastModalVisible,
        setIsBroadcastModalVisible,
        filteredData
    } = useMessages();

    const handleContactPress = (contact: Contact) => {
        router.push(`/chat/${contact.id}`);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 100).springify()} layout={Layout.springify()}>
                        <ContactCard contact={item} onPress={handleContactPress} />
                    </Animated.View>
                )}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.headerComponent}>
                        <MessageToggle
                            viewMode={viewMode}
                            onToggle={setViewMode}
                        />

                        {viewMode === 'students' && (
                            <View>
                                <StageFilters
                                    selectedStage={selectedStage}
                                    onStageSelect={setSelectedStage}
                                    selectedGroup={selectedGroup}
                                    onGroupSelect={setSelectedGroup}
                                />
                                <BroadcastButton
                                    onPress={() => setIsBroadcastModalVisible(true)}
                                />
                            </View>
                        )}

                        <Text style={styles.sectionLabel}>
                            {viewMode === 'teachers' ? 'المعلمون المسجلون' : `طلاب ${STAGE_LABELS[selectedStage]}`}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="account-search-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyText}>لا يوجد مستخدمين</Text>
                    </View>
                }
            />

            <BroadcastModal
                visible={isBroadcastModalVisible}
                onClose={() => setIsBroadcastModalVisible(false)}
                selectedStage={selectedStage}
                selectedGroup={selectedGroup}
            />
        </View>
    );
}
