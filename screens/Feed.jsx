import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Text, ScrollView, TouchableWithoutFeedback, Pressable, SafeAreaView, FlatList } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import Mood from '../components/Mood';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData, getMood, getPendingRequests, getFriendsMoods, getFeed, getNotifications } from '../APIs';
import { setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import MemoizedFeed from '../components/MemoizedFeed';


const { height, width } = Dimensions.get('window');

const FeedComponent = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const editProfile = useSelector(state => state.editProfile);

  const [ProfileInfo, setProfileInfo] = useState();


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
    const response = await getFeed();
    if (response?.status === 200) {
      setFeed(response?.data?.data);
    }
  }

  useEffect(() => {
    callGetProfileData();
    callGetPendingRequests()
    callGetFeed();
  }, [isFocused]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.light }]}>
      <KeyboardAvoidingView behavior="padding">
        <Header isFocused={isFocused} navigation={navigation} editProfile={editProfile} PendingRequests={PendingRequests}
          unseenReq={unseenReq} Notifications={Notifications}/>
        <View style={{ minHeight: height - 80, justifyContent: "center" }}>
          <MemoizedFeed
            navigation={navigation}
            Feed={Feed}
            callGetFeed={callGetFeed}
            callGetPendingRequests={callGetPendingRequests}
            callGetProfileData={callGetProfileData}
          />
          {!Feed &&
            <View style={{ position: "absolute", flex: 1, height: '50%', justifyContent: "center", alignItems: "center", width: width }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center' }}>
                There is nothing to show, add friends{'\n'}to your bubble to fill up this space.
              </Text>
              <Pressable onPress={() => navigation.navigate('Search', { editProfile })}
                style={{ marginTop: 20, backgroundColor: theme.colors.secondary, padding: 10, borderRadius: 10, borderWidth: 2 }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark }}>Find friends</Text>
              </Pressable>
            </View>
          }
        </View>
      </KeyboardAvoidingView>
      <Pressable onPress={() => { navigation.navigate('Post', { editProfile }) }} style={styles.postBtn}>
        <Feather name="plus" size={30} color={theme.colors.dark} />
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
    paddingTop: 5
  },
  titleText: {
    fontSize: fontSizes.large,
    color: theme.colors.dark,
    paddingLeft: 10,
    fontWeight: fontWeights.normal
  },
  moodsContainer: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
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
    left: 0,
    top: -15,
    padding: 3,
    borderRadius: 100
  },
  moodText: {
    width: 70,
    textAlign: 'center',
    fontSize: fontSizes.medium,
    height: 22,
    paddingVertical: 2,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 10,
  },
  postBtn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 999,
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderWidth: 2,
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .25,
    shadowRadius: 5,
    elevation: 10,
  }
})

export default FeedComponent;