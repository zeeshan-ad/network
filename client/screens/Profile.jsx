import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={{ paddingTop: 50, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="ios-chevron-back-outline" size={30} color={theme.colors.tertiary} />
        </Pressable>
        <Text style={{ fontSize: fontSizes.large, color: theme.colors.dark, fontWeight: fontWeights.normal }}>Profile</Text>
        <Pressable onPress={callLogout}><Ionicons name="power" size={24} color="black" /></Pressable>
      </View>
      <Text style={{ fontSize: 200, color: '#000' }}>Profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light
  }
})

export default Profile