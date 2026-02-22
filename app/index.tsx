import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { secureStore } from '../Base/secureStore';

export default function Index() {
  console.log("Rendering Index Route");
  const [isChecked, setIsChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('Token:');
        const token = await secureStore.getToken();
        console.log('Token:', token);
        if (token) {
          setHasToken(true);
        }
      } catch (error) {
        console.error("Error checking token in index:", error);
      } finally {
        setIsChecked(true);
      }
    };
    checkToken();
  }, []);

  if (!isChecked) {
    console.log('Checked token:', hasToken);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (hasToken) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
