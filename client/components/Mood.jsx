import React from 'react';
import { View, Text } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import { Image } from 'expo-image';

const Mood = () => {
  return (
    <View style={{ position: 'relative', alignItems: 'center', zIndex: 9 }}>
      <Image source={require('../assets/images/tzara.jpg')}
        style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
      <View style={{
        position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
        backgroundColor: theme.colors.secondary, left: 0, top: -15, padding: 3, borderRadius: 100
      }} >
        <Text numberOfLines={1} ellipsizeMode='clip' style={{
          width: 70, textAlign: 'center', fontSize: fontSizes.medium, height: 22, paddingVertical: 2, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
          shadowRadius: 1, elevation: 10,
        }}>🌉👓👻</Text>
      </View>
      <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara</Text>
    </View>
  )
}

export default Mood;