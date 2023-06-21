import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';

const Mood = () => {
  return (
    <View style={{ position: 'relative', alignItems: 'center', zIndex: 9 }}>
      <ImageBackground source={require('../assets/images/tzara.jpg')}
        style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
      <View style={{
        position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
        backgroundColor: theme.colors.secondary, left: 0, top: -15, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100
      }} >
        <Text style={{ fontSize: fontSizes.large, }}>🌻🤗🌞</Text>
      </View>
      <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara</Text>
    </View>
  )
}

export default Mood;