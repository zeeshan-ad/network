import React, { useCallback } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Text, ImageBackground, ScrollView } from 'react-native';
import DismissKeyboard from '../components/DismissKeyboard';
import { fontSizes, fontWeights, theme } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import PostSnippet from '../components/PostSnippet';
import Mood from '../components/Mood';
import PostTextSnippet from '../components/PostTextSnippet';


const Feed = ({ navigation }) => {
  const height = Dimensions.get("window").height;

  return (
    <KeyboardAvoidingView behavior="height">
      <Header navigation={navigation} />
      <DismissKeyboard>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: fontSizes.large, color: theme.colors.dark, paddingLeft: 20, fontWeight: fontWeights.normal }}>Moods</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 30, paddingHorizontal: 20, paddingVertical: 20, zIndex: -999 }}>
              <View style={{ position: 'relative', alignItems: 'center' }}>
                <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
                  style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
                <View style={{
                  position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, justifyContent: 'center', alignItems: 'center',
                  backgroundColor: theme.colors.secondary, left: 0, top: -15, padding: 3, borderRadius: 100
                }} >
                  <Feather name="plus" size={20} color="black" />
                </View>

                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>You</Text>
              </View>
              {[...Array(5)].map((e, i) => <Mood key={i} />)}
            </View>
          </ScrollView>
          <View style={{ marginBottom: 100 }}>
            <PostSnippet navigation={navigation} />
            <PostTextSnippet navigation={navigation}/>
            <PostSnippet navigation={navigation}/>
          </View>
        </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: 500,
  }
})

export default Feed