import React, { useState, useEffect, memo } from 'react';
import { View, Text, Keyboard, Dimensions, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BASE_URL, convertTimeStamp, fontSizes, fontWeights, theme } from '../util/constants';
import { BlurView } from 'expo-blur';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { isLiked, postLike, removeLike } from '../APIs';
import { useIsFocused } from '@react-navigation/native';


const width = Dimensions.get("window").width;
const MomentPostExpanded = ({ item, index, CarouselMoment, date }) => {

  const comments = [
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
  ]

  const [CommentsVisible, setCommentsVisible] = useState(false);

  const [liked, setLiked] = useState();
  const isFocused = useIsFocused();


  const CallIsliked = async () => {
    const response = await isLiked(item.id, 'moment');
    if (response.status === 200) {
      setLiked(response.data.data);
    }
  }


  const callPostLike = async () => {
    const response = await postLike(item.id, 'moment');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  const callRemoveLIke = async () => {
    const response = await removeLike(item.id, 'moment');
    if (response.status === 200) {
      CallIsliked();
    }
  }

  useEffect(() => {
    CallIsliked();
  }, [isFocused])


  return (
    <>
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
          <BlurView intensity={60} style={{
            padding: 10,
            alignItems: 'center',
          }}>
            <View style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
              shadowRadius: 1, elevation: 2, backgroundColor: 'transparent', alignItems: "center"
            }}>
              {liked?.isLiked ?
                <Pressable onPress={callRemoveLIke}>
                  <FontAwesome name="heart" size={23} color={theme.colors.danger} />
                </Pressable> :
                <Pressable onPress={callPostLike}>
                  <FontAwesome name="heart-o" size={23} color={theme.colors.light} />
                </Pressable>
              }
              <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}</Text>
            </View>
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
          <BlurView intensity={60} style={{
            padding: 10,
            alignItems: 'center',
          }}>
            <View style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .5,
              shadowRadius: 1, elevation: 2, backgroundColor: 'transparent', alignItems: "center"
            }}>
              <TouchableWithoutFeedback onPress={() => setCommentsVisible(!CommentsVisible)}>
                <Ionicons name={`${CommentsVisible ? 'chatbubble' : 'chatbubble-outline'}`} size={25} color={theme.colors.light} />
              </TouchableWithoutFeedback>
              <Text style={{ color: theme.colors.light, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>14</Text>
            </View>
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
          <Text style={{
            color: theme.colors.light, fontWeight: fontWeights.normal, fontSize: fontSizes.medium,
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            {`${index + 1}/${CarouselMoment.length}`}</Text>
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
            {date ? convertTimeStamp(item?.date) : convertTimeStamp(item?.created_at)}</Text>
        </View>

        {item.caption &&
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
              {item.caption}
            </Text>
          </View>}
        <Image style={{
          height: '100%',
          width: '100%',
        }}
          source={BASE_URL + item.moment} />
      </View>
    </>

  )
}

export default memo(MomentPostExpanded)