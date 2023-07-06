import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Pressable, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertUtcToLocal, fontSizes, fontWeights, theme } from '../util/constants';
import { BlurView } from 'expo-blur';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostExpanded = ({ navigation, route }) => {
  const userInfo = useSelector(state => state.userInfo);
  const moment = route?.params?.moment;
  console.log(moment);

  const comments = [
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
  ]

  const [CommentsVisible, setCommentsVisible] = useState(false);
  const [ShowBtn, setShowBtn] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowBtn(true);
    }, 3000)

    return () => {
      clearInterval(timeout);
    }
  }, [])


  return (
    <KeyboardAvoidingView behavior='padding' style={{
      backgroundColor: theme.colors.light,
    }}>
      <View>
        {CommentsVisible &&
          <View style={{
            position: 'absolute', bottom: 70, marginLeft: 20, minWidth: 200,
            maxWidth: width - 100, maxHeight: height / 2.6, zIndex: 9
          }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {comments.map((item, index) => {
                return (
                  <View key={index} style={{ flexDirection: 'row' }}>
                    <Image source={require('../assets/images/profilepic-dummy.jpg')}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../assets/images/profilepic-dummy.jpg')}
                style={{
                  height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                  borderColor: theme.colors.dark, overflow: 'hidden'
                }} />
              <TextInput
                selectionColor={theme.colors.darkgrey}
                style={styles.input} placeholder="Add a comment" />
            </View>
          </View>}
        <View style={{
          position: 'absolute', marginHorizontal: 20, top: 60, flexDirection: 'row', marginBottom: 10,
          justifyContent: 'space-between', width: width, alignItems: 'center', zIndex: 9
        }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: -10 }}>
            <Pressable onPress={() => navigation.goBack()} style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile', { userId: moment?.user_id !== userInfo?.id ? moment?.user_id : null })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={moment?.[0]?.profile_pic ? BASE_URL + moment?.[0]?.profile_pic : require('../assets/images/placeholder_profile.png')}
              style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.light, overflow: 'hidden' }} />
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.light, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              {moment?.[0]?.name}
            </Text>
            </Pressable>
          </View>
        </View>
        <Carousel
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          width={width}
          loop={false}
          data={moment}
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
                {ShowBtn && <View style={{
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
                    <FontAwesome name="diamond" size={23} color={theme.colors.light} />
                    <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>257</Text></BlurView>
                </View>}
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
                {ShowBtn && <View style={{
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
                </View>}
                <View style={{
                  borderRadius: 100,
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9,
                  position: 'absolute', right: 30, bottom: 30,
                }}>
                  <Text style={{
                    color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium,
                    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                    shadowRadius: 1, elevation: 10,
                  }}>
                    {`${index + 1}/${moment.length}`}</Text>
                </View>

                <View style={{
                  overflow: "hidden",
                  flex: 1,
                  backgroundColor: "transparent",
                  zIndex: 9,
                  position: 'absolute', right: 20, top: 75
                }}>
                  <Text style={{
                    color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.smallMedium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                    shadowRadius: 1, elevation: 10,
                  }}>
                    {convertUtcToLocal(moment?.[index]?.created_at)}</Text>
                </View>

                {moment[index].caption &&
                  <View style={{
                    borderRadius: 100,
                    overflow: "hidden",
                    flex: 1,
                    width: '80%',
                    backgroundColor: "transparent",
                    position: 'absolute', left: 20, bottom: 30, zIndex: 9
                  }}>
                    <Text style={{
                      color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                      shadowRadius: 1, elevation: 10,
                    }}>
                      {moment[index].caption}
                    </Text>
                  </View>}
                <Image style={{
                  height: '100%',
                  width: '100%',
                }}
                  source={BASE_URL + moment[index].moment} />
              </View>
            )
          }}
        />
      </View>
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