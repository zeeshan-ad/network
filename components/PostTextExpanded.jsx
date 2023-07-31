import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView, TextInput, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { AddRepliedComment, addComment, isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { getComments } from '../APIs/getComments';
import FlatListHeaderMemo from './FlatListHeaderMemo';
import { BottomSheet } from 'react-native-btr';
import { ActivityIndicator } from 'react-native';
import { formatTime } from '../util/functions';
import { Keyboard } from 'react-native';


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
      setLikeAddOne(0);
      setisPostingLike(false);
    }
  }

  const [ShowLikedUsers, setShowLikedUsers] = useState(false);

  const [AllComments, setAllComments] = useState([]);

  async function callGetComment() {
    const response = await getComments(memo.id, 'memo');
    if (response.status === 200) {
      setAllComments(response.data.data);
    }
  }

  const [isPostingLike, setisPostingLike] = useState(false);
  const [LikeAddOne, setLikeAddOne] = useState(0);
  const callPostLike = async () => {
    setLikeAddOne(1);
    setisPostingLike(true);
    const response = await postLike(memo.id, 'memo');
    if (response.status === 200) {
      setisPostingLike(true);
      CallIsliked();
    } else {
      setLikeAddOne(0);
      setisPostingLike(false);
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(memo.id, 'memo');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  const [comment, setcomment] = useState('');
  const [isPostingComment, setisPostingComment] = useState(false);
  const [ReplyingTo, setReplyingTo] = useState(null)


  const callAddComment = async () => {
    setisPostingComment(true);
    const response = await addComment(memo.id, 'memo', comment);
    if (response.status === 200) {
      setisPostingComment(false);
      setcomment('');
      callGetComment();
      if (ReplyingTo !== null) {
        callAddRepliedComment()
      }
    } else {
      setisPostingComment(false);
    }
  }
  const callAddRepliedComment = async () => {
    const response = await AddRepliedComment(editProfile.user_id, ReplyingTo?.user_id, memo?.id, 'memo');
    if (response.status === 200) {
      console.log(response.data)
    }
  }


  useEffect(() => {
    if (ReplyingTo !== null) {
      if (!comment?.includes(ReplyingTo?.name)) {
        setReplyingTo(null);
        setcomment('');
      }
    }
  }, [comment, ReplyingTo])

  const CatchUserToReply = (item) => {
    setReplyingTo(item);
    setcomment(`@${item.name} `);
  }


  useEffect(() => {
    CallIsliked();
    callGetComment();
  }, [isFocused])



  return (
    <KeyboardAvoidingView behavior='padding' style={{ height: height }}>
      <View style={{ position: 'absolute', top: 0, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, width: width, height: 45, zIndex: 999 }}></View>
      <FlatList
        data={AllComments}
        style={{ paddingHorizontal: 20, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, }}
        ListHeaderComponent={<FlatListHeaderMemo
          LikeAddOne={LikeAddOne}
          isPostingLike={isPostingLike}
          liked={liked} navigation={navigation} callPostLike={callPostLike} callRemoveLIke={callRemoveLIke}
          memo={memo} AllComments={AllComments} userInfo={userInfo} setShowLikedUsers={setShowLikedUsers}
          ShowLikedUser={ShowLikedUsers} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Pressable onPress={() => navigation.navigate('Profile', {
                userId: item?.user_id !== userInfo?.id ? item?.user_id : null,
                themeColor: item?.user_id !== userInfo?.id ? item?.theme : editProfile?.theme
              })}>
                <Image placeholder={blurhash} source={item.profile_pic ? BASE_URL + item.profile_pic : require('../assets/images/placeholder_profile.png')}
                  style={{
                    height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                    borderColor: theme.colors.dark, overflow: 'hidden'
                  }} />
              </Pressable>
              <View style={{
                backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 80
              }}>
                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                  <View>
                    <View style={{
                      flexDirection: 'row', justifyContent: 'space-between', gap: 20, alignItems: "center"
                    }}>
                      <Pressable onPress={() => navigation.navigate('Profile',
                        {
                          userId: item?.user_id !== userInfo?.id ? item?.user_id : null,
                          themeColor: item?.user_id !== userInfo?.id ? item?.theme : editProfile?.theme
                        })}>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={{
                          fontSize: fontSizes.smallMedium, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark,
                          maxWidth: width - 300
                        }}>{item.name}</Text>
                      </Pressable>
                      <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, color: theme.colors.backdrop, fontStyle: "italic" }}>
                        {formatTime(item?.date)}
                      </Text>
                    </View>
                    <Text style={{ fontSize: fontSizes.smallMedium, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                      {item.comment}
                    </Text>
                    {item?.user_id !== userInfo?.id &&
                      <Pressable onPress={() => CatchUserToReply(item)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 3, alignItems: "center", marginTop: 5 }}>
                          <Octicons name="reply" size={10} color={theme.colors.backdrop} />
                          <Text style={{ fontStyle: 'italic', color: theme.colors.backdrop }}>reply</Text>
                        </View>
                      </Pressable>
                    }
                  </View>
                </View>
              </View>
            </View>
          );
        }} />
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 10, paddingLeft: 20, paddingBottom: 20, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost
      }}>
        <Image placeholder={blurhash} source={editProfile?.image ? editProfile?.image : require('../assets/images/placeholder_profile.png')}
          style={{
            height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
            borderColor: theme.colors.dark, overflow: 'hidden'
          }} />
        <TextInput
          selectionColor={theme.colors.darkgrey}
          onChangeText={(text) => setcomment(text)}
          value={comment}
          multiline={true}
          style={styles.input} placeholder="Add a comment" />
        {comment?.length > 0 && !isPostingComment && <Pressable
          onPress={callAddComment}
          style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
          <MaterialCommunityIcons name="arrow-top-right" size={20} color="black" />
        </Pressable>}
        {isPostingComment &&
          <View style={{ position: "absolute", top: 30, right: 35, zIndex: 9999 }}>
            <ActivityIndicator size="small" color={theme.colors.backdrop} />
          </View>
        }
      </View>
      <BottomSheet
        visible={ShowLikedUsers}
        onBackdropPress={() => setShowLikedUsers(false)}>
        <View style={[styles.card, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={() => setShowLikedUsers(false)} style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingTop: 20, paddingBottom: 5,
          }}>
            <AntDesign name="circledowno" size={15} color={theme.colors.dark} />
            <Text style={{
              fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark,
              textDecorationLine: 'underline'
            }}>Likes</Text>
          </Pressable>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={liked?.likedByUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => {
                  setShowLikedUsers(false);
                  navigation.navigate('Profile', {
                    userId: item?.id !== userInfo?.id ? item?.id : null,
                    themeColor: item?.user_id !== userInfo?.id ? item?.theme : editProfile?.theme
                  })
                }} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
                  borderBottomWidth: 1, borderBottomColor: theme.colors.divider
                }}>
                  <Image placeholder={blurhash} source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                    style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark }}>{item.name}</Text>
                </Pressable>
              )
            }} />
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: theme.colors.dark,
    paddingHorizontal: 10,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: theme.colors.light,
    width: width - 90,
    height: 60,
    color: theme.colors.dark,
    fontSize: fontSizes.smallMedium,
    fontWeight: 'medium',
  },
  card: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    maxHeight: height - 50,
    paddingBottom: 20
  },
  button: {
    position: 'absolute',
    top: 25,
    right: 30,
    width: 30,
    height: 30,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    borderRadius: 100,
    borderWidth: 2,
  },
})

export default memo(PostTextExpanded);