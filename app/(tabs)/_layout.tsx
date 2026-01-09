import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../Base/constants';
import { View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.PrimarySlate,
                headerShown: false,
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderTopWidth: 0,
                    backgroundColor: '#FFF',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 10,
                },
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'الرئيسية',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
