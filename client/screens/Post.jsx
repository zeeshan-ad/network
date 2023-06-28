import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Pressable, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import PostMoments from '../components/PostMoments';

const width = Dimensions.get('window').width;

const Post = ({ navigation, route }) => {
  const [LoadSubmission, setLoadSubmission] = useState(false);
  const { editProfile } = route.params;

  const [PostType, setPostType] = useState('Moments');

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

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} >
      <View style={styles.container}>
        <View style={styles.postOptions}>
          <Pressable onPress={() => setPostType('Moments')} style={{
            backgroundColor: PostType === 'Moments' ? theme.colors.secondary : theme.colors.light,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 100,
          }}><Text style={styles.PostOptionsText}>Moments</Text>
          </Pressable>
          <Pressable onPress={() => setPostType('Memos')} style={{
            backgroundColor: PostType === 'Memos' ? theme.colors.secondary : theme.colors.light,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 100
          }}><Text style={styles.PostOptionsText}>Memos</Text>
          </Pressable>
        </View>
        {PostType === 'Moments' ?
          <PostMoments navigation={navigation} route={route} /> :
          <View style={{
            flex: 1, paddingHorizontal: 20, paddingTop: 60, justifyContent: 'flex-start',
            backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light
          }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Pressable onPress={() => navigation.goBack()} style={{
                shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                shadowRadius: 1, elevation: 10,
              }}>
                <Ionicons name="close" size={30} color={theme.colors.light} />
              </Pressable>
              {LoadSubmission ?
                (<Pressable style={{
                  marginRight: -10, marginTop: 10, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                  shadowRadius: 1, elevation: 10,
                }}>
                  <ActivityIndicator size="small" color={theme.colors.light} />
                </Pressable>) :
                (<Pressable onPress={{}} style={{
                  shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                  shadowRadius: 1, elevation: 10
                }}>
                  <Ionicons name="checkmark-sharp" size={30} color={theme.colors.light} />
                </Pressable>)
              }

            </View>
            <View style={{ minHeight: 20 }}></View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: 50, paddingBottom: 200, justifyContent: 'center' }}>
              <TextInput multiline={true} selectionColor={theme.colors.dark}
                style={[styles.input, {
                  fontSize: Memo.length < 200 ? fontSizes.xlarge : fontSizes.yeetPosts,
                  fontWeight:  Memo.length < 200 ? "500" : "400",
                }]}
                value={Memo}
                onChangeText={setMemo}
                placeholder="Share your thoughts..."></TextInput>
            </ScrollView>
            {isKeyboardVisible && <Pressable onPress={() => Keyboard.dismiss()} style={{
              position: 'absolute', bottom: 10, right: 20, marginTop: 10, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
              <MaterialCommunityIcons name="keyboard-off-outline" size={30} color={theme.colors.light} />
            </Pressable>}
          </View>}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postOptions: {
    position: 'absolute',
    zIndex: 9999,
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    top: 62,
    alignSelf: 'center',
    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10,
  },
  PostOptionsText: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.normal,
    color: theme.colors.dark,
  },
  input: {
    color: theme.colors.dark,
  }
});

export default Post;