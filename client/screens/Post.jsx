import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import { StyleSheet } from 'react-native';
import PostMoments from '../components/PostMoments';
import PostMemos from '../components/PostMemos';
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';



const Post = ({ navigation, route }) => {
  const [InfoSnack, setInfoSnack] = useState(false);


  const [PostType, setPostType] = useState('Moments');

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container} >
      <View style={styles.container}>
        <View style={styles.postOptions}>
          {PostType === "Moments" && <Pressable onPress={() => setInfoSnack(true)} style={{ position: 'absolute', top: -5, left: -20, zIndex: 999 }}>
            <MaterialIcons name="info" size={15} color={theme.colors.light} />
          </Pressable>}
          <Pressable onPress={() => setPostType('Moments')} style={[styles.postOptionsContainer, {
            backgroundColor: PostType === 'Moments' ? theme.colors.secondary : theme.colors.light,
          }]}><Text style={styles.PostOptionsText}>Moments</Text>
          </Pressable>
          <Pressable onPress={() => setPostType('Memos')} style={[styles.postOptionsContainer, {
            backgroundColor: PostType === 'Memos' ? theme.colors.secondary : theme.colors.light,
          }]}><Text style={styles.PostOptionsText}>Memos</Text>
          </Pressable>
        </View>
        {PostType === 'Moments' ?
          <PostMoments navigation={navigation} route={route} /> :
          <PostMemos navigation={navigation} route={route} />
        }
      </View>
      <Snackbar
        visible={InfoSnack}
        onDismiss={() => setInfoSnack(false)}
        duration={8000}
      >
        Share moments through out the day, all the moments from a day will be clubbed together and shown as a single post in a carousel. 🌆🌆🌆
      </Snackbar>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postOptionsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
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