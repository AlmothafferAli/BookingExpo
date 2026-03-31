import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    Pressable,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import COLORS from '../../Base/constants';
import { MOCK_MESSAGES } from '../../Features/Chat/data/mockData';
import { TEACHERS, STUDENTS_MOCK } from '../../Features/Messages/constants';
import Animated, {
    FadeInUp,
    FadeInDown,
    SlideInRight,
    SlideInLeft,
    Layout
} from 'react-native-reanimated';
import { socketService, ChatMessageDto } from '../../Base/SocketService';
import { useGetPrivateHistoryQuery, useGetCourseHistoryQuery } from '../../Features/Chat/chatApi';
import { secureStore } from '../../Base/secureStore';
import { useEffect } from 'react';

export default function ChatScreen() {
    const { id, isCourse } = useLocalSearchParams<{ id: string, isCourse?: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [inputText, setInputText] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const flatListRef = useRef<FlatList>(null);

    // Fetch history
    const { data: historyData, isLoading: historyLoading } = isCourse === 'true'
        ? useGetCourseHistoryQuery(id!) 
        : useGetPrivateHistoryQuery(id!);

    // Load history into state
    useEffect(() => {
        if (historyData) {
            setMessages(historyData);
        }
    }, [historyData]);

    // Setup Socket
    useEffect(() => {
        const initChat = async () => {
            const user = await secureStore.getUser();
            setCurrentUser(user);

            await socketService.connect();

            const onNewMessage = (msg: ChatMessageDto) => {
                console.log("=== onNewMessage received from socket ===", msg);
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) {
                        console.log("Message already exists in state, ignoring.", msg.id);
                        return prev;
                    }
                    console.log("Adding new message to state:", msg.id);
                    return [...prev, msg];
                });
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            };

            if (user?.id) {
                await socketService.subscribeToPrivateMessages('ChatScreen', onNewMessage);
            }

            if (isCourse === 'true') {
                await socketService.subscribeToCourseMessages(id!, 'ChatScreen', onNewMessage);
            }
        };

        initChat();

        return () => {
            socketService.unsubscribe('ChatScreen');
        };
    }, [id, isCourse]);

    // @ts-ignore
    const contact = [...TEACHERS, ...STUDENTS_MOCK].find(c => c.id === id) || { name: isCourse === 'true' ? 'Course Chat' : 'User', isOnline: false };

    const handleSend = async () => {
        console.log("=== handleSend triggered ===");
        console.log("Input text before trim:", `"${inputText}"`);
        if (inputText.trim() === '') {
            console.log("Input text is empty after trim. Returning early.");
            return;
        }

        const message: ChatMessageDto = {
            content: inputText,
            recipientId: isCourse === 'true' ? undefined : id,
            courseId: isCourse === 'true' ? id : undefined,
        };
        console.log("Message object ready to send:", message);

        try {
            console.log("Sending via socketService...");
            await socketService.sendMessage(message);
            console.log("socketService.sendMessage completed.");
            setInputText('');
            console.log("Input text cleared.");
        } catch (error) {
            console.error("Error in handleSend:", error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const message: ChatMessageDto = {
                content: result.assets[0].uri, // For now using content for URI, or you can add imageUrl to DTO
                recipientId: isCourse === 'true' ? undefined : id,
                courseId: isCourse === 'true' ? id : undefined,
            };
            // socketService.sendMessage(message); 
            // Optimistic update or wait for socket
        }
    };

    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
        });

        if (!result.canceled) {
            const message: ChatMessageDto = {
                content: result.assets[0].name,
                recipientId: isCourse === 'true' ? undefined : id,
                courseId: isCourse === 'true' ? id : undefined,
            };
            // socketService.sendMessage(message);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessageDto }) => {
        // Use the backend-provided 'isMine' property, falling back to senderId comparison if missing
        const isMe = item.isMine !== undefined ? item.isMine : item.senderId === currentUser?.id;

        return (
            <Animated.View
                entering={isMe ? SlideInRight.delay(100) : SlideInLeft.delay(100)}
                style={[
                    styles.messageRow,
                    isMe ? styles.myMessageRow : styles.otherMessageRow
                ]}
            >
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myBubble : styles.otherBubble
                ]}>
                    <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <BlurView intensity={80} tint="light" style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.PrimarySlate} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{contact.name}</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.headerStatus}>
                             {/* @ts-ignore */}
                            {contact.isOnline ? 'متصل الآن' : (contact.lastSeen || 'غير متصل')}
                        </Text>
                        {/* @ts-ignore */}
                        {contact.isOnline && <View style={styles.onlineDot} />}
                    </View>
                </View>

                {/* @ts-ignore */}
                <Image source={contact.avatar || require('@/assets/avatar.png')} style={styles.headerAvatar} />
            </BlurView>

            {/* Chat List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                style={styles.keyboardAvoiding}
            >
                <BlurView intensity={90} tint="light" style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity style={styles.attachButton} onPress={pickFile}>
                            <MaterialCommunityIcons name="paperclip" size={22} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                            <MaterialCommunityIcons name="image-outline" size={22} color="#64748B" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="اكتب رسالتك هنا..."
                            placeholderTextColor="#94A3B8"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
                        onPress={() => {
                            console.log("=== SEND BUTTON PRESSED ===");
                            handleSend();
                        }}
                        disabled={inputText.trim() === ''}
                    >
                        <MaterialCommunityIcons name="send" size={22} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                </BlurView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10,
    },
    backButton: {
        padding: 5,
    },
    headerAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginLeft: 12,
    },
    headerInfo: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 10,
    },
    headerName: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        color: COLORS.PrimarySlate,
    },
    headerStatus: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 12,
        color: '#64748B',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginLeft: 6,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    messageRow: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    myMessageRow: {
        justifyContent: 'flex-start', // RTL issues in React Native, we handle with styles
        flexDirection: 'row-reverse',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: COLORS.PrimarySlate,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    messageText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.PrimarySlate,
        textAlign: 'right',
    },
    myMessageText: {
        color: '#FFF',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginVertical: 5,
    },
    timestamp: {
        fontFamily: 'Alexandria-Light',
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 6,
        textAlign: 'left',
    },
    myTimestamp: {
        color: 'rgba(255,255,255,0.7)',
    },
    fileContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 10,
        borderRadius: 12,
        marginTop: 5,
    },
    fileName: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 13,
        marginRight: 10,
        color: COLORS.PrimarySlate,
    },
    inputContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    input: {
        flex: 1,
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'right',
        maxHeight: 100,
    },
    attachButton: {
        padding: 5,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.PrimarySlate,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.PrimarySlate,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    sendButtonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowOpacity: 0,
    },
    keyboardAvoiding: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
