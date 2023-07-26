import React from 'react'
import { View, Text, RefreshControl } from 'react-native'
import { BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants'
import { Dimensions } from 'react-native';
import { formatTime } from '../util/functions';
import { BlurView } from 'expo-blur';
import { FlatList } from 'react-native';
import { Pressable } from 'react-native';
import { Image } from 'expo-image/build';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';


const { width, height } = Dimensions.get('window');

const ProfileMomentsTab = ({ AllMoments, refreshing, onRefresh, editProfile, userInfo, momentsGroup, navigation, userId, ProfileInfo }) => {
  return (
    <FlatList
      key={'_'}
      data={AllMoments}
      style={{ height: height, paddingTop: 5, paddingHorizontal: 5 }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 300 }}></View>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => navigation.navigate("PostExpanded",
          {
            date: item?.created_at,
            user:!userId ? { ...editProfile, ...userInfo } : { ...ProfileInfo, image: BASE_URL + ProfileInfo?.profile_pic },
            MomentbyId: momentsGroup[index]
          })}
          style={{
            flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: width / 2 - 15, marginHorizontal: 5,
            marginBottom: 5, position: "relative"
          }}>
          <View style={{ width: '100%', height: 200, marginTop: 5 }}>
            <Image placeholder={blurhash} source={{ uri: BASE_URL + item?.moment }} style={{
              width: '100%', height: '100%',
              borderColor: theme.colors.backdrop, borderWidth: 2, borderRadius: 10
            }} />
            <BlurView intensity={100} style={{
              position: "absolute", bottom: 10, left: 0, width: '100%', height: 30, alignItems: 'center', justifyContent: 'center',
              borderColor: theme.colors.backdrop, borderWidth: 2,
            }} >
              <Text style={{
                color: theme.colors.light, fontSize: fontSizes.large,
                fontWeight: fontWeights.light, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
                shadowOffset: { width: 1, height: 1 }, elevation: 1
              }}>
                {formatTime(item?.created_at, 'profile')}
              </Text>
            </BlurView>
          </View>
          <View style={{
            position: 'absolute', top: 10, right: 5, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
            shadowOffset: { width: 0, height: 0 }, elevation: 1
          }}>
            <MaterialCommunityIcons name="view-carousel" size={20} color={theme.colors.light} />
          </View>
        </Pressable>
      )}
      numColumns={2}
    />
  )
}

export default memo(ProfileMomentsTab)