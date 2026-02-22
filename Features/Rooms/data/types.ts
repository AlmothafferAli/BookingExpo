export type RoomStatus = 'booked' | 'available';

export interface BookerInfo {
    id: string;
    name: string;
    avatar: string;
    stage: string;
    group: string;
    timeRemaining: string;
}

export interface Room {
    id: string;
    name: string;
    type: string;
    capacity: number;
    status: RoomStatus;
    booker: BookerInfo | null;
    image: string;
    startTime: string | null;
    endTime: string | null;
    course: string | null;
}

export type FilterState = {
    stage: string | null;
    group: string | null;
};
