import React, { useState } from 'react';
import { View, Text, Dimensions, Pressable, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';
import EmojiKeyboard from './EmojiKeyboard';
import { StyleSheet } from 'react-native';
import { updateMood } from '../APIs';

const width = Dimensions.get('window').width;

const PostMood = ({ navigation, route }) => {
  const [LoadSubmission, setLoadSubmission] = useState(false);
  const { editProfile, FetchedMood } = route.params;
  const [text, setText] = useState(FetchedMood?.mood);

  const handleEmojiSelected = (emoji) => {
    if ((text + emoji).length <= 6)
      setText(text + emoji);
  };

  const RemoveEmoji = (index) => {
    setText("");
  }

  const callupdateMood = async () => {
    setLoadSubmission(true);
    const response = await updateMood(text);
    if (response?.status === 200) {
      setLoadSubmission(false);
      navigation.goBack();
    } else {
      setLoadSubmission(false);
      alert('Something went wrong. Please try again later.');
    }
  }

  return (
    <View style={{
      flex: 1, paddingHorizontal: 20, paddingTop: 50, justifyContent: 'flex-start',
      backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light
    }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginLeft: -10 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color={theme.colors.dark} />
        </Pressable>
        {LoadSubmission ?
          (<Pressable style={{ marginRight: -10, marginTop: 10 }}>
            <ActivityIndicator size="small" color={theme.colors.dark} />
          </Pressable>) :
          (<Pressable onPress={callupdateMood} style={{ marginRight: -20 }}>
            <Ionicons name="checkmark-sharp" size={30} color={theme.colors.dark} />
          </Pressable>)
        }
      </View>
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={{
          textAlign: 'center', fontSize: fontSizes.large, fontWeight: fontWeights.normal,
          paddingTop: 5, color: theme.colors.dark
        }}>
          Use emojis to express your mood
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {text ?
          <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pressable style={{
              position: 'absolute', top: -10, left: -10, shadowColor: theme.colors.dark,
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2, elevation: 5, backgroundColor: theme.colors.light,
              borderRadius: 50, paddingHorizontal: 5, paddingVertical: 5, zIndex: 999
            }}
              onPress={RemoveEmoji} ><Text style={{ fontSize: fontSizes.small, color: theme.colors.backdrop }}>Clear</Text>
            </Pressable>
            <Text style={styles.emojis}>
              {text}
            </Text>
          </View> :
          <Text style={{ fontSize: fontSizes.BigHightlight, fontStyle: 'italic', height: 94, color: theme.colors.backdrop }}>
            Add emojis!
          </Text>
        }
      </View>
      <ScrollView style={{ marginBottom: 30 }} showsVerticalScrollIndicator={false} >
        <EmojiKeyboard onEmojiSelected={handleEmojiSelected} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  emojis: {
    fontSize: fontSizes.Logo,
    marginBottom: 20,
  },
});

export default PostMood;