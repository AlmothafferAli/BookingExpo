import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface MessageToggleProps {
    viewMode: 'teachers' | 'students';
    onToggle: (mode: 'teachers' | 'students') => void;
}

export const MessageToggle = ({ viewMode, onToggle }: MessageToggleProps) => (
    <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'students' && styles.toggleButtonActive]}
                onPress={() => onToggle('students')}
            >
                <Text style={[styles.toggleText, viewMode === 'students' && styles.toggleTextActive]}>الطلاب</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'teachers' && styles.toggleButtonActive]}
                onPress={() => onToggle('teachers')}
            >
                <Text style={[styles.toggleText, viewMode === 'teachers' && styles.toggleTextActive]}>المعلمون</Text>
            </TouchableOpacity>
        </View>
    </View>
);
