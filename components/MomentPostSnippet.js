import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { getComments, isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';

const MomentPostSnippet = ({ navigation, item, index, moment }) => {

  const [liked, setLiked] = useState();
  const isFocused = useIsFocused();


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


  const [AllComments, setAllComments] = useState();

  const callGetComment = async () => {
    const response = await getComments(item.id, 'moment');
    if (response.status === 200) {
      setAllComments(response.data.data);
    }
  }

  useEffect(() => {
    CallIsliked();
    callGetComment();
  }, [isFocused])


  return (
    <View
      style={{ marginHorizontal: 10, borderWidth: 2, borderRadius: 22 }}
      key={index}>
      <View style={{
        flex: 1,
        backgroundColor: "transparent",
        zIndex: 9999,
        position: 'absolute', right: 10, top: 30,
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
              </Pressable>
              :
              <FontAwesome name="heart-o" size={25} color={theme.colors.light} />
          }
          <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}</Text>
        </View>
      </View>
      <View style={{
        flex: 1,
        backgroundColor: "transparent",
        zIndex: 9999,
        position: 'absolute', right: 10, top: 90,
      }}>

        <View style={{
          shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
          shadowRadius: 1, elevation: 100, backgroundColor: 'transparent', alignItems: "center"
        }}>
          <Ionicons name="chatbubble-outline" size={25} color={theme.colors.light} />

          <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{AllComments?.length}</Text>
        </View>
      </View>
      <View style={{
        flex: 1,
        backgroundColor: "transparent",
        zIndex: 9999,
        position: 'absolute', right: 10, bottom: 10,
      }}>
        <Text style={{
          color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.smallMedium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
          shadowRadius: 1, elevation: 10,
        }}>
          {`${index + 1}/${moment?.length}`}</Text>
      </View>

      <View style={{
        overflow: "hidden",
        flex: 1,
        backgroundColor: "transparent",
        zIndex: 9999,
        position: 'absolute', left: 10, top: 10,
      }}>
        <Text style={{
          color: theme.colors.light, fontWeight: fontWeights.semibold, fontSize: fontSizes.smallMedium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
          shadowRadius: 1, elevation: 10,
        }}>
          {convertTimeStamp(item?.created_at)}</Text>
      </View>

      {item.caption &&
        <BlurView style={{
          overflow: "hidden",
          flex: 1,
          width: '80%',
          backgroundColor: "transparent",
          zIndex: 9999,
          position: 'absolute', left: 10, bottom: 10,
          padding: 10, borderRadius: 10
        }}>
          <Text style={{
            color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium,
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            {item.caption}
          </Text>
        </BlurView>}
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('PostExpanded', { moment, id: item.id, jumpToIndex: index })}>
        <Image style={{
          height: '100%',
          width: '100%',
          borderRadius: 20
        }}
          source={BASE_URL + item.moment} />
      </TouchableWithoutFeedback>
    </View>
  )
}

export default MomentPostSnippet;