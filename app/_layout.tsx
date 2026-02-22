
import '../global.css';

import { Stack } from "expo-router";
import FontProvider from '../components/FontProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { store } from '../Base/store';

import { useGetMyCoursesQuery } from '../Features/Rooms/data/bookingSlice';

function RootContent() {
    // Prefetch courses for caching on mount
    useGetMyCoursesQuery();

    return (
        <SafeAreaProvider>
            <FontProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/Registration" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="chat/[id]" options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 200 }} />
                    <Stack.Screen name="(tabs)/MyStudents" options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 200 }} />
                    <Stack.Screen name="exams/create" options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 200 }} />
                </Stack>
            </FontProvider>
        </SafeAreaProvider>
    );
}

export default function Layout() {
	console.log("Rendering Layout");
	return (
		<Provider store={store}>
			<RootContent />
		</Provider>
	);
}
