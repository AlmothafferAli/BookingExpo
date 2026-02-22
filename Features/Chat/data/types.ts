export interface Message {
    id: string;
    senderId: 'me' | string;
    text?: string;
    imageUrl?: string;
    fileName?: string;
    fileUrl?: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}
