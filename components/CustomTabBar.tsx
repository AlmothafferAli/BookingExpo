import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Svg, { Path, G } from 'react-native-svg';
import { TabButton, TabItem } from './TabButton';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70;
const HEXAGON_SIZE = 70;

// Initial Configuration
const INITIAL_TABS: TabItem[] = [
    { name: 'My Content', icon: 'folder-multiple-outline', route: 'Rooms', key: 'Rooms' },
    { name: 'Calendar', icon: 'calendar-month-outline', route: 'Calendar', key: 'Calendar' },
    { name: 'Home', icon: 'home-outline', route: 'Home', key: 'Home' }, // Initial Center
    { name: 'Messages', icon: 'message-processing-outline', route: 'Messages', key: 'Messages' },
    { name: 'MyStudents', icon: 'account-outline', route: 'MyStudents', key: 'MyStudents' },
];

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [displayTabs, setDisplayTabs] = useState<TabItem[]>(INITIAL_TABS);
    const currentRouteName = state.routes[state.index].name;

    const handleTabPress = (tabIndex: number) => {
        const selectedTab = displayTabs[tabIndex];
        const isMiddle = tabIndex === 2;

        const event = navigation.emit({
            type: 'tabPress',
            target: state.routes.find(r => r.name === selectedTab.route)?.key || '',
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.navigate(selectedTab.route);
        }

        if (!isMiddle) {
            // Swap logic: Selected item becomes middle (index 2)
            const newTabs = [...displayTabs];
            const middleTab = newTabs[2];

            newTabs[2] = selectedTab;
            newTabs[tabIndex] = middleTab;

            setDisplayTabs(newTabs);
        }
    };

    // Auto-sync if external navigation happens
    useEffect(() => {
        const activeIndex = displayTabs.findIndex(t => t.route === currentRouteName);
        if (activeIndex !== -1 && activeIndex !== 2) {
            const newTabs = [...displayTabs];
            const centerTab = newTabs[2];
            newTabs[2] = newTabs[activeIndex];
            newTabs[activeIndex] = centerTab;
            setDisplayTabs(newTabs);
        }
    }, [currentRouteName]);

    return (
        <View style={styles.container}>
            {/* Layer 1: Static Backgrounds */}
            <View pointerEvents="none" style={styles.staticLayer}>
                {/* White Pill Background */}
                <View style={styles.backgroundPill} />

                {/* Floating Hexagon (Static Position) */}
                <View style={styles.hexagonWrapper}>
                    <Svg width="93" height="99" viewBox="0 0 93 99" fill="none">
                        <G>
                            <Path d="M39.177 11.3398C42.271 9.55343 46.083 9.55343 49.177 11.3398L70.3539 23.5663C73.4479 25.3526 75.3539 28.6538 75.3539 32.2265V56.6795C75.3539 60.2522 73.4479 63.5534 70.3539 65.3398L49.177 77.5663C46.083 79.3526 42.271 79.3526 39.177 77.5663L18.0001 65.3398C14.9061 63.5534 13.0001 60.2522 13.0001 56.6795V32.2265C13.0001 28.6538 14.9061 25.3526 18.0001 23.5663L39.177 11.3398Z" fill="#2A4A7C" />
                        </G>
                    </Svg>
                </View>
            </View>

            {/* Layer 2: Animated Icons */}
            <View style={styles.iconsLayer}>
                {displayTabs.map((tab, index) => {
                    const isMiddle = index === 2;
                    const isActive = tab.route === currentRouteName;

                    return (
                        <TabButton
                            key={tab.key}
                            tab={tab}
                            isMiddle={isMiddle}
                            isActive={isActive}
                            onPress={() => handleTabPress(index)}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        height: TAB_BAR_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    staticLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundPill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: TAB_BAR_HEIGHT,
        backgroundColor: '#FFF',
        borderRadius: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    hexagonWrapper: {
        position: 'absolute',
        bottom: TAB_BAR_HEIGHT - (HEXAGON_SIZE / 1.1), // Center geometrically roughly
        marginBottom: 0, // Tweak to align
        marginLeft: 4, // Visual correction for SVG path asymmetry
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    iconsLayer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Align bottom to match the pill
        paddingHorizontal: 10,
    },
});
