import { Client, Message } from '@stomp/stompjs';
import { WsUrl } from './types/Urls';
import { secureStore } from './secureStore';

export interface ChatMessageDto {
    id?: string;
    senderId?: string;
    senderName?: string;
    recipientId?: string;
    courseId?: string;
    content: string;
    timestamp?: string;
    type?: "CHAT" | "JOIN" | "LEAVE";
    isMine?: boolean;
}

class SocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, any> = new Map();
    private onMessageCallback: ((message: ChatMessageDto) => void) | null = null;

    private connectPromise: Promise<void> | null = null;

    async connect() {
        if (this.client?.active && this.connectPromise) {
            return this.connectPromise;
        }

        const token = await secureStore.getToken();
        
        this.connectPromise = new Promise((resolve, reject) => {
            this.client = new Client({
                brokerURL: WsUrl,
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                debug: (str: string) => console.log('[STOMP] ' + str),
                reconnectDelay: 5000,
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,
                forceBinaryWSFrames: true,
                appendMissingNULLonIncoming: true,
            });

            this.client.onConnect = (frame) => {
                console.log('[STOMP] Connected', frame);
                resolve();
            };

            this.client.onStompError = (frame: any) => {
                console.error('[STOMP] Broker error: ' + frame.headers['message']);
                console.error('[STOMP] Details: ' + frame.body);
                reject(frame);
            };

            this.client.onWebSocketClose = (event) => {
                console.log('[STOMP] WebSocket Closed', event);
                this.connectPromise = null;
            };

            this.client.onWebSocketError = (event) => {
                console.error('[STOMP] WebSocket Error', event);
            };

            this.client.onDisconnect = (frame) => {
                console.log('[STOMP] Disconnected', frame);
            };

            this.client.activate();
        });

        return this.connectPromise;
    }

    async subscribeToPrivateMessages(key: string, callback: (msg: ChatMessageDto) => void) {
        if (!this.client?.active) {
            await this.connect();
        }
        
        // Wait until connected property is true, up to 5 seconds
        let waitCount = 0;
        while (this.client && !this.client.connected && waitCount < 50) {
            await new Promise(r => setTimeout(r, 100));
            waitCount++;
        }

        if (this.client && !this.client.connected) {
            console.error(`[SocketService] Timeout waiting for STOMP connection to subscribe: ${key}`);
            return;
        }

        if (!this.client) return;

        const destination = `/user/queue/messages`;
        const subKey = `${destination}_${key}`;
        
        if (this.subscriptions.has(subKey)) {
            this.subscriptions.get(subKey).unsubscribe();
        }

        const sub = this.client.subscribe(destination, (message: Message) => {
            const chatMsg: ChatMessageDto = JSON.parse(message.body);
            callback(chatMsg);
        });

        this.subscriptions.set(subKey, sub);
    }

    async subscribeToCourseMessages(courseId: string, key: string, callback: (msg: ChatMessageDto) => void) {
        if (!this.client?.active) {
            await this.connect();
        }

        let waitCount = 0;
        while (this.client && !this.client.connected && waitCount < 50) {
            await new Promise(r => setTimeout(r, 100));
            waitCount++;
        }

        if (this.client && !this.client.connected) {
             console.error(`[SocketService] Timeout waiting for STOMP connection to subscribe course: ${key}`);
             return;
        }

        if (!this.client) return;

        const destination = `/topic/course/${courseId}`;
        const subKey = `${destination}_${key}`;

        if (this.subscriptions.has(subKey)) {
            this.subscriptions.get(subKey).unsubscribe();
        }

        const sub = this.client.subscribe(destination, (message: Message) => {
            const chatMsg: ChatMessageDto = JSON.parse(message.body);
            callback(chatMsg);
        });

        this.subscriptions.set(subKey, sub);
    }

    async sendMessage(message: ChatMessageDto) {
        console.log("[SocketService] sendMessage triggered with:", message);
        if (!this.client?.active) {
            console.log("[SocketService] Client not active. Reconnecting...");
            await this.connect();
        }

        console.log("[SocketService] Waiting for client to be connected...");
        let waitCount = 0;
        while (this.client && !this.client.connected && waitCount < 50) {
            await new Promise(r => setTimeout(r, 100));
            waitCount++;
        }

        if (this.client && !this.client.connected) {
            console.error('[STOMP] Timeout: Cannot send message, STOMP connection never established.');
            return;
        }

        const payload = {
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({ ...message, type: message.type || 'CHAT' }),
        };
        console.log("[SocketService] Sending payload to Destination:", payload.destination, payload.body);
        
        this.client!.publish(payload);
        console.log("[SocketService] Publish executed.");
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
        this.subscriptions.clear();
        this.connectPromise = null;
    }

    unsubscribe(key: string) {
        for (const [subKey, sub] of this.subscriptions.entries()) {
            if (subKey.endsWith(`_${key}`)) {
                sub.unsubscribe();
                this.subscriptions.delete(subKey);
            }
        }
    }
}

export const socketService = new SocketService();
