export type RoomStatus = 'booked' | 'available';

export interface BookerInfo {
    name: string;
    avatar: any; // Image source
    stage: string;
    group: string;
    timeRemaining: string; // e.g., "45 min"
}

export interface Room {
    id: string;
    name: string;
    type: 'Lecture Hall' | 'Lab';
    capacity: number;
    status: RoomStatus;
    booker?: BookerInfo;
    image: any; // Image source
}

export type FilterState = {
    stage: string | null;
    group: string | null;
};
