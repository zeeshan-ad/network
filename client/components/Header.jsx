import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Feather, Fontisto } from '@expo/vector-icons';
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
      <Pressable onPress={() => { navigation.navigate('Search', { editProfile }) }}>
        <Feather name="search" size={25} />
      </Pressable>
      <Text style={styles.logo}>{APP_NAME}</Text>
      <View style={{ flexDirection: 'row', gap:20, alignItems:"center" }}>
      <Fontisto name="bell"  size={25} color={theme.colors.dark}/>
        <Pressable onPress={() => { navigation.navigate('Profile', { userId: null }) }}>
          {editProfile?.image ? (<Image source={editProfile?.image}
            style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
            (<Image source={require('../assets/images/placeholder_profile.png')}
              style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2 }} />)}
        </Pressable>
      </View>
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
    marginRight: -55,
    fontFamily: 'Pacifico',
    fontSize: fontSizes.smallHightlight,
    color: theme.colors.dark,
    textAlign: 'center',
  },
})

export default Header