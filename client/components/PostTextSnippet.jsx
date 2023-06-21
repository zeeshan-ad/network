import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, ImageBackground } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const PostTextSnippet = ({ navigation }) => {


  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('PostTextExpanded')} style={{
      minHeight: 150, backgroundColor: theme.colors.textPost, paddingVertical: 10, marginVertical: 10,
      borderWidth: 2, borderColor: theme.colors.dark, marginHorizontal: 10, borderRadius: 20, justifyContent: 'space-between'
    }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <ImageBackground source={require('../assets/images/tzara.jpg')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara Ali</Text>
        </View>
        <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.light, fontSize: fontSizes.smallMedium}}>20 mins ago</Text>
      </View>
      <View>
        <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: fontSizes.yeetPosts }}>
          I think I sunk the titanic. 🚢 🌊
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <FontAwesome name="heart-o" size={25} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>257</Text>
        </View>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>12</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default PostTextSnippet;