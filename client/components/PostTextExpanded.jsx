import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostTextExpanded = ({ navigation, route }) => {
  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);
  const isFocused = useIsFocused();


  const { memo } = route.params;


  const [liked, setLiked] = useState(false);

  const CallIsliked = async () => {
    const response = await isLiked(memo.id, 'memo');
    if (response.status === 200) {
      setLiked(response.data.data);
    }
  }



  const callPostLike = async () => {
    const response = await postLike(memo.id, 'memo');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(memo.id, 'memo');
    if (response.status === 200) {
      CallIsliked();
    }
  }


  useEffect(() => {
    CallIsliked();
  }, [isFocused])




  const comments = [
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
  ]
  return (
    <KeyboardAvoidingView behavior='padding' style={{ height: height }}>
      <View style={{ position: 'absolute', top: 0, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, width: width, height: 45, zIndex: 999 }}></View>

      <ScrollView showsVerticalScrollIndicator={false} style={{
        paddingHorizontal: 20,
        backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost,
      }}>
        <View style={{
          minHeight: 150, paddingVertical: 20, marginBottom: 10, marginTop: 50, justifyContent: 'space-between',
        }}>
          <StatusBar style="dark" />
          <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: -10 }}>
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Profile', { userId: memo?.user_id !== userInfo?.id ? memo?.user_id : null })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Image source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/tzara.jpg')}
                  style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, color: theme.colors.dark }}>
                  {memo?.name}
                </Text>
              </Pressable>
            </View>
            <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.light, fontSize: fontSizes.smallMedium }}>{convertTimeStamp(memo?.created_at)}</Text>
          </View>
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ marginVertical: 10, fontSize: fontSizes.yeetPosts, lineHeight: 30 }}>
              {memo?.memo}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 2, paddingTop: 10 }}>
            <View style={{
              flexDirection: 'row', gap: 10, alignItems: 'center'
            }}>
              {liked?.isLiked ?
                <Pressable onPress={callRemoveLIke}>
                  <FontAwesome name="heart" size={23} color={theme.colors.danger} />
                </Pressable> :
                <Pressable onPress={callPostLike}>
                  <FontAwesome name="heart-o" size={23} color={theme.colors.dark} />
                </Pressable>
              }
              <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}
                <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;{liked?.totalLikes < 2 ? 'like' : 'likes'}</Text></Text>
            </View>
            <View style={{
              flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
            }}>
              <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
              <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>12
                <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;comments</Text></Text>
            </View>
          </View>
        </View>

        {comments.map((item, index) => {
          return (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/images/profilepic-dummy.jpg')}
                style={{
                  height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                  borderColor: theme.colors.dark, overflow: 'hidden'
                }} />
              <View key={index} style={{
                backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 80
              }}>
                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                  <View>
                    <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark }}>
                      Zeeshan Ahmed
                    </Text>
                    <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                      {item.comment}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 10, paddingLeft: 20, paddingBottom: 20, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost
      }}>
        <Image source={editProfile?.image ? editProfile?.image : require('../assets/images/placeholder_profile.png')}
          style={{
            height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
            borderColor: theme.colors.dark, overflow: 'hidden'
          }} />
        <TextInput
          selectionColor={theme.colors.darkgrey}
          style={styles.input} placeholder="Add a comment" />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: theme.colors.dark,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light,
    width: width - 90,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default memo(PostTextExpanded);