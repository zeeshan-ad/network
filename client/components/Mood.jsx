import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import {Image} from 'expo-image';

const Mood = () => {
  return (
    <View style={{ position: 'relative', alignItems: 'center', zIndex: 9 }}>
      <Image source={require('../assets/images/tzara.jpg')}
        style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
      <View style={{
        position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
        backgroundColor: theme.colors.secondary, left: 0, top: -15, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 100
      }} >
        <Text numberOfLines={1} ellipsizeMode='clip' style={{ fontSize: fontSizes.large, }}>🌉👓👻</Text>
      </View>
      <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara</Text>
    </View>
  )
}

export default Mood;