import React, { useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView, Modal } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';
import { BottomSheet } from "react-native-btr";


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

  const [SheetVisible, setSheetVisible] = useState(false);
  const [ModalLogout, setModalLogout] = useState(false);
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
        <Pressable onPress={() => setSheetVisible(!SheetVisible)} style={{ borderWidth: 1, borderColor: theme.colors.dark, backgroundColor: theme.colors.light, padding: 3, borderRadius: 100 }}>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.divider }}>
            <View style={{}}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold }}>Zeeshan Ahmed</Text>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30 }}>A minor glitch in a simulation</Text>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30, paddingVertical: 10 }}>
                <Text style={{ fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>296</Text>
                &nbsp;Friends in your bubble
              </Text>
            </View>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, textDecorationLine: 'underline' }}>Txt</Text>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalLogout}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, paddingVertical: 20, paddingHorizontal: 20 }}>Are you sure you want to log out?</Text>
            <Pressable
              style={{
                borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                backgroundColor: theme.colors.danger
              }}
              onPress={() => {
                setModalLogout(!ModalLogout);
                setTimeout(() => {
                  callLogout();
                }, 400)
              }}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Log Out</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalLogout(!ModalLogout)}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <BottomSheet
        visible={SheetVisible}
        onBackdropPress={() => setSheetVisible(!SheetVisible)}
      >
        <View style={styles.card}>
          <Pressable onPress={() => {
            setSheetVisible(!SheetVisible)
            navigation.navigate('EditProfile');
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Feather name="edit" size={22} color={theme.colors.dark} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Edit Profile</Text>
          </Pressable>
          <Pressable style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Ionicons name="color-filter-outline" size={25} color={theme.colors.dark} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Theme</Text>
          </Pressable>
          <Pressable onPress={() => {
            setSheetVisible(!SheetVisible);
            setTimeout(() => {
              setModalLogout(!ModalLogout);
            }, 400)
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Ionicons name="log-out-outline" size={25} color={theme.colors.dark} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Log Out</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    height: '100%'
  },
  card: {
    backgroundColor: theme.colors.light,
    height: 230,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
  },
  centeredView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: theme.colors.backdrop
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.colors.light,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  }
})


export default Profile