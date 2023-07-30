import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Text, Dimensions, ImageBackground, Keyboard, Pressable, TextInput, View } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';
import { postMoment } from '../APIs';
import moment from 'moment-timezone';


const { width } = Dimensions.get('window');

const CameraPreview = ({ navigation, route }) => {

  const { Image } = route.params;

  const [Posting, setPosting] = useState(false);
  const [Caption, setCaption] = useState('');

  // handleCaption function to set text as caption if length is less than 400
  const handleCaption = (text) => {
    console.log(text.length)
    if (text.length <= 400) {
      setCaption(text);
    } 
  }

  const callPostMoment = async () => {
    setPosting(true);
    const response = await postMoment(Image?.uri, Caption, moment().format('DDMMYYYY'));
    if (response?.status === 200) {
      setPosting(false);
      navigation.navigate('Feed');
    } else {
      setPosting(false);
      alert('Something went wrong, please try again later');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>

      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20
        }}
      >
        <View style={{
          position: 'absolute',
          top: 60,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          zIndex: 9999,
        }}>
          <Pressable onPress={() => navigation.goBack()} style={{
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            <Ionicons name="close" size={30} color={theme.colors.light} />
          </Pressable>
          {Posting ?
            <ActivityIndicator style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }} size="small" color={theme.colors.light} /> :
            <Pressable onPress={() => {
              Keyboard.dismiss();
              callPostMoment();
            }}
              style={{
                shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                shadowRadius: 1, elevation: 10,
              }}>
              <Ionicons name="checkmark-sharp" size={30} color={theme.colors.light} />
            </Pressable>
          }
        </View>
        <Pressable onPress={() => Keyboard.dismiss()} >
          <ImageBackground
            source={{ uri: Image?.uri }}
            style={{
              width: width, flex: 1,
            }}
          />
        </Pressable>
        <View style={{ position: 'absolute', bottom: 20 }}>
          <TextInput multiline={true} selectionColor={theme.colors.selectionColor} placeholder="Add a caption"
            value={Caption}
            onChangeText={handleCaption} style={{
              paddingTop: 10, paddingBottom: 10,
              width: width - 40, height: 80, backgroundColor: theme.colors.light, borderRadius: 10, paddingHorizontal: 10,
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10, borderWidth: 2, borderColor: theme.colors.dark
            }} />
          <Text style={{
            position: 'absolute', bottom: 85, fontWeight: fontWeights.semibold, fontSize: fontSizes.smallMedium,
            color: Caption?.length > 400 ? theme.colors.danger : theme.colors.light, shadowColor: theme.colors.dark,
            shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10, right: 5
          }}>{Caption?.length}/400</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CameraPreview;