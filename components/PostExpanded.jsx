import React, { useState, useEffect, memo } from 'react';
import { View, Text, Dimensions, Pressable, StyleSheet, KeyboardAvoidingView, } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { getMomentIdDate } from '../APIs';
import MomentPostExpanded from './MomentPostExpanded';



const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostExpanded = ({ navigation, route }) => {
  const userInfo = route?.params?.user ? route.params.user : useSelector(state => state.userInfo);
  const moment = route?.params?.moment;
  const MomentbyId = route?.params?.MomentbyId;

  const { date, user, jumpToIndex } = route.params;
  // const [MomentbyId, setMomentbyId] = useState();

  // const callGetMomentsIdDate = async () => {
  //   const response = await getMomentIdDate(date, user?.id, timeZone);
  //   if (response?.status === 200) {
  //     setMomentbyId(response?.data?.data);
  //   }
  // }


  // useEffect(() => {
  //   callGetMomentsIdDate();
  // }, [date, user])


  const [CarouselMoment, setCarouselMoment] = useState();
  useEffect(() => {
    if (moment) {
      setCarouselMoment(moment);
    } else if (MomentbyId) {
      setCarouselMoment(MomentbyId);
    }
  }, [moment, MomentbyId])


  return (
    <KeyboardAvoidingView behavior='padding' style={{
      backgroundColor: theme.colors.light,
    }}>
      <View>
        <View style={{
          position: 'absolute', marginHorizontal: 20, top: 60, flexDirection: 'row', marginBottom: 10,
          justifyContent: 'space-between', width: width, alignItems: 'center', zIndex: 9
        }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: -10 }}>
            <Pressable onPress={() => navigation.goBack()} style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile', { userId: CarouselMoment?.[0]?.user_id !== userInfo?.id ? CarouselMoment?.[0]?.user_id : null })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={user?.image ? user?.image : require('../assets/images/placeholder_profile.png')}
                style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.light, overflow: 'hidden' }} />
              <Text style={{
                fontSize: fontSizes.medium, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.light, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                shadowRadius: 1, elevation: 10,
              }}>
                {user?.name}
              </Text>
            </Pressable>
          </View>
        </View>
        {CarouselMoment?.length > 0 &&
          <Carousel
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            defaultIndex={jumpToIndex}
            width={width}
            loop={false}
            data={CarouselMoment}
            modeConfig={{
              stackInterval: 18,
            }}
            renderItem={({ item, index }) => {
              return (
                <MomentPostExpanded navigation={navigation} item={item} index={index} CarouselMoment={CarouselMoment} date={date} />
              )
            }}
          />}

      </View>
    </KeyboardAvoidingView>
  )
}


export default memo(PostExpanded);