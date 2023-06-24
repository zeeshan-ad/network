import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView, Modal, Dimensions } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';
import { BottomSheet } from "react-native-btr";
import { getProfileData } from '../APIs';
import { setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const Profile = ({ navigation }) => {
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.userInfo);
  const editProfile = useSelector(state => state.editProfile);
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

  const [ProfileInfo, setProfileInfo] = useState();

  const callGetProfileData = async () => {
    const response = await getProfileData();
    if (response?.status === 200) {
      setProfileInfo(response?.data?.data);
      dispatch(setProfileData({
        bio: response?.data?.data?.bio,
        is_public: response?.data?.data?.is_public,
        image: BASE_URL + response?.data?.data?.profile_pic,
        theme: response?.data?.data?.theme,
      }));
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  useEffect(() => {
    callGetProfileData();
  }, [isFocused])



  const [SheetVisible, setSheetVisible] = useState(false);
  const [ModalLogout, setModalLogout] = useState(false);
  return (
    <View style={[styles.container, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
      <View style={{
        position: 'absolute', top: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
        opacity: 0.1, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1,
        shadowRadius: 5, zIndex: 9
      }}></View>
      <View style={{
        paddingTop: 50, paddingHorizontal: 10, paddingBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center', zIndex: 999,
      }}>
        <View style={{ flexDirection: 'row', marginLeft: -10 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
          </Pressable>
          <View style={{
            borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
            backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100
          }} >
            <Text style={{ fontSize: fontSizes.large, }}>🌻🤗🌞</Text>
          </View>
        </View>
        <Pressable onPress={() => setSheetVisible(!SheetVisible)}>
          <Feather name="settings" size={20} color={theme.colors.light} />
        </Pressable>
      </View>
      <View style={{ width: '100%', height: 450, marginTop: -100 }}>
        {editProfile?.image ? (<ImageBackground source={{ uri: editProfile?.image }}
          style={{ height: width + 50, width: width }} />) :
          (<ImageBackground source={require('../assets/images/placeholder_profile.png')}
            style={{ height: width + 50, width: width }} />)}
      </View>
      <ScrollView
        style={{ position: 'absolute', top: 0, width: '100%', flex: 1 }}>
        <View style={{ width: '100%', minHeight: width }}>
        </View>
        <View style={{
          width: '100%', backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light, paddingVertical: 20, paddingHorizontal: 20,
          borderTopRightRadius: 30, borderTopLeftRadius: 30, shadowColor: theme.colors.dark,
          shadowOffset: { width: 0, height: -10, }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, flex: 1
        }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
            paddingBottom: 20, gap: 10
          }}>
            <View style={{ height: '100%', width: width - 165 }}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, paddingBottom: 2.5 }}>
                {userInfo?.name}
              </Text>
              {ProfileInfo?.bio &&
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 5 }}>{ProfileInfo?.bio}</Text>}
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 5 }}>
                <Text style={{ fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>296</Text>
                &nbsp;Friends in your bubble
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', height: '100%' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginBottom: 7.5 }}>
                <MaterialIcons name="cake" size={20} color={theme.colors.darkgrey} />
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light }}>
                  {(new Date(userInfo?.dob).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  }))}
                </Text>
              </View>
              {/* <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, textDecorationLine: 'underline' }}>dm</Text> */}
            </View>
          </View>
          <View style={{ paddingVertical: 10, height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
              textAlign: 'center'
            }}>
              You haven't posted anything yet,{'\n'}post a new memory to get started!
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
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Edit Vibe</Text>
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
            <Ionicons name="log-out-outline" size={25} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>Log Out</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
  },
  card: {
    backgroundColor: theme.colors.light,
    height: 160,
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