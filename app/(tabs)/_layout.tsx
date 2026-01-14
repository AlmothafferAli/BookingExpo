import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="Search" />
            <Tabs.Screen name="Calendar" />
            <Tabs.Screen name="Home" />
            <Tabs.Screen name="Messages" />
            <Tabs.Screen name="Profile" />
        </Tabs>
    );
}
