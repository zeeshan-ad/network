import React from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import { fontSizes } from '../util/constants';


const LandingBackground = () => {
  return (
    <View style={{ opacity: 0.9, height: '40%', opacity: 0.5 }}>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#00D9F0', textAlign: 'justify' }]}>
        REAL SELF
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#F506BF', textAlign: 'right' }]}>
        Authentic voices
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#9155FD', textAlign: 'justify' }]}>
        bold expressions
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#F96300', textAlign: 'justify' }]}>
        Good vibes
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#F5C900', textAlign: 'justify' }]}>
        Share with world
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#CEAD7B', textAlign: 'justify' }]}>
        Discover
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#FF9381', textAlign: 'right' }]}>
        laugh
      </Text>
      <Text numberOfLines={3} ellipsizeMode='clip' style={[styles.tagline, {lineHeight:57 ,color: '#0162CC', textAlign: 'justify' }]}>
        friends
      </Text>
    </View>
  )
}


const styles = StyleSheet.create({
  tagline: {
    fontSize: fontSizes.bg,
    fontWeight: 400,
    fontFamily: 'Tiny',
    textTransform: 'uppercase',
  },
});

export default LandingBackground;