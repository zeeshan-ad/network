import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView, Modal, Dimensions } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';
import { BottomSheet } from "react-native-btr";
import { getProfileData, getMood, getUserProfile, sendRequest, getRequestStatus, cancelRequest, acceptRequest } from '../APIs';
import { resetProfileData, setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';


const width = Dimensions.get('window').width;
const Profile = ({ navigation, route }) => {
  const { userId } = route.params;
  const [FetchedMood, setFetchedMood] = useState('');
  const isFocused = useIsFocused();

  const userInfo = userId ? null : useSelector(state => state.userInfo);
  const editProfile = userId ? null : useSelector(state => state.editProfile);
  const dispatch = useDispatch();

  const callLogout = async () => {
    const response = await logoutUser();

    if (response?.status === 200) {
      dispatch(resetUserInfo());
      dispatch(resetProfileData());
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
        image: response?.data?.data?.profile_pic ? BASE_URL + response?.data?.data?.profile_pic : null,
        theme: response?.data?.data?.theme,
      }));
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const callGetMood = async () => {
    const response = await getMood();
    if (response?.status === 200) {
      setFetchedMood(response?.data?.data);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const CallGetUserProfile = async () => {
    const response = await getUserProfile(userId);
    if (response?.status === 200) {
      setProfileInfo({
        ...response?.data?.data,
        theme: response?.data?.data?.theme ? response?.data?.data?.theme : theme.colors.light,
      });
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const [RequestStatus, setRequestStatus] = useState(null);

  const callGetRequestStatus = async () => {
    const response = await getRequestStatus(userId);
    if (response?.status === 200) {
      setRequestStatus(response?.data?.data);
    } else
      setRequestStatus(null);
  }


  const callCancelRequest = async () => {
    const response = await cancelRequest(userId);
    if (response?.data?.status === 200) {
      callGetRequestStatus();
    }
  }


  useEffect(() => {
    if (!userId) {
      callGetMood();
      callGetProfileData();
    } else {
      callGetRequestStatus();
      CallGetUserProfile();
    }
  }, [isFocused, userId])

  const callSendRequest = async () => {
    const response = await sendRequest(userId);
    if (response?.data?.status === 200) {
      callGetRequestStatus();
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const callAcceptRequest = async () => {
    const response = await acceptRequest(userId);
    if (response?.data?.status === 200) {
      callGetRequestStatus();
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const [SheetVisible, setSheetVisible] = useState(false);
  const [ModalLogout, setModalLogout] = useState(false);
  const [ModalRequest, setModalRequest] = useState(false);
  const [RemoveFriend, setRemoveFriend] = useState(false);
  return (
    <View style={[styles.container, { backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
      <View style={{
        position: 'absolute', top: 0, width: width, minHeight: 100, backgroundColor: theme.colors.dark,
        opacity: 0.1, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1,
        shadowRadius: 5, zIndex: 9
      }}></View>
      <View style={{
        paddingTop: 50, paddingHorizontal: 10, paddingBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center', zIndex: 999,
      }}>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={() => navigation.goBack()} style={{
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10, backgroundColor: 'transparent'
          }}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
          </Pressable>
          {ProfileInfo?.mood || FetchedMood?.mood ? <View style={{
            borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
            backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100
          }} >
            <Pressable onPress={() => !userId && navigation.navigate('PostMood', { editProfile, FetchedMood })}>
              {!userId ? (
                FetchedMood?.mood ?
                  <Text numberOfLines={1} ellipsizeMode='clip' style={{
                    width: 70, textAlign: 'center', fontSize: fontSizes.medium, paddingVertical: 2, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                    shadowRadius: 1, elevation: 10,
                  }}>{FetchedMood?.mood}</Text> :
                  <Feather name="plus" size={20} color={theme.colors.dark} />)
                : (ProfileInfo?.mood &&
                  <Text numberOfLines={1} ellipsizeMode='clip' style={{
                    width: 70, textAlign: 'center', fontSize: fontSizes.medium, paddingVertical: 2,
                    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
                    shadowRadius: 1, elevation: 10
                  }}>{ProfileInfo?.mood}</Text>)
              }
            </Pressable>
          </View> : null}
        </View>
        {!userId &&
          <Pressable onPress={() => setSheetVisible(!SheetVisible)} style={{
            marginRight: 10, shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10, backgroundColor: 'transparent'
          }}>
            <Feather name="settings" size={20} color={theme.colors.light} />
          </Pressable>
        }
      </View>
      <View style={{ width: '100%', height: 450, marginTop: -100 }}>
        {!userId ? editProfile?.image ? (<Image source={editProfile?.image}
          style={{ height: width + 50, width: width }} />) :
          (<Image source={require('../assets/images/placeholder_profile.png')}
            style={{ height: width + 50, width: width }} />)
          : ProfileInfo?.profile_pic ? (<Image source={BASE_URL + ProfileInfo?.profile_pic}
            style={{ height: width + 50, width: width }} />) :
            (<Image source={require('../assets/images/placeholder_profile.png')}
              style={{ height: width + 50, width: width }} />)}
      </View>
      <ScrollView
        style={{ position: 'absolute', top: 0, width: '100%', flex: 1 }}>
        <View style={{ width: '100%', minHeight: width }}>
        </View>
        <View style={{
          width: '100%', backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.light, paddingVertical: 20, paddingHorizontal: 20,
          borderTopRightRadius: 30, borderTopLeftRadius: 30, shadowColor: theme.colors.dark,
          shadowOffset: { width: 0, height: -10, }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, flex: 1
        }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
            paddingBottom: 20, gap: 10
          }}>
            <View style={{ height: '100%', width: width - 165 }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, color: theme.colors.backdrop, paddingBottom: 5, fontStyle: 'italic' }}>
                @{userId ? ProfileInfo?.username : userInfo?.username}
              </Text>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, paddingBottom: 2.5 }}>
                {userId ? ProfileInfo?.name : userInfo?.name}
              </Text>
              {ProfileInfo?.bio &&
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 5 }}>{ProfileInfo?.bio}</Text>}
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 5 }}>
                <Text style={{ fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{ProfileInfo?.totalFriends}</Text>
                &nbsp;{ProfileInfo?.totalFriends > 1 ? 'Friends' : 'Friend'} in {userId ? 'their' : 'your'} bubble
              </Text>
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginBottom: 7.5 }}>
                <MaterialIcons name="cake" size={20} color={theme.colors.darkgrey} />
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light }}>
                  {(new Date(userId ? ProfileInfo?.dob : userInfo?.dob).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  }))}
                </Text>
              </View>
              {userId && (
                RequestStatus?.status === 'pending' && userId === RequestStatus?.req_to_id ?
                  <Pressable onPress={callCancelRequest}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                      <Ionicons name="time-sharp" size={18} color={theme.colors.darkgrey} />
                      <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline' }}>
                        Pending
                      </Text>
                    </View>
                  </Pressable>
                  :
                  RequestStatus?.status === 'pending' && userId === RequestStatus?.req_by_id ?
                    <Pressable onPress={() => setModalRequest(true)}>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                        <Ionicons name="time-sharp" size={18} color={theme.colors.darkgrey} />
                        <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline' }}>
                          Accept
                        </Text>
                      </View>
                    </Pressable>
                    : RequestStatus?.status === 'accepted' ?
                      <Pressable onPress={() => {
                        setModalRequest(true);
                        setRemoveFriend(true);
                      }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                          <MaterialCommunityIcons name="account-multiple-check" size={25} color={theme.colors.darkgrey}
                            style={{ marginBottom: -3, marginRight: 3 }} />
                          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline' }}>
                            Friends
                          </Text>
                        </View>
                      </Pressable> :
                      <Pressable onPress={callSendRequest}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                          <Ionicons name="md-person-add" size={18} color={theme.colors.darkgrey} />
                          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline' }}>
                            Join bubble
                          </Text>
                        </View>
                      </Pressable>)
              }
            </View>
          </View>
          <View style={{ paddingVertical: 10, height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
              textAlign: 'center'
            }}>
              {!userId ? "You haven't posted anything yet,\npost a moment or memo to get started!"
                : RequestStatus?.status === "accepted" ?
                  ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' ')) + " hasn't posted anything yet." :
                  "Join " + ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' ')) + "'s bubble to see their posts."}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalLogout}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, paddingVertical: 20, paddingHorizontal: 20 }}>
              Are you sure you want to log out?
            </Text>
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
      {userId && <Modal
        animationType="fade"
        transparent={true}
        visible={ModalRequest}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>
            <Text style={{ fontSize: fontSizes.large, textAlign: 'center', fontWeight: fontWeights.normal, paddingVertical: 20, paddingHorizontal: 20 }}>
              {!RemoveFriend ? ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' ')) + ' has requested to\njoin your bubble.' : 'Are you sure you want to remove ' + ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' ')) + ' from your bubble?'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 50 }}>
              <Pressable
                onPress={() => {
                  setModalRequest(false);
                  callCancelRequest();
                  CallGetUserProfile();
                }}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>{!RemoveFriend ? 'Decline' : 'Remove'}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalRequest(false);
                  CallGetUserProfile();
                  if (!RemoveFriend)
                    callAcceptRequest();
                }}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>{!RemoveFriend ? 'Accept' : 'Cancel'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>}
      <BottomSheet
        visible={SheetVisible}
        onBackdropPress={() => setSheetVisible(!SheetVisible)}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.light }]}>
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
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  }
})


export default Profile