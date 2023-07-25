import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { Image } from 'expo-image';
import MomentPostSnippet from './MomentPostSnippet';
import { useSelector } from 'react-redux';
import { formatTime } from '../util/functions';


const PostSnippet = ({ navigation, moment }) => {

  const { width, height } = Dimensions.get("window");

  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);
  const [CurrentIndex, setCurrentIndex] = useState(0)


  return (
    <View style={{ paddingVertical: 10, position: 'relative' }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.navigate('Profile', {
          userId: moment?.[0]?.user_id !== userInfo?.id ? moment?.[0]?.user_id : null,
          themeColor: moment?.[0]?.user_id !== userInfo?.id ? moment?.[0]?.theme : editProfile?.theme
        })}
          style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image source={moment?.[0]?.profile_pic ? BASE_URL + moment?.[0]?.profile_pic : require('../assets/images/placeholder_profile.png')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <View>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>{moment?.[0]?.name}</Text>
            <Text style={{ color: theme.colors.backdrop }}>{formatTime(moment?.[CurrentIndex]?.created_at)}</Text>
          </View>
        </Pressable>
        <View style={{ marginRight: 5 }}>
          <Text
            style={{ fontSize: fontSizes.smallMedium, fontWeight: fontWeights.normal, paddingTop: 5, color: theme.colors.backdrop }}>
            {moment.length > 1 && `moment ${CurrentIndex + 1} of ${moment?.length}`}</Text>
        </View>
      </View>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        width={width}
        loop={false}
        height={height > 450 ? height - 350 : 450}
        data={moment}
        onSnapToItem={(index) => setCurrentIndex(index)}
        modeConfig={{
          stackInterval: 18,
        }}
        renderItem={({ item, index }) => {
          return (
            <MomentPostSnippet key={index} navigation={navigation} item={item} index={index} moment={moment} />
          )
        }}
      />
    </View >
  )
}

export default PostSnippet;