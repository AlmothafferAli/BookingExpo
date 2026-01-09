import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import COLORS from '../../Base/constants';
import FloatingLabelInput from '../../Base/components/FloatingLabelInput';

export default function RegistrationScreen() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    });

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
                <Text style={styles.title}>سجل الآن وتحضر</Text>
                <Text style={styles.subtitle}>
                    ادخل البيانات التالية لإنشاء حساب جديد
                </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Full Name Input */}
                <FloatingLabelInput
                    label="الاسم الكامل"
                    value={userData.name}
                    onChangeText={(text) => setUserData({ ...userData, name: text })}
                    placeholder="Ali H. Almothaffer"
                    icon="account"
                />
                <FloatingLabelInput
                    label="البريد الالكتروني"
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                    placeholder="ali@almothaffer.com"
                    icon="email"
                />

                {/* Password Input */}
                <FloatingLabelInput
                    label="كلمة المرور"
                    value={userData.password}
                    onChangeText={(text) => setUserData({ ...userData, password: text })}
                    secureTextEntry
                    icon="lock-outline"
                />

                {/* Register Button */}
                <Pressable style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>تسجيل مستخدم جديد</Text>
                </Pressable>

                {/* Terms Text */}
                <Text style={styles.termsText}>
                    الضغط على تسجيل مستخدم جديد يعني موافقتك على{' '}
                    <Text style={styles.termsLink}>سياسة الاستخدام</Text>
                    {'\n'}و<Text style={styles.termsLink}>الخصوصية</Text>
                </Text>
            </View>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
                <View style={styles.loginLinkWrapper}>
                    <Text style={styles.loginLinkText}>لديك حساب بالفعل؟ </Text>
                    <Link href="/(auth)/login" asChild>
                        <Pressable>
                            <Text style={styles.loginLinkHighlight}>سجل دخولك</Text>
                        </Pressable>
                    </Link>
                </View>

                <Text style={styles.divider}>───────── أو سجل دخولك باستخدام ─────────</Text>
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
    registerButton: {
        backgroundColor: COLORS.PrimarySlate,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    registerButtonText: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 16,
        color: '#FFFFFF',
    },
    termsText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 11,
        textAlign: 'center',
        color: '#666',
        lineHeight: 18,
    },
    termsLink: {
        color: COLORS.PrimarySlate,
        textDecorationLine: 'underline',
    },
    loginLinkContainer: {
        marginTop: 40,
    },
    loginLinkWrapper: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginLinkText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        color: '#666',
    },
    loginLinkHighlight: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 14,
        color: COLORS.PrimarySlate,
    },
    divider: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 11,
        textAlign: 'center',
        color: '#999',
    },
});
