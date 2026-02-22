import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from '../../components/AppText';
import COLORS from '../../Base/constants';

export default function ExamsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText style={styles.headerTitle}>الامتحانات</AppText>
            </View>
            
            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={() => router.push('/exams/create')}
                >
                    <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                    <AppText style={styles.buttonText}>إنشاء امتحان جديد</AppText>
                </TouchableOpacity>

                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#CBD5E1" />
                    <AppText style={styles.emptyText}>لا توجد امتحانات حالياً</AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 124, 
        backgroundColor: COLORS.background,
        direction: 'ltr',
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Alexandria-Bold',
        color: COLORS.PrimarySlate,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.PrimarySlate,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: COLORS.PrimarySlate,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        marginTop: 16,
        color: '#94A3B8',
        fontFamily: 'Alexandria-Medium',
        fontSize: 16,
    },
});