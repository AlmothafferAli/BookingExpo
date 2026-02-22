import { Room } from './types';

// Using the same placeholder image for all rooms as requested
const ROOM_IMAGE = require('@/assets/lecture_hall.png');
// Using the app's existing avatar for mock users
const USER_AVATAR = require('@/assets/avatar.png');

export const MOCK_ROOMS: Room[] = [
    {
        id: '1',
        name: 'قاعة 1',
        type: 'Lecture Hall',
        capacity: 100,
        status: 'booked',
        image: ROOM_IMAGE,
        booker: {
            name: 'د. سارة أحمد',
            avatar: USER_AVATAR,
            stage: 'المرحلة 3',
            group: 'Group A',
            timeRemaining: '45 دقيقة'
        },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        course: 'برمجة الحاسوب',
    },
    {
        id: '2',
        name: 'مختبر 1',
        type: 'Lab',
        capacity: 25,
        status: 'available',
        image: ROOM_IMAGE,
        booker: null,
        startTime: null,
        endTime: null,
        course: null,
    },
    {
        id: '3',
        name: 'قاعة 3',
        type: 'Lecture Hall',
        capacity: 60,
        status: 'booked',
        image: ROOM_IMAGE,
        booker: {
            name: 'م. يوسف خالد',
            avatar: USER_AVATAR,
            stage: 'المرحلة 2',
            group: 'Group B',
            timeRemaining: 'ساعة و 15 دقيقة'
        },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        course: 'هندسة البرمجيات',
    },
    {
        id: '4',
        name: 'مختبر 3',
        type: 'Lab',
        capacity: 20,
        status: 'available',
        image: ROOM_IMAGE,
        booker: null,
        startTime: null,
        endTime: null,
        course: null,
    },
    {
        id: '5',
        name: 'قاعة 5',
        type: 'Lecture Hall',
        capacity: 85,
        status: 'available',
        image: ROOM_IMAGE,
        booker: null,
        startTime: null,
        endTime: null,
        course: null,
    },
    {
        id: '6',
        name: 'مختبر 5',
        type: 'Lab',
        capacity: 15,
        status: 'booked',
        image: ROOM_IMAGE,
        booker: {
            name: 'د. محمد علي',
            avatar: USER_AVATAR,
            stage: 'المرحلة 1',
            group: 'Group A',
            timeRemaining: '15 دقيقة'
        },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 1800000).toISOString(),
        course: 'شبكات الحاسوب',
    },
    {
        id: '7',
        name: 'قاعة 6',
        type: 'Lecture Hall',
        capacity: 90,
        status: 'available',
        image: ROOM_IMAGE,
        booker: null,
        startTime: null,
        endTime: null,
        course: null,
    }
];

export const AVAILABLE_STAGES = ['المرحلة 1', 'المرحلة 2', 'المرحلة 3', 'المرحلة 4'];
export const AVAILABLE_GROUPS = ['Group A', 'Group B'];
