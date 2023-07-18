import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme, fontSizes, fontWeights, BASE_URL } from '../util/constants';
import { Image } from 'expo-image';

const Mood = ({ navigation, FriendsMood }) => {
  return (
    FriendsMood?.map((item, index) => {
      return (
        <Pressable onPress={() => navigation.navigate('Profile', { userId: item?.userID })} key={index} style={{ position: 'relative', alignItems: 'center', zIndex: 9 }}>
          {!item?.profile_pic ? <Image source={require('../assets/images/placeholder_profile.png')}
            style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
            : <Image source={BASE_URL + item?.profile_pic}
              style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />}
          <View style={{
            position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
            backgroundColor: item?.theme ? item.theme : theme.colors.secondary, left: 0, top: -15, padding: 3, borderRadius: 100
          }} >
            <Text numberOfLines={1} ellipsizeMode='clip' style={{
              width: 70, textAlign: 'center', fontSize: fontSizes.medium, height: 22, paddingVertical: 2, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>{item?.mood}</Text>
          </View>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>
            {item?.name + ' '.substring(0, item.name + ' '.indexOf(' '))}</Text>
        </Pressable>
      )
    })
  )
}

export default Mood;