import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Dimensions, ImageBackground, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';

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

  return (
    <View style={{
      minHeight: 150, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, paddingVertical: 10, marginVertical: 10,
      borderWidth: 2, borderColor: theme.colors.dark, marginHorizontal: 10, borderRadius: 20, justifyContent: 'space-between'
    }}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('PostTextExpanded', { memo })}>
        <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/placeholder_profile.png')}
              style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>{memo?.name}</Text>
          </View>
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.light, fontSize: fontSizes.smallMedium }}>{convertTimeStamp(memo?.created_at)}</Text>
        </View>
        <View>
          <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: fontSizes.yeetPosts, lineHeight: 30 }}>
            {memo?.memo}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flexDirection: 'row', borderTopWidth: 2, paddingTop: 10 }}>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
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
  )
}

export default memo(PostTextSnippet);