import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Text, Pressable, SafeAreaView, FlatList } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL, normalize } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData, getPendingRequests, getFeed, getNotifications } from '../APIs';
import { setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import MemoizedFeed from '../components/MemoizedFeed';
import { getCalendars } from 'expo-localization';
import { extractMomentsForPrefetch } from '../util/functions';
import { Image } from 'expo-image/build';
import { Platform } from 'react-native';


const { height, width } = Dimensions.get('window');

const FeedComponent = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const editProfile = useSelector(state => state.editProfile);

  const [ProfileInfo, setProfileInfo] = useState();
  const { timeZone } = getCalendars()[0];


  async function callGetProfileData() {
    const response = await getProfileData();
    if (response?.status === 200) {
      setProfileInfo(response?.data?.data);
      dispatch(setProfileData({
        bio: response?.data?.data?.bio,
        is_public: response?.data?.data?.is_public,
        image: response?.data?.data?.profile_pic ? BASE_URL + response?.data?.data?.profile_pic : null,
        theme: response?.data?.data?.theme,
        user_id: response?.data?.data?.user_id,
      }));
    }
  }


  const [PendingRequests, setPendingRequests] = useState(null);
  const [unseenReq, setunseenReq] = useState(0);
  const [Notifications, setNotifications] = useState(null);

  async function callGetPendingRequests() {
    setPendingRequests(null);
    setunseenReq(0);
    const response = await getPendingRequests();
    if (response?.status === 200) {
      setPendingRequests(response?.data?.data);
      setunseenReq(response?.data?.data?.filter((item) => item?.notify === true)?.length)
    }
    const resp = await getNotifications();
    if (resp?.status === 200) {
      setNotifications(resp?.data?.data);
    }
  }

  const [Feed, setFeed] = useState(null);

  async function callGetFeed() {
    const response = await getFeed(timeZone);
    if (response?.status === 200) {
      // check if feed and response.data.data are same
      if (JSON.stringify(Feed) === JSON.stringify(response?.data?.data)) return;
      else {
        setFeed(null);
        setFeed(response?.data?.data);
      }
    }
  }

  useEffect(() => {
    if (Feed) {
      const arrayPrefetch = extractMomentsForPrefetch(Feed);
      Image.prefetch(arrayPrefetch);
    }
  }, [Feed])



  useEffect(() => {
    callGetProfileData();
    callGetPendingRequests()
    callGetFeed();
  }, [isFocused]);

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: theme.colors.light,
      paddingTop: Platform.OS === 'android' && normalize(25)
    }]}>
      <KeyboardAvoidingView behavior="padding">
        <Header isFocused={isFocused} navigation={navigation} editProfile={editProfile} PendingRequests={PendingRequests}
          unseenReq={unseenReq} Notifications={Notifications} callGetPendingRequests={callGetPendingRequests}
          getNotifications={getNotifications} />
        <View style={{ minHeight: height - normalize(80), justifyContent: "center" }}>
          <MemoizedFeed
            navigation={navigation}
            Feed={Feed}
            callGetFeed={callGetFeed}
            callGetPendingRequests={callGetPendingRequests}
            callGetProfileData={callGetProfileData}
            editProfile={editProfile}
            getNotifications={getNotifications}
          />
          {!Feed &&
            <View style={{ height: '50%', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal }}>No posts to show.</Text>
            </View>
          }
        </View>
      </KeyboardAvoidingView>
      <Pressable onPress={() => { navigation.navigate('Post', { editProfile }) }} style={styles.postBtn}>
        <Feather name="plus" size={normalize(25)} color={theme.colors.dark} />
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light
  },
  text: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.normal,
    paddingTop: normalize(5)
  },
  titleText: {
    fontSize: fontSizes.large,
    color: theme.colors.dark,
    paddingLeft: normalize(10),
    fontWeight: fontWeights.normal
  },
  moodsContainer: {
    flexDirection: 'row',
    gap: normalize(15),
    paddingHorizontal: normalize(10),
    paddingTop: normalize(20),
    paddingBottom: normalize(10),
    zIndex: -999
  },
  profileMood: {
    position: 'relative',
    alignItems: 'center'
  },
  moodTextContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    left: normalize(0),
    top: normalize(-15),
    padding: normalize(3),
    borderRadius: normalize(100)
  },
  moodText: {
    width: normalize(70),
    textAlign: 'center',
    fontSize: fontSizes.medium,
    height: normalize(22),
    paddingVertical: normalize(2),
    shadowColor: theme.colors.dark,
    shadowOffset: { width: normalize(0), height: normalize(0) },
    shadowOpacity: normalize(1),
    shadowRadius: normalize(1),
    elevation: normalize(10),
  },
  postBtn: {
    position: 'absolute',
    bottom: normalize(15),
    right: normalize(15),
    zIndex: 999,
    backgroundColor: theme.colors.secondary,
    padding: normalize(10),
    borderWidth: normalize(2),
    borderRadius: normalize(100),
    height: normalize(50),
    width: normalize(50),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: normalize(0),
      height: normalize(2),
    },
    shadowOpacity: normalize(.25),
    shadowRadius: normalize(5),
    elevation: normalize(10),
  }
})

export default FeedComponent;