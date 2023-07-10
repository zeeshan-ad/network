import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';

const FlatListHeaderMemo = ({liked, navigation, callPostLike, callRemoveLIke, memo, AllComments, userInfo }) => {
  return (
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
            <Image source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/placeholder_profile.png')}
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
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{AllComments?.length}
            <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;comments</Text></Text>
        </View>
      </View>
    </View>
  )
}

export default memo(FlatListHeaderMemo);