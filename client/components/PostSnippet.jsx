import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';

const PostSnippet = ({ navigation }) => {

  const width = Dimensions.get("window").width;

  const picDummy = [{
    "photo": require("../assets/images/1.jpeg"),
    "caption": "Hello Shadow"
  }, {
    "photo": require("../assets/images/2.jpeg"),
    "caption": "Study!!!"
  }, {
    "photo": require("../assets/images/3.jpeg"),
    "caption": "Imma ded 💀"
  }, {
    "photo": require("../assets/images/4.jpeg"),
    "caption": "heart eyes 😍"
  }, {
    "photo": require("../assets/images/5.jpeg")
  }, {
    "photo": require("../assets/images/6.jpeg")
  }]

  return (
    <View style={{ paddingVertical: 10, position: 'relative' }}>
      <View style={{ marginHorizontal: 10, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image source={require('../assets/images/tzara.jpg')}
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara Ali</Text>
        </View>
      </View>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        width={width}
        loop={false}
        height={450}
        data={picDummy}
        onSnapToItem={(index) => console.log('current index:', index)}
        modeConfig={{
          stackInterval: 18,
        }}
        renderItem={({ index }) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('PostExpanded')}>
              <View
                style={{ marginHorizontal: 10, borderWidth: 2, borderRadius: 22 }}
                key={index}>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9999,
                  position: 'absolute', right: 10, top: 10,
                }}>
                  <BlurView intensity={20} style={{
                    padding: 10,
                    alignItems: 'center',
                  }}>
                    <FontAwesome name="diamond" size={23} color={theme.colors.light} />
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>257</Text>
                  </BlurView>
                </View>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9999,
                  position: 'absolute', right: 10, top: 90,
                }}>
                  <BlurView intensity={20} style={{
                    padding: 10,
                    alignItems: 'center',
                  }}>
                    <Ionicons name="chatbubble-outline" size={25} color={theme.colors.light} />

                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>14</Text>
                  </BlurView>
                </View>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9999,
                  position: 'absolute', right: 10, bottom: 10,
                }}>
                  <Text style={{ color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.smallMedium }}>{`${index + 1}/${picDummy.length}`}</Text>
                </View>

                <View style={{
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9999,
                  position: 'absolute', left: 10, top: 10,
                }}>
                  <Text style={{ color: theme.colors.light, fontWeight: fontWeights.semibold, fontSize: fontSizes.smallMedium }}>
                    2 hours</Text>
                </View>

                {picDummy[index].caption &&
                  <View style={{
                    borderRadius: 100,
                    overflow: "hidden",
                    flex: 1,
                    width: '80%',
                    backgroundColor: "transparent",
                    zIndex: 9999,
                    position: 'absolute', left: 10, bottom: 10,
                  }}>
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium }}>
                      {picDummy[index].caption}
                    </Text>
                  </View>}
                <Image style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 20
                }}
                  source={picDummy[index].photo} />
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      />
    </View>
  )
}

export default PostSnippet;