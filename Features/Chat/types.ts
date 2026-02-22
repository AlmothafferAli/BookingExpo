import { Contact } from '../Messages/types';

export interface Message {
    id: string;
    senderId: string;
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

export interface ChatThread {
    contact: Contact;
    messages: Message[];
}
