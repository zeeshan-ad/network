import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Button } from 'react-native-paper'

SplashScreen.preventAutoHideAsync();

const Landing = ({ navigation }) => {

  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded])


  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={{ flexDirection: 'column', height: '100%', justifyContent: "space-between" }}>
        <View style={{ height: '70%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.logo}>Yeet</Text>
        </View>
        <View>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('Login')}
            labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
            uppercase={true}
            contentStyle={{ height: 80, backgroundColor: '#36A3EB' }}
            style={styles.button}>
            Log In
          </Button>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('Signup')}
            labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
            uppercase={true}
            contentStyle={{ height: 80, backgroundColor: '#FFB84C' }}
            style={styles.button}>
            Join the network
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F35F5F'
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: 100,
    color: '#fff',
    textAlign: 'center',
    padding: 5,
  },
  emojis: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 0,
  }
});

export default Landing;
