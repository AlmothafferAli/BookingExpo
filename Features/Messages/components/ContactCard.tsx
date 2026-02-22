import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../../Base/constants';
import { Contact } from '../types';

interface ContactCardProps {
    contact: Contact;
    onPress: (contact: Contact) => void;
}

export const ContactCard = ({ contact, onPress }: ContactCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(contact)}>
            <View style={styles.avatarContainer}>
                <Image source={contact.avatar || require('@/assets/avatar.png')} style={styles.avatar} />
                {contact.isOnline && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.details}>
                    {contact.role === 'teacher'
                        ? contact.department
                        : `${contact.stage} - Group ${contact.group}`}
                </Text>
            </View>

            <View style={styles.actionContainer}>
                <View style={styles.iconButton}>
                    <MaterialCommunityIcons name="message-text-outline" size={20} color={COLORS.PrimarySlate} />
                </View>
                {!contact.isOnline && contact.lastSeen && (
                    <Text style={styles.lastSeen}>{contact.lastSeen}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24, // More rounded for modern look
        padding: 16,
        paddingHorizontal: 20,
        marginBottom: 16, // Matching Home spacing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(241, 245, 249, 0.5)',
    },
    avatarContainer: {
        position: 'relative',
        marginLeft: 18,
    },
    avatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#F1F5F9',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981', // More vibrant emerald green
        borderWidth: 2,
        borderColor: '#FFF',
    },
    infoContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    name: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 17,
        color: COLORS.PrimarySlate,
        marginBottom: 2,
        textAlign: 'right',
    },
    details: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 13,
        color: '#64748B',
        textAlign: 'right',
    },
    actionContainer: {
        alignItems: 'center',
        marginRight: 4,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FBFDFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    lastSeen: {
        fontFamily: 'Alexandria-Light',
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
    },
});
