import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { AppText as Text } from '../../components/AppText';
import { Link, router } from 'expo-router';
import COLORS from '../../Base/constants';
import FloatingLabelInput from '../../Base/components/FloatingLabelInput';
import { useLoginMutation } from '../../Base/authSlice';
import { useApi } from '../../Base/useApi';
import { ActivityIndicator } from 'react-native';

export default function LoginScreen() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [loginMutation] = useLoginMutation();

    const { execute: login, loading } = useApi(loginMutation, {
        onSuccess: () => {
            router.replace('/(tabs)/Home');
        },
        successMessage: 'تم تسجيل الدخول بنجاح',
    });

    const handleLogin = () => {
        if (!loginData.email || !loginData.password) {
            alert("Please enter email and password");
            return;
        }

        // Map email to username as per cURL request if needed, or send as is based on backend
        // The cURL example used "username": "marwa", so we might need to send email as username 
        // or the form should be "Username". Assuming "email" field acts as identifier.
        login({
            username: loginData.email,
            password: loginData.password
        });
    }
    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Title */}
            <View style={{ marginBottom: 40 }}>
                <Text style={styles.title}>مرحباً بك مجدداً</Text>
                <Text style={styles.subtitle}>
                    أدخل بياناتك للمتابعة والوصول لمميزات التطبيق
                </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                <FloatingLabelInput
                    label="البريد الالكتروني"
                    value={loginData.email}
                    onChangeText={(text) => setLoginData({ ...loginData, email: text })}
                    placeholder="ali@almothaffer.com"
                    icon="email"
                />

                {/* Password Input */}
                <FloatingLabelInput
                    label="كلمة المرور"
                    value={loginData.password}
                    onChangeText={(text) => setLoginData({ ...loginData, password: text })}
                    secureTextEntry
                    icon="lock-outline"
                />

                {/* Forgot Password Link */}
                <Pressable style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>هل نسيت كلمة المرور؟</Text>
                </Pressable>

                {/* Login Button */}
                <Pressable
                    style={[styles.loginButton, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
                    )}
                </Pressable>

                {/* Register Link */}
                <View style={styles.registerLinkContainer}>
                    <Text style={styles.registerLinkText}>ليس لديك حساب؟ </Text>
                    <Link href="/(auth)/Registration" asChild>
                        <Pressable>
                            <Text style={styles.registerLinkHighlight}>سجل الآن</Text>
                        </Pressable>
                    </Link>
                </View>

                {/* Divider/Social Section (Mirrors Registration) */}
                <View style={styles.dividerContainer}>
                    <Text style={styles.divider}>───────── أو سجل دخولك باستخدام ─────────</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginTop: 60,
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 24,
        color: COLORS.PrimarySlate,
        textAlign: 'right',
    },
    subtitle: {
        fontFamily: 'Alexandria-Light',
        fontSize: 14,
        color: COLORS.PrimarySlate,
        textAlign: 'right',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontFamily: 'Alexandria-Medium',
        fontSize: 12,
        color: COLORS.PrimarySlate,
    },
    loginButton: {
        backgroundColor: COLORS.PrimarySlate,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    loginButtonText: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        color: '#FFFFFF',
        textShadowColor: 'transparent',
    },
    registerLinkContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    registerLinkText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        color: '#666',
    },
    registerLinkHighlight: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 14,
        color: COLORS.PrimarySlate,
    },
    dividerContainer: {
        marginTop: 20,
    },
    divider: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 11,
        textAlign: 'center',
        color: '#999',
    },
});
