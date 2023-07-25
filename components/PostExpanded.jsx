import React, { useState, useEffect, memo } from 'react';
import { View, Text, Dimensions, Pressable, StyleSheet, KeyboardAvoidingView, } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL, fontSizes, fontWeights, theme } from '../util/constants';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { getMomentIdDate } from '../APIs';
import MomentPostExpanded from './MomentPostExpanded';
import { formatTime } from '../util/functions';



const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostExpanded = ({ navigation, route }) => {
  const userInfo = route?.params?.user ? route.params.user : useSelector(state => state.userInfo);
  const moment = route?.params?.moment;
  const MomentbyId = route?.params?.MomentbyId;
  const editProfile = useSelector(state => state.editProfile);

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

  const [CurrentIndex, setCurrentIndex] = useState(0)


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
            <Pressable onPress={() => navigation.navigate('Profile',
              {
                userId: CarouselMoment?.[0]?.user_id !== userInfo?.id ? CarouselMoment?.[0]?.user_id : null,
                themeColor: CarouselMoment?.[0]?.user_id !== userInfo?.id ? CarouselMoment?.[0]?.theme : editProfile?.theme
              })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                
              <Image source={!user?.image.includes('null') ? user?.image : require('../assets/images/placeholder_profile.png')}
                style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.light, overflow: 'hidden' }} />
              <View>
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.light, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                  shadowRadius: 1, elevation: 10,
                }}>
                  {user?.name}
                </Text>
                <Text style={{
                  color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.smallMedium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                  shadowRadius: 1, elevation: 10
                }}>{formatTime(CarouselMoment?.[CurrentIndex]?.created_at)}</Text>
              </View>
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
            onSnapToItem={(index) => setCurrentIndex(index)}
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