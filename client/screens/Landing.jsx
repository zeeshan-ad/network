import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Button } from 'react-native-paper'
import { theme } from '../util/constants';

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
          <Text style={styles.logo}>Yeet!</Text>
        </View>
        <View>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('Login')}
            labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
            uppercase={true}
            contentStyle={{ height: 80, backgroundColor: theme.colors.tertiary }}
            style={styles.button}>
            Log In
          </Button>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('Signup')}
            labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
            uppercase={true}
            contentStyle={{ height: 80, backgroundColor: theme.colors.scondary }}
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
    backgroundColor: theme.colors.primary
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: 100,
    color: theme.colors.light,
    textAlign: 'center',
    padding: 5,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  emojis: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 0,
  }
});

export default Landing;
