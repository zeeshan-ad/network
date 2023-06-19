import React, { useCallback } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Text, ImageBackground } from 'react-native';
import DismissKeyboard from '../components/DismissKeyboard';
import { fontSizes, fontWeights, theme } from '../util/constants';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';



const Feed = ({ navigation }) => {

  return (
    <KeyboardAvoidingView behavior="height">
      <DismissKeyboard>
        <View style={styles.container}>
          <Header navigation={navigation} />
          <View>
            <Text style={{ fontSize: fontSizes.large, color: theme.colors.dark, paddingLeft: 20, fontWeight: fontWeights.normal }}>Moods</Text>
            <View style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
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

              <View style={{ position: 'relative', alignItems: 'center' }}>
                <ImageBackground source={require('../assets/images/tzara.jpg')}
                  style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />
                <View style={{
                  position: 'absolute', borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
                  backgroundColor: theme.colors.secondary, left: 0, top: -15, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100
                }} >
                  <Text style={{ fontSize: fontSizes.large, }}>🌻🤗🌞</Text>
                </View>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingTop: 5 }}>Tzara</Text>
              </View>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
  }
})

export default Feed