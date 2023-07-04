import React, { useState } from 'react';
import { View, Text, Dimensions, Pressable, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import EmojiKeyboard from '../components/EmojiKeyboard';
import { StyleSheet } from 'react-native';
import { updateMood } from '../APIs';
import CloseOrSave from '../components/CloseOrSave';

const width = Dimensions.get('window').width;

const PostMood = ({ navigation, route }) => {
  const [LoadSubmission, setLoadSubmission] = useState(false);
  const { editProfile, FetchedMood } = route.params;
  const [text, setText] = useState(FetchedMood?.mood ? FetchedMood?.mood : "");

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
    <SafeAreaView style={[styles.container, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
      <CloseOrSave navigation={navigation} Save={callupdateMood} LoadSubmission={LoadSubmission} />
      <View style={styles.marginVertical}>
        <Text style={styles.text}>
          Use emojis to express your mood
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {text ?
          <View style={styles.emojiTypeContainer}>
            <Pressable style={styles.clearBtn}
              onPress={RemoveEmoji} >
              <Text>Clear</Text>
            </Pressable>
            <Text style={styles.emojis}>
              {text}
            </Text>
          </View> :
          <Text style={styles.emojisPlaceholder}>
            Add emojis!
          </Text>
        }
      </View>
      <EmojiKeyboard onEmojiSelected={handleEmojiSelected} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  emojis: {
    fontSize: fontSizes.Logo,
    marginBottom: 20,
    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10,
  },
  container: {
    flex: 1, paddingHorizontal: 20, paddingTop: 50, justifyContent: 'flex-start'
  },
  marginVertical: { marginVertical: 20 },
  text: {
    textAlign: 'center', fontSize: fontSizes.large, fontWeight: fontWeights.normal,
    paddingTop: 5, color: theme.colors.dark
  },
  emojiTypeContainer: { flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center' },
  clearBtn: {
    position: 'absolute', top: -10, left: -10, shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2, elevation: 5, backgroundColor: theme.colors.light,
    borderRadius: 50, paddingHorizontal: 5, paddingVertical: 5, zIndex: 999
  },
  emojisPlaceholder: { fontSize: fontSizes.BigHightlight, fontStyle: 'italic', height: 94, color: theme.colors.backdrop }
});

export default PostMood;