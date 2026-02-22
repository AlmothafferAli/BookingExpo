import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        height: '43%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
    topText: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 32,
        textAlign: 'center',
        width: '75%',
    },
    descriptionText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 14,
        textAlign: 'center',
        width: '75%',
        lineHeight: 20,
    },
    bottomSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneImage: {
        width: '100%',
        height: '100%',
    },
    pageIndicatorContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
        marginTop: 32,
    },
    pageIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D3D3D3',
    },
    pageIndicatorActive: {
        backgroundColor: '#000',
    },
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 32,
    },
    registerButton: {
        backgroundColor: '#2B497D',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 100,
        width: '60%',
        alignItems: 'center',
    },
    registerButtonText: {
        fontFamily: 'Alexandria-Bold',
        fontSize: 14,
        color: '#FFFFFF',
        textShadowColor: 'transparent',
    },
    loginLink: {
        paddingVertical: 4,
    },
    loginLinkText: {
        fontFamily: 'Alexandria-Regular',
        fontSize: 12,
        color: '#2B497D',
        textDecorationLine: 'underline',
    },
});
