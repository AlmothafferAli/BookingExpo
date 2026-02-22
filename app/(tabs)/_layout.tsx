import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { CustomTabBar } from '../../components/CustomTabBar';
import { Header } from '../../Features/Home/components/Header';

export default function TabLayout() {
    return (
        <>
            <Header />
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
                <Tabs.Screen name="MyStudents" />
            </Tabs>
        </>
    );
}
