import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Feather, Octicons, Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';



SplashScreen.preventAutoHideAsync();

const width = Dimensions.get("window").width;
const Header = ({ navigation, editProfile, PendingRequests, unseenReq }) => {
  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
  });


  useEffect(() => {
    
  }, [PendingRequests, unseenReq])
  

  const [showNotif, setshowNotif] = useState(false);


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.header} onLayout={onLayoutRootView}>
        <Pressable onPress={() => { navigation.navigate('Search', { editProfile }); }}>
          <Feather name="search" size={25} />
        </Pressable>
        <Text style={styles.logo}>{APP_NAME}</Text>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: "center" }}>
          <Pressable onPress={() => { setshowNotif(!showNotif) }}>
            <Octicons name="people" size={25} color={theme.colors.dark} />
            {unseenReq ?
              <View style={{
                height: 25, width: 25, position: 'absolute', top: -10, right: -10,
                borderWidth: 1, borderColor: theme.colors.dark, padding: 2, backgroundColor: theme.colors.secondary, borderRadius: 100,
                justifyContent: "center", alignItems: 'center', flexDirection: 'column',
              }}>
                <Text style={{ color: theme.colors.dark, fontSize: fontSizes.smallMedium, fontWeight: fontWeights.normal }}>{unseenReq}</Text>
              </View> : null}
          </Pressable>
          <Pressable onPress={() => { navigation.navigate('Profile', { userId: null }); }}>
            {editProfile?.image ? (<Image source={editProfile?.image}
              style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
              (<Image source={require('../assets/images/placeholder_profile.png')}
                style={{ height: 35, width: 35, borderRadius: 100, borderWidth: 2 }} />)}
          </Pressable>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotif}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.light, }}>
          <View style={{ position: 'relative', paddingBottom: 10, backgroundColor: theme.colors.light }}>
            <Pressable onPress={() => setshowNotif(false)} style={{ position: 'absolute', left: 10, zIndex: 999 }}>
              <Ionicons name="close" size={30} color={theme.colors.dark} />
            </Pressable>
            <View style={{ paddingTop: 10 }}>
              <Text style={{ textAlign: 'center', fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark }}>Friend Requests</Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={{
            flex: 1, alignItems: 'center', marginTop: 10,
            justifyContent: PendingRequests?.length ? 'flex-start' : 'center',
          }}>
            {PendingRequests?.length ? PendingRequests?.map((item, index) => {
              return (
                <Pressable key={index} onPress={() => {
                  navigation.navigate('Profile', { userId: item?.req_by_id });
                  setshowNotif(false);
                }}>
                  <View key={index} style={{
                    borderBottomWidth: 1, borderColor: theme.colors.divider, height: 65, flexDirection: 'row', width: width,
                    alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10, gap: 10
                  }}>
                    <Image source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                      style={{ height: 50, width: 50, borderRadius: 100, borderColor: theme.colors.dark, borderWidth: 2 }} />
                    <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light }}>
                      <Text style={{ fontWeight: fontWeights.semibold }}>{item?.name}</Text>
                      &nbsp;has requested to{'\n'}join your bubble.</Text>
                  </View>
                </Pressable>
              )
            }) :
              <Text style={{ textAlign: 'center', fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark }}>
                You have no pending requests.
              </Text>
            }
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
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