import React, { useState, useEffect, memo } from 'react';
import { View, Text, TextInput, Keyboard, Dimensions, Pressable, FlatList, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { addComment, isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { getComments } from '../APIs/getComments';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get("window");
const MomentPostExpanded = ({ navigation, item, index, CarouselMoment, date }) => {
  const editProfile = useSelector(state => state.editProfile);
  const userInfo = useSelector(state => state.userInfo);

  const [CommentsVisible, setCommentsVisible] = useState(false);

  const [liked, setLiked] = useState();
  const isFocused = useIsFocused();


  const CallIsliked = async () => {
    const response = await isLiked(item.id, 'moment');
    if (response.status === 200) {
      setLiked(response.data.data);
    }
  }


  const callPostLike = async () => {
    const response = await postLike(item.id, 'moment');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(item.id, 'moment');
    if (response.status === 200) {
      CallIsliked();
    }
  }
  const [comment, setcomment] = useState('')

  const callAddComment = async () => {
    const response = await addComment(item.id, 'moment', comment);
    if (response.status === 200) {
      setcomment('');
      callGetComment();
    }
  }

  const [AllComments, setAllComments] = useState();

  const callGetComment = async () => {
    const response = await getComments(item.id, 'moment');
    if (response.status === 200) {
      setAllComments(response.data.data);
    }
  }

  console.log(AllComments)


  useEffect(() => {
    CallIsliked();
    callGetComment();
  }, [isFocused])


  return (
    <>
      {CommentsVisible &&
        <View style={{
          position: 'absolute', bottom: 70, marginLeft: 20, minWidth: 200,
          maxWidth: width - 100, maxHeight: height / 2.6, zIndex: 9
        }}>
          <FlatList
            data={AllComments}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View key={index} style={{ flexDirection: 'row' }}>
                  <Pressable onPress={() => navigation.navigate('Profile', { userId: item?.user_id !== userInfo?.id ? item?.user_id : null })}>
                    <Image source={item?.profile_pic ? { uri: `${BASE_URL}${item?.profile_pic}` } : require('../assets/images/placeholder_profile.png')}
                      style={{
                        height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                        borderColor: theme.colors.dark, overflow: 'hidden'
                      }} />
                  </Pressable>
                  <View key={index} style={{
                    backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 140
                  }}>
                    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                      <View>
                        <View style={{
                          flexDirection: 'row', justifyContent: 'space-between', gap: 20, alignItems: "center"
                        }}>
                          <Pressable onPress={() => navigation.navigate('Profile', { userId: item?.user_id !== userInfo?.id ? item?.user_id : null })}>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={{
                              fontSize: fontSizes.smallMedium, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark,
                              maxWidth: width - 300
                            }}>{item.name}</Text>
                          </Pressable>
                          <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, color: theme.colors.backdrop, fontStyle: "italic" }}>{item.date}</Text>
                        </View>
                        <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                          {item.comment}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={editProfile?.image ? editProfile?.image : require('../assets/images/placeholder_profile.png')}
              style={{
                height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                borderColor: theme.colors.dark, overflow: 'hidden'
              }} />
            <TextInput
              selectionColor={theme.colors.darkgrey}
              onChangeText={(text) => setcomment(text)}
              value={comment}
              style={styles.input} placeholder="Add a comment" />
            {comment?.length > 0 && <Pressable
              onPress={callAddComment}
              style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="black" />
            </Pressable>}
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
              <Pressable onPress={callPostLike}>
                <FontAwesome name="heart-o" size={25} color={theme.colors.light} />
              </Pressable>
            }
            <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}</Text>
          </View>
        </View>
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
        <View style={{
          borderRadius: 100,
          overflow: "hidden",
          flex: 1,
          backgroundColor: "transparent",
          zIndex: 9,
          position: 'absolute', right: 20, bottom: 30,
        }}>
          <Text style={{
            color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium,
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            {`${index + 1}/${CarouselMoment?.length}`}</Text>
        </View>

        <View style={{
          overflow: "hidden",
          flex: 1,
          backgroundColor: "transparent",
          zIndex: 9,
          position: 'absolute', right: 20, top: 75
        }}>
          <Text style={{
            color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.smallMedium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            {date ? convertTimeStamp(item?.date) : convertTimeStamp(item?.created_at)}</Text>
        </View>

        {item.caption &&
          <View style={{
            borderRadius: 100,
            overflow: "hidden",
            flex: 1,
            width: '80%',
            backgroundColor: "transparent",
            position: 'absolute', left: 20, bottom: 30, zIndex: 9
          }}>
            <Text style={{
              color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              {item.caption}
            </Text>
          </View>}
        <Image style={{
          height: '100%',
          width: '100%',
        }}
          source={BASE_URL + item.moment} />
      </View>
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