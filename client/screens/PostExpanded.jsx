import React, { useState } from 'react';
import { View, Text, Dimensions, ImageBackground, Pressable, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { BlurView } from 'expo-blur';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostExpanded = ({ navigation }) => {


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
    "photo": require("../assets/images/5.jpeg"),
    "caption": "Sky <3"

  }, {
    "photo": require("../assets/images/6.jpeg"),
    "caption": "heart eyes 😍",
  }]

  const comments = [
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
  ]

  const [CommentsVisible, setCommentsVisible] = useState(false);

  return (
    <KeyboardAvoidingView behavior='height'>
      {/* <DismissKeyboard> */}
      <View>
        {CommentsVisible &&
          <View style={{
            position: 'absolute', bottom: 70, marginLeft: 20, minWidth: 200,
            maxWidth: width - 100, maxHeight: height/2.6, zIndex: 9
          }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {comments.map((item, index) => {
                return (
                  <View key={index} style={{ flexDirection: 'row' }}>
                    <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
                      style={{
                        height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                        borderColor: theme.colors.dark, overflow: 'hidden'
                      }} />
                    <View key={index} style={{
                      backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 150
                    }}>
                      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                        <View>
                          <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark }}>
                            Zeeshan Ahmed
                          </Text>
                          <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                            {item.comment}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
            <View style={{ flexDirection: 'row' }}>
              <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
                style={{
                  height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                  borderColor: theme.colors.dark, overflow: 'hidden'
                }} />
              <TextInput
                selectionColor={theme.colors.secondary}
                style={styles.input} placeholder="Add a comment" />
            </View>
          </View>}
        <View style={{
          position: 'absolute', marginHorizontal: 20, top: 60, flexDirection: 'row', marginBottom: 10,
          justifyContent: 'space-between', width: width, alignItems: 'center', zIndex: 9
        }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
            </Pressable>
            <ImageBackground source={require('../assets/images/tzara.jpg')}
              style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.light, overflow: 'hidden' }} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.light }}>
              Tzara Ali
            </Text>
          </View>
        </View>
        <Carousel
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          width={width}
          loop={false}
          data={picDummy}
          onSnapToItem={(index) => console.log('current index:', index)}
          modeConfig={{
            stackInterval: 18,
          }}
          renderItem={({ index }) => {
            return (
              <View
                onPress={() => Keyboard.dismiss()}
                style={{}}
                key={index}>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  position: 'absolute', right: 20, bottom: 150, zIndex: 9
                }}>
                  <BlurView intensity={20} style={{
                    padding: 10,
                    alignItems: 'center',
                  }}>
                    <FontAwesome name="heart-o" size={25} color={theme.colors.light} />
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>257</Text>
                  </BlurView>
                </View>
                <View style={{
                  position: 'absolute', top: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
                  opacity: 0.1, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1,
                  shadowRadius: 5, zIndex: 9
                }}></View>
                <View style={{
                  position: 'absolute', bottom: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
                  opacity: 0.2, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: -20 }, shadowOpacity: 1,
                  shadowRadius: 5, zIndex: 9
                }}></View>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  position: 'absolute', right: 20, bottom: 70, zIndex: 9
                }}>
                  <BlurView intensity={20} style={{
                    padding: 10,
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback onPress={() => setCommentsVisible(!CommentsVisible)}>
                      <Ionicons name={`${CommentsVisible ? 'chatbubble' : 'chatbubble-outline'}`} size={25} color={theme.colors.light} />
                    </TouchableWithoutFeedback>
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>14</Text>
                  </BlurView>
                </View>
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9,
                  position: 'absolute', right: 30, bottom: 30,
                }}>
                  <Text style={{ color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium }}>
                    {`${index + 1}/${picDummy.length}`}</Text>
                </View>

                <View style={{
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9,
                  position: 'absolute', right: 20, top: 75
                }}>
                  <Text style={{ color: theme.colors.light, fontWeight: fontWeights.semibold, fontSize: fontSizes.medium }}>
                    2 hours</Text>
                </View>

                {picDummy[index].caption &&
                  <View style={{
                    borderRadius: 100,
                    overflow: "hidden",
                    flex: 1,
                    width: '80%',
                    backgroundColor: "transparent",
                    position: 'absolute', left: 20, bottom: 30, zIndex: 9
                  }}>
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium }}>
                      {picDummy[index].caption}
                    </Text>
                  </View>}
                <ImageBackground style={{
                  height: '100%',
                  width: '100%',
                }}
                  resizeMode='cover'
                  source={picDummy[index].photo} />
              </View>
            )
          }}
        />
      </View>
      {/* </DismissKeyboard> */}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: theme.colors.dark,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light,
    width: width - 150,
    maxWidth: 300,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default PostExpanded;