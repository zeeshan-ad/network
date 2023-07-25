import React, { useState, memo, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { getComments } from '../APIs/getComments';
import { formatTime } from '../util/functions';

const PostTextSnippet = ({ navigation, memo }) => {
  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);
  const isFocused = useIsFocused();

  const [liked, setLiked] = useState(false);

  const CallIsliked = async () => {
    const response = await isLiked(memo.id, 'memo');
    if (response.status === 200) {
      setLiked(response.data.data);
    }
  }

  const [isPostingLike, setisPostingLike] = useState(false)
  const callPostLike = async () => {
    setisPostingLike(true);
    const response = await postLike(memo.id, 'memo');
    if (response.status === 200) {
      setisPostingLike(false);
      CallIsliked();
    } else {
      setisPostingLike(false);
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(memo.id, 'memo');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  const [AllComments, setAllComments] = useState();

  const callGetComment = async () => {
    const response = await getComments(memo.id, 'memo');
    if (response.status === 200) {
      setAllComments(response.data.data);
    }
  }


  useEffect(() => {
    CallIsliked();
    callGetComment();
  }, [isFocused])

  return (
    <View style={{
      minHeight: 150, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, paddingVertical: 10, marginVertical: 10,
      borderWidth: 2, borderColor: theme.colors.dark, marginHorizontal: 10, borderRadius: 20, justifyContent: 'space-between'
    }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.navigate('Profile',
          {
            userId: memo?.user_id !== userInfo?.id ? memo?.user_id : null,
            themeColor: memo?.user_id !== userInfo?.id ? memo?.theme : editProfile?.theme
          })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/placeholder_profile.png')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <View>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>{memo?.name}</Text>
            <Text numberOfLines={2} style={{
              color: theme.colors.dark, fontWeight: fontWeights.light,
              fontSize: fontSizes.smallMedium, width: 100
            }}>
              {formatTime(memo?.created_at)}
            </Text>
          </View>
        </Pressable>
      </View>
      <View>
        <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: fontSizes.yeetPosts, lineHeight: 30 }}>
          {memo?.memo}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 2, paddingTop: 10 }}>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          {liked?.isLiked ?
            <Pressable onPress={callRemoveLIke}>
              <FontAwesome name="heart" size={23} color={theme.colors.danger} />
            </Pressable> :
            !isPostingLike ?
              <Pressable onPress={callPostLike}>
                <FontAwesome name="heart-o" size={23} color={theme.colors.dark} />
              </Pressable> :
              <FontAwesome name="heart-o" size={23} color={theme.colors.dark} />
          }
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}
            <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;{liked?.totalLikes < 2 ? 'like' : 'likes'}</Text></Text>
        </View>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('PostTextExpanded', { memo })} style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{AllComments?.length}
            <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;comments</Text></Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

export default memo(PostTextSnippet);