
import '../global.css';

import { Stack } from "expo-router";
import FontProvider from '../components/FontProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
	return (
		<SafeAreaProvider>
			<FontProvider>
				<Stack>
					<Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
					<Stack.Screen name="(auth)/Registration" options={{ headerShown: false }} />
					<Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</FontProvider>
		</SafeAreaProvider>
	);
}
