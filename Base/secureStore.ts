import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const isWeb = Platform.OS === 'web';

const checkAvailability = async () => {
    if (isWeb) return false;
    const available = await SecureStore.isAvailableAsync();
    if (!available) {
        console.error('SecureStore is not available. Please ensure you are using a compatible device and your Development Client is up to date.');
    }
    return available;
};

export const secureStore = {
    async setToken(token: string) {
        if (isWeb) {
            localStorage.setItem(TOKEN_KEY, token);
            return;
        }

        if (await checkAvailability()) {
            console.log('[SecureStore] Setting token:', token.substring(0, 10) + '...');
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    },

    async getToken() {
        if (isWeb) {
            return localStorage.getItem(TOKEN_KEY);
        }

        if (await checkAvailability()) {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('[SecureStore] Getting token:', token ? 'Found' : 'Not Found');
            return token;
        }
        return null;
    },

    async removeToken() {
        if (isWeb) {
            localStorage.removeItem(TOKEN_KEY);
            return;
        }

        if (await checkAvailability()) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    },

    async setUser(user: any) {
        if (isWeb) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return;
        }

        if (await checkAvailability()) {
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        }
    },

    async getUser() {
        if (isWeb) {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        }

        if (await checkAvailability()) {
            const user = await SecureStore.getItemAsync(USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    async removeUser() {
        if (isWeb) {
            localStorage.removeItem(USER_KEY);
            return;
        }

        if (await checkAvailability()) {
            await SecureStore.deleteItemAsync(USER_KEY);
        }
    },

    async clearAuth() {
        if (isWeb) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            return;
        }

        if (await checkAvailability()) {
            await Promise.all([
                SecureStore.deleteItemAsync(TOKEN_KEY),
                SecureStore.deleteItemAsync(USER_KEY)
            ]);
        }
    }
};

