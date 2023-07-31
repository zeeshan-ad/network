import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme, fontSizes, fontWeights, BASE_URL, blurhash } from '../util/constants';
import { Image } from 'expo-image';

const Mood = ({ navigation, FriendsMood }) => {
  return (
    FriendsMood?.map((item, index) => {
      return (
        <Pressable onPress={() => navigation.navigate('Profile', { userId: item?.userID, themeColor: item?.theme })}
          key={index} style={{ alignItems: 'center', zIndex: 9, borderRadius: 10 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: theme.colors.moodContainer,
            padding: 5, borderRadius:100
          }}>
            {!item?.profile_pic ?
              <Image source={require('../assets/images/placeholder_profile.png')}
                style={{ height: 25, width: 25, borderRadius: 100, borderWidth: 1, overflow: 'hidden' }} />
              : <Image placeholder={blurhash} source={BASE_URL + item?.profile_pic}
                style={{ height: 25, width: 25, borderRadius: 100, borderWidth: 1, overflow: 'hidden' }} />}
            <View style={{
              borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
              backgroundColor: item?.theme ? item.theme : theme.colors.light, padding: 3, borderRadius: 100
            }} >
              <Text numberOfLines={1} ellipsizeMode='clip' style={{
                justifyContent: 'center', alignItems: 'center',
                width: 70, textAlign: 'center', fontSize: fontSizes.medium, height: 20, paddingVertical: 2,
                shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                shadowRadius: 1, elevation: 10,
              }}>{item?.mood}
              </Text>
            </View>
          </View>
          <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: fontSizes.smallMedium, fontWeight: fontWeights.normal, paddingTop: 5, width: 80, textAlign: "center" }}>
            {item?.name + ' '.substring(0, item.name + ' '.indexOf(' '))}</Text>
        </Pressable>
      )
    })
  )
}

export default Mood;