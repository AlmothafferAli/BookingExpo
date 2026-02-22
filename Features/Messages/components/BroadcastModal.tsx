import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../styles';
import { Stage, Group } from '../types';
import { STAGE_LABELS } from '../constants';

interface BroadcastModalProps {
    visible: boolean;
    onClose: () => void;
    selectedStage: Stage;
    selectedGroup: Group;
}

export const BroadcastModal = ({ visible, onClose, selectedStage, selectedGroup }: BroadcastModalProps) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;

        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setMessage('');
            onClose();
            Alert.alert('تم الإرسال', 'تم إرسال التنبيه لجميع الطلاب بنجاح');
        }, 1500);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalKeyboardAvoiding}
                    >
                        <Animated.View
                            entering={FadeInDown.springify()}
                            style={styles.modalContent}
                        >
                            <View style={styles.modalHeader}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeButton}
                                >
                                    <MaterialCommunityIcons name="close" size={24} color="#94A3B8" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>إرسال تنبيه عام</Text>
                            </View>

                            <Text style={styles.modalSubtitle}>
                                سيتم إرسال هذا التنبيه لجميع طلاب {STAGE_LABELS[selectedStage]} المجموعة {selectedGroup === 'All' ? 'الكل' : selectedGroup}
                            </Text>

                            <TextInput
                                style={styles.broadcastInput}
                                placeholder="اكتب نص التنبيه هنا..."
                                multiline
                                textAlignVertical="top"
                                value={message}
                                onChangeText={setMessage}
                                placeholderTextColor="#94A3B8"
                            />

                            <TouchableOpacity
                                style={[
                                    styles.sendBroadcastButton,
                                    (!message.trim() || isSending) && styles.sendBroadcastButtonDisabled
                                ]}
                                onPress={handleSend}
                                disabled={!message.trim() || isSending}
                            >
                                {isSending ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <Text style={styles.sendBroadcastText}>إرسال الآن</Text>
                                        <MaterialCommunityIcons name="send-outline" size={20} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
