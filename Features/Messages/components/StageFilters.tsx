import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { Stage, Group } from '../types';
import { ALL_STAGES, STAGE_LABELS } from '../constants';

interface StageFiltersProps {
    selectedStage: Stage;
    onStageSelect: (stage: Stage) => void;
    selectedGroup: Group;
    onGroupSelect: (group: Group) => void;
}

export const StageFilters = ({ selectedStage, onStageSelect, selectedGroup, onGroupSelect }: StageFiltersProps) => (
    <View style={styles.filterContainer}>
        <View style={styles.stageScrollWrapper}>
            <Text style={styles.filterLabel}>المرحلة الدراسية</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stageScroll}
                style={{ flexDirection: 'row-reverse' }}
            >
                {ALL_STAGES.map((stage) => (
                    <TouchableOpacity
                        key={stage}
                        style={[styles.stageChip, selectedStage === stage && styles.stageChipActive]}
                        onPress={() => onStageSelect(stage)}
                    >
                        <Text style={[styles.stageText, selectedStage === stage && styles.stageTextActive]}>
                            {STAGE_LABELS[stage]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        <View style={styles.groupWrapper}>
            <Text style={styles.filterLabel}>المجموعة</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupScroll}
                style={{ flexDirection: 'row-reverse' }}
            >
                {['All', 'A', 'B', 'C', 'D'].map((group) => (
                    <TouchableOpacity
                        key={group}
                        style={[styles.groupChip, selectedGroup === group && styles.groupChipActive]}
                        onPress={() => onGroupSelect(group as Group)}
                    >
                        <Text style={[styles.groupText, selectedGroup === group && styles.groupTextActive]}>
                            {group === 'All' ? 'الكل' : group}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    </View>
);
