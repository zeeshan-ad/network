import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ImageBackground, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, fontSizes, theme } from '../util/constants';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';



SplashScreen.preventAutoHideAsync();
const Header = ({ navigation, editProfile }) => {
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
        {editProfile?.image ? (<Image source={editProfile?.image}
          style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
          (<ImageBackground source={require('../assets/images/placeholder_profile.png')} resizeMode='center'
            style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2 }} />)}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: fontSizes.smallHightlight,
    color: theme.colors.dark,
    textAlign: 'center',
  },
})

export default Header