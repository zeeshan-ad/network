import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Dimensions, ImageBackground, Keyboard, Pressable, TextInput, View } from 'react-native';
import { theme } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';
import { postMoment } from '../APIs';


const { width } = Dimensions.get('window');

const CameraPreview = ({ navigation, route }) => {

  const { Image } = route.params;

  const [Posting, setPosting] = useState(false);
  const [Caption, setCaption] = useState('');

  const callPostMoment = async () => {
    setPosting(true);
    const response = await postMoment(Image?.uri, Caption);
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
        <ImageBackground
          source={{ uri: Image?.uri }}
          style={{
            width: width, flex: 1,
          }}
        />
        <TextInput selectionColor={theme.colors.dark} placeholder="Add a caption"
          onChangeText={setCaption} style={{
            position: 'absolute', bottom: 20,
            width: width - 40, height: 50, backgroundColor: theme.colors.light, borderRadius: 100, paddingHorizontal: 20,
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10, borderWidth: 2, borderColor: theme.colors.dark
          }} />
      </View>
    </KeyboardAvoidingView>
  )
}

export default CameraPreview;