import React, { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator, TextInput, ScrollView, Keyboard } from 'react-native';
import { theme, fontSizes } from '../util/constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { postMemos } from '../APIs';
import CloseOrSave from './CloseOrSave';



const PostMemos = ({ navigation, route }) => {
  const [LoadSubmission, setLoadSubmission] = useState(false);
  const { editProfile } = route.params;


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [Memo, setMemo] = useState('');


  const callPostMemos = async () => {
    setLoadSubmission(true);
    const response = await postMemos(Memo);
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
      flex: 1, paddingTop: 60, justifyContent: 'flex-start',
      backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light
    }}>
      <CloseOrSave navigation={navigation} Save={callPostMemos} LoadSubmission={LoadSubmission} />
      <View style={{ minHeight: 20 }}></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.memoContainer}>
        <TextInput multiline={true} selectionColor={theme.colors.darkgrey}
          style={[styles.input, {
            fontSize: Memo.length < 200 ? fontSizes.xlarge : fontSizes.yeetPosts,
            fontWeight: Memo.length < 200 ? "500" : "400",
          }]}
          value={Memo}
          onChangeText={setMemo}
          placeholder="Share your thoughts..."></TextInput>
      </ScrollView>
      {isKeyboardVisible && <Pressable onPress={() => Keyboard.dismiss()} style={styles.keyboardBtn}>
        <MaterialCommunityIcons name="keyboard-off-outline" size={30} color={theme.colors.light} />
      </Pressable>}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    color: theme.colors.dark,
  },
  memoContainer: { paddingHorizontal: 20, marginTop: 50, paddingBottom: 200, justifyContent: 'center' },
  keyboardBtn: {
    position: 'absolute', bottom: 10, right: 20, marginTop: 10, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10,
  }
});

export default PostMemos;