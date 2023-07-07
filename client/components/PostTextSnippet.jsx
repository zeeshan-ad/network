import React, { useState, useRef, memo } from 'react';
import { View, Text, Dimensions, ImageBackground } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';

const PostTextSnippet = ({ navigation, memo }) => {
  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('PostTextExpanded', { memo, editProfile, userInfo })} style={{
      minHeight: 150, backgroundColor: memo?.theme ? memo?.theme : theme.colors.textPost, paddingVertical: 10, marginVertical: 10,
      borderWidth: 2, borderColor: theme.colors.dark, marginHorizontal: 10, borderRadius: 20, justifyContent: 'space-between'
    }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/placeholder_profile.png')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>{memo?.name}</Text>
        </View>
        <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.light, fontSize: fontSizes.smallMedium }}>{convertTimeStamp(memo?.created_at)}</Text>
      </View>
      <View>
        <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: fontSizes.yeetPosts }}>
          {memo?.memo}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <FontAwesome name="diamond" size={23} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>257</Text>
        </View>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>12</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default memo(PostTextSnippet);