import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Text, ImageBackground, ScrollView } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import PostSnippet from '../components/PostSnippet';
import Mood from '../components/Mood';
import { useDispatch, useSelector } from 'react-redux';
import PostTextSnippet from '../components/PostTextSnippet';
import { getProfileData } from '../APIs';
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


  const callGetProfileData = async () => {
    const response = await getProfileData();
    if (response?.status === 200) {
      setProfileInfo(response?.data?.data);
      dispatch(setProfileData({
        bio: response?.data?.data?.bio,
        is_public: response?.data?.data?.is_public,
        image: response?.data?.data?.profile_pic ? BASE_URL + response?.data?.data?.profile_pic : null,
        theme: response?.data?.data?.theme,
      }));
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  useEffect(() => {
    callGetProfileData();
  }, [isFocused])

  return (
    <KeyboardAvoidingView behavior="height" style={{
      backgroundColor: theme.colors.light,
    }}>
      <Header navigation={navigation} editProfile={editProfile} />
      <View style={{
        position: 'absolute', bottom: 120, right: 15, zIndex: 999, backgroundColor: theme.colors.secondary, padding: 10,
        borderWidth: 2, borderRadius: 100, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: .25,
        shadowRadius: 5,
        elevation: 10,
      }}>
        <Feather name="plus" size={30} color={theme.colors.dark} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: fontSizes.large, color: theme.colors.dark, paddingLeft: 10, fontWeight: fontWeights.normal }}>Moods</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 15, paddingHorizontal: 10, paddingTop: 20, paddingBottom: 10, zIndex: -999 }}>
            <View style={{ position: 'relative', alignItems: 'center' }}>
              {editProfile?.image ? (<Image source={editProfile?.image}
                style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
                (<Image source={require('../assets/images/placeholder_profile.png')} resizeMode='center'
                  style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2 }}/>)}

              <View style={{
                position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
                backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.secondary, left: 0, top: -15, padding: 3, borderRadius: 100
              }} >
                <Feather name="plus" size={20} color={theme.colors.dark} />
              </View>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>You</Text>
            </View>
            <Mood />
          </View>
        </ScrollView>
        <View style={{ marginBottom: 100 }}>
          <PostSnippet navigation={navigation} />
          <PostTextSnippet navigation={navigation} />
          <PostSnippet navigation={navigation} />
        </View>
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: theme.colors.light
  }
})

export default Feed