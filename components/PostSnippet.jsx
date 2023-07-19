import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { Image } from 'expo-image';
import MomentPostSnippet from './MomentPostSnippet';
import { useSelector } from 'react-redux';


const PostSnippet = ({ navigation, moment }) => {

  const width = Dimensions.get("window").width;

  const userInfo = useSelector(state => state.userInfo);

  return (
    <View style={{ paddingVertical: 10, position: 'relative' }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.navigate('Profile', { userId: moment?.[0]?.user_id !== userInfo?.id ? moment?.[0]?.user_id : null })}  style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image source={moment?.[0]?.profile_pic ? BASE_URL + moment?.[0]?.profile_pic : require('../assets/images/placeholder_profile.png')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>{moment?.[0]?.name}</Text>
        </Pressable>
      </View>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        width={width}
        loop={false}
        height={450}
        data={moment}
        onSnapToItem={(index) => console.log('current index:', index)}
        modeConfig={{
          stackInterval: 18,
        }}
        renderItem={({ item, index }) => {
          return (
            <MomentPostSnippet  key={index} navigation={navigation} item={item} index={index} moment={moment}/>
          )
        }}
      />
    </View >
  )
}

export default memo(PostSnippet);