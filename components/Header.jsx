import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Feather, Octicons, Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { FlatList } from 'react-native';
import { getMemoORMoment, updateIsView } from '../APIs';
import { getCalendars } from 'expo-localization';
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native';




SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");
const Header = ({ navigation, editProfile, PendingRequests, unseenReq, Notifications, callGetPendingRequests, getNotifications }) => {

  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
  });

  const [NotifCount, setNotifCount] = useState(0)
  useEffect(() => {
    const length = Notifications?.filter((item) => item?.is_view === false)?.length;
    setNotifCount(length);
  }, [Notifications])


  const [showNotif, setshowNotif] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const { timeZone } = getCalendars()[0];
  const [FetchNotifData, setFetchNotifData] = useState(false);
  const callGetMemoOrMoment = async (post_id, post_type) => {
    setFetchNotifData(true);
    const response = await getMemoORMoment(post_id, post_type, timeZone);
    if (response?.status === 200) {
      setFetchNotifData(false);
      if (response?.data?.data?.post_type === 'moment') {
        setshowNotif(false);
        navigation.navigate('PostExpanded', {
          moment: [{ ...response?.data?.data }], user: {
            name: response?.data?.data?.name,
            image: BASE_URL + response?.data?.data?.profile_pic
          }
        });
      } else {
        setFetchNotifData(true);
        setshowNotif(false);
        navigation.push('PostTextExpanded', { memo: { ...response?.data?.data } });
      }
    }
  }

  const callupdateIsView = async (post_id, post_type, interaction_type) => {
    await updateIsView(post_id, post_type, interaction_type);
  }

  const onRefresh = () => {
    callGetPendingRequests();
    getNotifications();
  }

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
            <Octicons name="bell" size={25} color={theme.colors.dark} />
            {unseenReq || NotifCount ?
              <View style={{
                height: 25, width: 25, position: 'absolute', top: -10, right: -10,
                borderWidth: 1, borderColor: theme.colors.dark, padding: 2, backgroundColor: theme.colors.secondary, borderRadius: 100,
                justifyContent: "center", alignItems: 'center', flexDirection: 'column',
              }}>
                <Text style={{ color: theme.colors.dark, fontSize: fontSizes.smallMedium, fontWeight: fontWeights.normal }}>{!isNaN(unseenReq + NotifCount) && unseenReq + NotifCount}</Text>
              </View> : null}
          </Pressable>
          <Pressable onPress={() => { navigation.navigate('Profile', { userId: null, themeColor: editProfile.theme }); }}>
            {editProfile?.image ? (<Image placeholder={blurhash} source={editProfile?.image}
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
              <Text style={{ textAlign: 'center', fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark }}>Notifs</Text>
            </View>
          </View>
          {PendingRequests?.length > 0 &&
            <View style={{ height: 150 }}>
              <Text style={{
                paddingHorizontal: 10, fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 10,
                textDecorationLine: 'underline', paddingBottom: 10
              }}>Pending Requests</Text>
              <ScrollView contentContainerStyle={{
                flex: 1, alignItems: 'center', marginTop: 10,
                justifyContent: PendingRequests?.length ? 'flex-start' : 'center',
              }}>
                {PendingRequests?.map((item, index) => {
                  return (
                    <Pressable key={index} onPress={() => {
                      navigation.navigate('Profile', { userId: item?.req_by_id, themeColor: item?.theme });
                      setshowNotif(false);
                    }}>
                      <View key={index} style={{
                        borderBottomWidth: 1, borderColor: theme.colors.divider, height: 65, flexDirection: 'row', width: width,
                        alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10, gap: 10, height: 70
                      }}>
                        <Image placeholder={blurhash} source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                          style={{ height: 50, width: 50, borderRadius: 100, borderColor: theme.colors.dark, borderWidth: 2 }} />
                        <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light }}>
                          <Text style={{ fontWeight: fontWeights.semibold }}>{item?.name + ' '?.substring(0, item?.name + ' '?.indexOf(' '))}</Text>
                          &nbsp;has requested to{'\n'}join your bubble.</Text>
                      </View>
                    </Pressable>
                  )
                })
                }
              </ScrollView>
            </View>
          }
          {Notifications?.length > 0 &&
            <View>
              <View style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 10,
                  textDecorationLine: 'underline', paddingBottom: 10
                }}>Alerts</Text>
                {FetchNotifData && <Text><ActivityIndicator size="small" color={theme.colors.backdrop} /></Text>}
              </View>
              <FlatList
                data={Notifications}
                ListFooterComponent={() => <View style={{ height: PendingRequests?.length > 0 ? 250 : 50 }} />}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable key={index} onPress={() => {
                      callupdateIsView(item?.post_id, item?.post_type, item?.interaction_type);
                      callGetMemoOrMoment(item?.post_id, item?.post_type);
                    }}>
                      <View key={index} style={{
                        backgroundColor: item?.is_view ? theme.colors.lightDisabled : theme.colors.light,
                        borderBottomWidth: 1, borderColor: theme.colors.divider, height: 65, flexDirection: 'row', width: width,
                        alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10, gap: 10, height: 70
                      }}>
                        <Image source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                          style={{ height: 50, width: 50, borderRadius: 100, borderColor: theme.colors.dark, borderWidth: 2 }} />
                        <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, }}>
                          <Text style={{ fontWeight: fontWeights.semibold }}>{item?.name + ' '?.substring(0, item?.name + ' '?.indexOf(' '))}</Text>
                          &nbsp;
                          has {item?.interaction_type}
                          {item?.interaction_type === 'commented' && ` on\nyour ${item?.post_type}`}
                          {item?.interaction_type === 'liked' && `\nyour ${item?.post_type}`}
                          {item?.interaction_type === 'replied' && ` to\nyour comment`}.</Text>
                      </View>
                    </Pressable>
                  )
                }}
              />
            </View>}

          {!Notifications?.length && !PendingRequests?.length &&
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal }}>No Notifications</Text>
            </View>
          }

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