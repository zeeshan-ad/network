import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ImageBackground, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, fontSizes, theme } from '../util/constants';
import { useFonts } from 'expo-font'


SplashScreen.preventAutoHideAsync();
const Header = ({ navigation }) => {
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
    <View style={styles.header} onLayout={onLayoutRootView}>
      <Feather name="search" size={25} />
      <Text style={styles.logo}>{APP_NAME}</Text>
      <Pressable onPress={() => { navigation.navigate('Profile') }}>
        <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
          style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: fontSizes.smallHightlight,
    color: theme.colors.dark,
    textAlign: 'center',
  },
})

export default Header