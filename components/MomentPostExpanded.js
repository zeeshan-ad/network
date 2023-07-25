import React, { useState, useEffect, memo } from 'react';
import { View, Text, TextInput, Keyboard, Dimensions, Pressable, FlatList, StyleSheet } from 'react-native';
import { FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import { BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { AddRepliedComment, addComment, deleteMoment, isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { getComments } from '../APIs/getComments';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-native-btr';
import { ActivityIndicator } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import moment from 'moment-timezone';
import { formatTime } from '../util/functions';


const { width, height } = Dimensions.get("window");
const MomentPostExpanded = ({ navigation, item, index, CarouselMoment, date }) => {
  const editProfile = useSelector(state => state.editProfile);
  const userInfo = useSelector(state => state.userInfo);

  const [CommentsVisible, setCommentsVisible] = useState(false);

  const [liked, setLiked] = useState();
  const isFocused = useIsFocused();
  const [ReplyingTo, setReplyingTo] = useState(null)


  const CallIsliked = async () => {
    const response = await isLiked(item.id, 'moment');
    if (response.status === 200) {
      setLiked(response.data.data);
    }
  }

  const [isPostingLike, setisPostingLike] = useState(false)
  const callPostLike = async () => {
    setisPostingLike(true);
    const response = await postLike(item.id, 'moment');
    if (response.status === 200) {
      setisPostingLike(false);
      CallIsliked();
    } else {
      setisPostingLike(false);
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(item.id, 'moment');
    if (response.status === 200) {
      CallIsliked();
    }
  }
  const [comment, setcomment] = useState('')

  const [isPostingComment, setisPostingComment] = useState(false);
  const callAddComment = async () => {
    setisPostingComment(true);
    const response = await addComment(item.id, 'moment', comment);
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

  const [AllComments, setAllComments] = useState();
  const [ShowLikedUsers, setShowLikedUsers] = useState(false);


  const callGetComment = async () => {
    const response = await getComments(item.id, 'moment');
    if (response.status === 200) {
      setAllComments(response.data.data);
    }
  }

  const [ShowOption, setShowOption] = useState(false)

  const callDeleteMoment = async () => {
    const response = await deleteMoment(item.id);
    if (response.status === 200) {
      setShowOption(false);
      navigation.goBack();
    }
  }

  const callAddRepliedComment = async () => {
    const response = await AddRepliedComment(editProfile?.user_id, ReplyingTo?.user_id, item?.id, 'moment');
    if (response.status === 200) {
      console.log(response.data)
    }
  }


  useEffect(() => {
    if (ReplyingTo !== null) {
      if (!comment.includes(ReplyingTo?.name)) {
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
    <>
      {CommentsVisible &&
        <View style={{
          position: 'absolute', bottom: 30, marginLeft: 20, minWidth: 200,
          maxWidth: width - 100, maxHeight: height / 2.6, zIndex: 9
        }}>
          <FlatList
            data={AllComments}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View key={index} style={{ flexDirection: 'row' }}>
                  <Pressable onPress={() => navigation.navigate('Profile',
                    {
                      userId: item?.user_id !== userInfo?.id ? item?.user_id : null,
                      themeColor: item?.user_id !== userInfo?.id ? item?.theme : editProfile?.theme
                    })}>
                    <Image placeholder={blurhash} source={item?.profile_pic ? { uri: `${BASE_URL}${item?.profile_pic}` } : require('../assets/images/placeholder_profile.png')}
                      style={{
                        height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                        borderColor: theme.colors.dark, overflow: 'hidden'
                      }} />
                  </Pressable>
                  <View key={index} style={{
                    backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 155,
                  }}>
                    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                      <View style={{}}>
                        <View style={{
                          flexDirection: 'row', justifyContent: 'space-between', gap: 20, alignItems: "center", paddingTop: 5
                        }}>
                          <Pressable onPress={() => navigation.navigate('Profile',
                            {
                              userId: item?.user_id !== userInfo?.id ? item?.user_id : null,
                              themeColor: item?.user_id !== userInfo?.id ? item?.theme : editProfile?.theme
                            })}>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={{
                              fontSize: fontSizes.smallMedium, fontWeight: fontWeights.semibold, color: theme.colors.dark,
                              maxWidth: width - 300
                            }}>{item.name}</Text>
                          </Pressable>
                          <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, color: theme.colors.backdrop, fontStyle: "italic" }}>
                            {formatTime(item.date)}</Text>
                        </View>
                        <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                          {item.comment}
                        </Text>
                        {item?.user_id !== userInfo?.id &&
                          <Pressable onPress={() => CatchUserToReply(item)}
                            style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 3, alignItems: "center", marginTop: 5 }}>
                            <Octicons name="reply" size={10} color={theme.colors.backdrop} />
                            <Text style={{ fontStyle: 'italic', color: theme.colors.backdrop }}>reply</Text>
                          </Pressable>
                        }
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image placeholder={blurhash} source={editProfile?.image ? editProfile?.image : require('../assets/images/placeholder_profile.png')}
              style={{
                height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                borderColor: theme.colors.dark, overflow: 'hidden'
              }} />
            <TextInput
              selectionColor={theme.colors.darkgrey}
              onChangeText={(text) => setcomment(text)}
              value={comment}
              style={styles.input} placeholder="Add a comment" />
            {comment?.length > 0 && !isPostingComment && <Pressable
              onPress={callAddComment}
              style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="black" />
            </Pressable>}
            {isPostingComment &&
              <View style={{ position: "absolute", top: 13, right: -50 }}>
                <ActivityIndicator size="small" color={theme.colors.secondary} />
              </View>
            }
          </View>
        </View>}
      <View
        onPress={() => Keyboard.dismiss()}
        style={{}}
        key={index}>
        <View style={{
          flex: 1,
          backgroundColor: "transparent",
          position: 'absolute', right: 20, bottom: 220, zIndex: 9
        }}>
          <View style={{
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
            shadowRadius: 1, elevation: 100, backgroundColor: 'transparent', alignItems: "center"
          }}>
            {liked?.isLiked ?
              <Pressable onPress={callRemoveLIke}>
                <FontAwesome name="heart" size={25} color={theme.colors.danger} />
              </Pressable> :
              !isPostingLike ?
                <Pressable onPress={callPostLike}>
                  <FontAwesome name="heart-o" size={25} color={theme.colors.light} />
                </Pressable> :
                <FontAwesome name="heart-o" size={25} color={theme.colors.light} />
            }
            <Pressable onPress={() => setShowLikedUsers(!ShowLikedUsers)}>
              <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}</Text>
            </Pressable>

          </View>
        </View>
        {userInfo?.id === item?.user_id &&
          <View style={{
            borderRadius: 100,
            overflow: "hidden",
            flex: 1,
            backgroundColor: "transparent",
            position: 'absolute', right: 20, bottom: 105, zIndex: 9
          }}>
            <View style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
              shadowRadius: 1, elevation: 100, backgroundColor: 'transparent', alignItems: "center"
            }}>
              <Pressable onPress={() => setShowOption(true)}>
                <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.light} />
              </Pressable>
            </View>
          </View>
        }

        <View style={{
          position: 'absolute', top: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
          opacity: 0.1, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1,
          shadowRadius: 5, zIndex: 9
        }}></View>
        <View style={{
          position: 'absolute', bottom: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
          opacity: 0.2, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: -20 }, shadowOpacity: 1,
          shadowRadius: 5, zIndex: 9
        }}></View>
        <View style={{
          borderRadius: 100,
          overflow: "hidden",
          flex: 1,
          backgroundColor: "transparent",
          position: 'absolute', right: 20, bottom: 150, zIndex: 9
        }}>
          <View style={{
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
            shadowRadius: 1, elevation: 100, backgroundColor: 'transparent', alignItems: "center"
          }}>
            <TouchableWithoutFeedback onPress={() => setCommentsVisible(!CommentsVisible)}>
              <Ionicons name={`${CommentsVisible ? 'chatbubble' : 'chatbubble-outline'}`} size={25} color={theme.colors.light} />
            </TouchableWithoutFeedback>
            <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{AllComments?.length}</Text>
          </View>
        </View>
        {!CommentsVisible && <View style={{
          borderRadius: 100,
          overflow: "hidden",
          flex: 1,
          backgroundColor: "transparent",
          zIndex: 9,
          position: 'absolute', right: 20, bottom: 40,
        }}>
          <Text style={{
            color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium,
            shadowColor: theme.colors.dark, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            {`${index + 1}/${CarouselMoment?.length}`}</Text>
        </View>
        }

        {item.caption && !CommentsVisible &&
          <BlurView style={{
            overflow: "hidden",
            flex: 1,
            width: '80%',
            backgroundColor: "transparent",
            position: 'absolute', left: 20, bottom: 30, zIndex: 9,
            padding: 10, borderRadius: 10
          }}>
            <Text style={{
              color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              {item.caption}
            </Text>
          </BlurView>}
        <Image placeholder={blurhash} style={{
          height: '100%',
          width: '100%',
        }}
          source={BASE_URL + item.moment} />
      </View>
      <BottomSheet
        visible={ShowOption}
        onBackdropPress={() => setShowOption(!ShowOption)}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={callDeleteMoment} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Feather name="trash" size={22} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>Delete this moment</Text>
          </Pressable>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={ShowLikedUsers}
        onBackdropPress={() => setShowLikedUsers(false)}>
        <View style={[styles.card2, { backgroundColor: theme.colors.light }]}>
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
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: theme.colors.dark,
    paddingHorizontal: 20,
    paddingRight: 50,
    backgroundColor: theme.colors.light,
    width: width - 90,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.smallMedium,
    fontWeight: 'medium'
  },
  card: {
    height: 90,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
  },
  card2: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    maxHeight: height - 50,
    paddingBottom: 20
  },
  button: {
    position: 'absolute',
    top: 10,
    right: -50,
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

export default memo(MomentPostExpanded)