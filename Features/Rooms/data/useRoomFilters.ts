import { useState, useMemo } from 'react';
import { Room, FilterState } from './types';

export const useRoomFilters = (rooms: Room[]) => {
    const [filters, setFilters] = useState<FilterState>({
        stage: null,
        group: null,
    });

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            // If stage/group is selected, prioritize rooms that match user's criteria (mock logic)
            // For now, we just pass everything, but in a real app this would query the backend
            // or filter based on schedule relation.

            // Example Logic: If filtering by Group A, show rooms booked by Group A or Available rooms
            if (filters.group && room.booker?.group && room.booker.group !== filters.group) {
                return false;
            }
            if (filters.stage && room.booker?.stage && room.booker.stage !== filters.stage) {
                return false;
            }

            return true;
        });
    }, [rooms, filters]);

    const bookedRooms = filteredRooms.filter(r => r.status === 'booked');
    const availableRooms = filteredRooms.filter(r => r.status === 'available');

    const updateFilter = (key: keyof FilterState, value: string | null) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return {
        filters,
        updateFilter,
        bookedRooms,
        availableRooms,
    };
};
