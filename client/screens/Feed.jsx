import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Text, ScrollView, TouchableWithoutFeedback, Pressable, SafeAreaView } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import PostSnippet from '../components/PostSnippet';
import Mood from '../components/Mood';
import { useDispatch, useSelector } from 'react-redux';
import PostTextSnippet from '../components/PostTextSnippet';
import { getProfileData, getMood, getMemos } from '../APIs';
import { setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';



const Feed = ({ navigation }) => {
  const height = Dimensions.get("window").height;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);

  const [ProfileInfo, setProfileInfo] = useState();
  const [FetchedMood, setFetchedMood] = useState('');


  const callGetProfileData = async () => {
    const response = await getProfileData();
    if (response?.status === 200) {
      setProfileInfo(response?.data?.data);
      dispatch(setProfileData({
        bio: response?.data?.data?.bio,
        is_public: response?.data?.data?.is_public,
        image: response?.data?.data?.profile_pic ? BASE_URL + response?.data?.data?.profile_pic : null,
        theme: response?.data?.data?.theme,
        username: response?.data?.data?.username,
      }));
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const callGetMood = async () => {
    const response = await getMood();
    if (response?.status === 200) {
      setFetchedMood(response?.data?.data);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const [FetchedMemos, setFetchedMemos] = useState()

  const callGetMemos = async () => {
    const response = await getMemos();
    if (response?.status === 200) {
      setFetchedMemos(response?.data?.data);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }


  useEffect(() => {
    callGetProfileData();
    callGetMood();
    callGetMemos();
  }, [isFocused]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.light }]}>
      <KeyboardAvoidingView behavior="padding">
        <Header navigation={navigation} editProfile={editProfile} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.titleText}>Moods</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.moodsContainer}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('PostMood', { editProfile, FetchedMood })} >
                <View style={styles.profileMood}>
                  {editProfile?.image ? (<Image source={editProfile?.image}
                    style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
                    (<Image source={require('../assets/images/placeholder_profile.png')}
                      style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2 }} />)}

                  <View style={[styles.moodTextContainer, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.secondary, }]} >
                    {FetchedMood?.mood ?
                      <Text numberOfLines={1} ellipsizeMode='clip' style={styles.moodText}>{FetchedMood?.mood}</Text> :
                      <Feather name="plus" size={20} color={theme.colors.dark} />}
                  </View>
                  <Text style={styles.text}>You</Text>
                </View>
              </TouchableWithoutFeedback>
              <Mood navigation={navigation} />
            </View>
          </ScrollView>
          <View>
            {FetchedMemos?.memo?.length > 0 && FetchedMemos?.memo?.map((item, index) =>
              <PostTextSnippet key={index} navigation={navigation} memo={item} profile={FetchedMemos?.profile} />
            )}
            <PostSnippet navigation={navigation} />

            <PostSnippet navigation={navigation} />
          </View>
          <View style={{ height: 50 }}></View>
        </ScrollView>
        <Pressable onPress={() => navigation.navigate('Post', { editProfile })} style={styles.postBtn}>
          <Feather name="plus" size={30} color={theme.colors.dark} />
        </Pressable>
      </KeyboardAvoidingView>
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
    bottom: 50,
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

export default Feed