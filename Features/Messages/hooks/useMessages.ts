import { useState, useMemo } from 'react';
import { ViewMode, Stage, Group, Contact } from '../types';
import { TEACHERS, STUDENTS_MOCK } from '../constants';

export const useMessages = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('teachers');
    const [selectedStage, setSelectedStage] = useState<Stage>('Stage 1');
    const [selectedGroup, setSelectedGroup] = useState<Group>('All');
    const [isBroadcastModalVisible, setIsBroadcastModalVisible] = useState(false);

    const filteredData = useMemo(() => {
        return viewMode === 'teachers'
            ? TEACHERS
            : STUDENTS_MOCK.filter(s =>
                s.stage === selectedStage && (selectedGroup === 'All' || s.group === selectedGroup)
            );
    }, [viewMode, selectedStage, selectedGroup]);

    return {
        viewMode,
        setViewMode,
        selectedStage,
        setSelectedStage,
        selectedGroup,
        setSelectedGroup,
        isBroadcastModalVisible,
        setIsBroadcastModalVisible,
        filteredData
    };
};
