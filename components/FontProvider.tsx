import React, { createContext, useContext, useEffect } from 'react';
import {
    useFonts,
    Alexandria_100Thin,
    Alexandria_200ExtraLight,
    Alexandria_300Light,
    Alexandria_400Regular,
    Alexandria_500Medium,
    Alexandria_600SemiBold,
    Alexandria_700Bold,
    Alexandria_800ExtraBold,
    Alexandria_900Black,
} from '@expo-google-fonts/alexandria';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const FontContext = createContext<{ fontsLoaded: boolean }>({ fontsLoaded: false });

export const useFontContext = () => useContext(FontContext);

export default function FontProvider({ children }: { children: React.ReactNode }) {
    const [fontsLoaded, fontError] = useFonts({
        'Alexandria-Thin': Alexandria_100Thin,
        'Alexandria-ExtraLight': Alexandria_200ExtraLight,
        'Alexandria-Light': Alexandria_300Light,
        'Alexandria-Regular': Alexandria_400Regular,
        'Alexandria-Medium': Alexandria_500Medium,
        'Alexandria-SemiBold': Alexandria_600SemiBold,
        'Alexandria-Bold': Alexandria_700Bold,
        'Alexandria-ExtraBold': Alexandria_800ExtraBold,
        'Alexandria-Black': Alexandria_900Black,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
            if (fontsLoaded) console.log('Fonts loaded');
            if (fontError) console.error('Font loading error:', fontError);
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <FontContext.Provider value={{ fontsLoaded }}>
            <View style={{ flex: 1, direction: 'rtl' }}>
                {children}
            </View>
        </FontContext.Provider>
    );
};
