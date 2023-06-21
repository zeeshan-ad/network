import React from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';


const Profile = ({ navigation }) => {
  const dispatch = useDispatch();

  const callLogout = async () => {
    const response = await logoutUser();

    if (response?.status === 200) {
      dispatch(resetUserInfo());
    }
    else {
      alert('Something went wrong. Please try again later.');
    }
  }


  return (
    <View style={styles.container}>
      <View style={{
        paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center', zIndex: 999,
      }}>
        <View style={{
          borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
          backgroundColor: theme.colors.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100
        }} >
          <Text style={{ fontSize: fontSizes.large, }}>🌻🤗🌞</Text>
        </View>
        <Pressable onPress={callLogout} style={{ borderWidth: 1, borderColor: theme.colors.dark, backgroundColor: theme.colors.light, padding: 3, borderRadius: 100 }}>
          <Feather name="settings" size={20} color={theme.colors.tertiary} />
        </Pressable>
      </View>
      <View style={{ width: '100%', height: 450, marginTop: -100 }}>
        <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')} resizeMethod='resize'
          style={{ height: '100%' }} />
      </View>
      <ScrollView
        style={{ position: 'absolute', top: 0, width: '100%', flex: 1 }}>
        <View style={{ width: '100%', minHeight: 390 }}>
        </View>
        <View style={{
          width: '100%', backgroundColor: theme.colors.light, paddingVertical: 20, paddingHorizontal: 20,
          borderTopRightRadius: 30, borderTopLeftRadius: 30, shadowColor: theme.colors.dark,
          shadowOffset: { width: 0, height: -10, }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, flex: 1
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.divider }}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold }}>Zeeshan Ahmed</Text>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30 }}>A minor glitch in a simulation</Text>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30, paddingVertical: 10 }}>
                <Text style={{ fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>296</Text>
                &nbsp;Members in circle
              </Text>
            </View>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold,  textDecorationLine: 'underline' }}>Txt</Text>
          </View>
          <View style={{ paddingVertical: 10, height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
              textAlign: 'center'
            }}>
              You haven't posted anything yet,{'\n'}Post your first yeet now.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    height: '100%'
  }
})

export default Profile