import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView, Modal, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL, convertTimestamp2, convertTimestampMoment } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, Ionicons, FontAwesome, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';
import { BottomSheet } from "react-native-btr";
import { getProfileData, getMood, getUserProfile, sendRequest, getRequestStatus, cancelRequest, acceptRequest, getProfilePosts, getFriendsList, reportUser, deleteUser } from '../APIs';
import { resetProfileData, setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';


const { width, height } = Dimensions.get('window');
const Profile = ({ navigation, route }) => {
  const { userId } = route.params;
  const [FetchedMood, setFetchedMood] = useState('');
  const isFocused = useIsFocused();

  let userInfo = useSelector(state => state.userInfo);
  let editProfile = useSelector(state => state.editProfile);

  useEffect(() => {
    if (userId) {
      userInfo = null;
      editProfile = null;
    }
  }, [userInfo, editProfile])


  const dispatch = useDispatch();

  const [FriendsList, setFriendsList] = useState()
  const callGetFriendsList = async (userId) => {
    setFriendsList(null);
    const response = await getFriendsList(userId);
    setFriendsList(response?.data?.data);
  }

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

  const [ReportMessage, setReportMessage] = useState(false);
  const callReportUser = async () => {
    const response = await reportUser(userId, ReportReason);
    if (response?.data?.status === 200) {
      setModalReport(false);
      setReportReason('');
      callCancelRequest();
      setReportMessage(true)
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }


  const [ShowFriendList, setShowFriendList] = useState(false)
  const [ProfileInfo, setProfileInfo] = useState();

  const callGetProfileData = async () => {
    setProfileInfo(null);
    setProfileData(null);
    const response = await getProfileData();
    if (response?.status === 200) {
      setProfileInfo(response?.data?.data);
      dispatch(setProfileData({
        bio: response?.data?.data?.bio,
        is_public: response?.data?.data?.is_public,
        image: response?.data?.data?.profile_pic ? BASE_URL + response?.data?.data?.profile_pic : null,
        theme: response?.data?.data?.theme,
      }));
    }
  }

  const callGetMood = async () => {
    setFetchedMood(null);
    const response = await getMood();
    if (response?.status === 200) {
      setFetchedMood(response?.data?.data);
    }
  }

  const CallGetUserProfile = async () => {
    setProfileInfo(null);
    const response = await getUserProfile(userId);
    if (response?.status === 200) {
      setProfileInfo({
        ...response?.data?.data,
        theme: response?.data?.data?.theme ? response?.data?.data?.theme : theme.colors.light,
      });
    }
  }

  const [RequestStatus, setRequestStatus] = useState(null);

  const callGetRequestStatus = async () => {
    setRequestStatus(null);
    const response = await getRequestStatus(userId);
    if (response?.status === 200) {
      setRequestStatus(response?.data?.data);
    } else
      setRequestStatus(null);
  }


  const callDeleteUser = async () => {
    const response = await deleteUser();
    if (response?.data?.status === 200) {
      dispatch(resetUserInfo());
      dispatch(resetProfileData());
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }
  

  const callCancelRequest = async () => {
    const response = await cancelRequest(userId);
    if (response?.data?.status === 200) {
      callGetRequestStatus();
    }
  }

  const [AllMemos, setAllMemos] = useState();
  const [AllMoments, setAllMoments] = useState();
  callGetPosts = async (userId) => {
    setAllMemos(null);
    setAllMoments(null);
    const response = await getProfilePosts(userId);
    if (response?.status === 200) {
      setAllMemos(response?.data?.data?.memos);
      setAllMoments(response?.data?.data?.moments);
    }
  }



  useEffect(() => {
    if (!userId) {
      callGetMood();
      callGetProfileData();
      callGetPosts(userInfo?.id);
      callGetFriendsList(userInfo?.id)
    } else {
      callGetRequestStatus();
      CallGetUserProfile();
      callGetPosts(userId);
      callGetFriendsList(userId)
    }
  }, [isFocused, userId, userInfo?.id])

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



  const [ModalDelete, setModalDelete] = useState(false)
  const [ReportReason, setReportReason] = useState('');
  const [OtherOptions, setOtherOptions] = useState(false);
  const [ModalReport, setModalReport] = useState(false);
  const [CurrentTab, setCurrentTab] = useState(0);
  const [SheetVisible, setSheetVisible] = useState(false);
  const [ModalLogout, setModalLogout] = useState(false);
  const [ModalRequest, setModalRequest] = useState(false);
  const [RemoveFriend, setRemoveFriend] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
      <View style={{
        paddingTop: 10, paddingHorizontal: 10, paddingBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center', zIndex: 999,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
          </Pressable>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, color: theme.colors.backdrop, fontStyle: 'italic' }}>
            @{userId ? ProfileInfo?.username : userInfo?.username}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginRight: 10 }}>
          {(ProfileInfo?.mood && userId) || (!userId) ? <View style={{
            borderWidth: 1, borderColor: theme.colors.dark, width: 95, justifyContent: 'center', alignItems: 'center',
            backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100,
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10
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
          {!userId ?
            <Pressable onPress={() => setSheetVisible(!SheetVisible)}>
              <Feather name="settings" size={20} color={theme.colors.dark} />
            </Pressable>
            : <Pressable onPress={() => setOtherOptions(!OtherOptions)}>
              <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.dark} />
            </Pressable>
          }
        </View>
      </View>
      <View style={{ backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.light }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingVertical: 15, gap: 10, paddingHorizontal: 20
        }}>
          <View style={{ height: '100%', width: width - 165 }}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, paddingBottom: 2.5 }}>
              {userId ? ProfileInfo?.name : userInfo?.name}
            </Text>
            {ProfileInfo?.bio &&
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 5 }}>{ProfileInfo?.bio}</Text>}
            <Pressable onPress={RequestStatus?.status === 'accepted' || !userId ? () => setShowFriendList(true) : null} style={{ flexDirection: 'row', alignItems: "ceneter", paddingVertical: 5 }} >
              <Text style={{ fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{ProfileInfo?.totalFriends}</Text>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light }}>&nbsp;{ProfileInfo?.totalFriends > 1 ? 'Friends' : 'Friend'} in {userId ? 'their' : 'your'} bubble</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginVertical: 10 }}>
                <FontAwesome name="birthday-cake" size={13} color={theme.colors.backdrop} />
                <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.ligh, marginBottom: -4 }}>
                  {(new Date(userId ? ProfileInfo?.dob : userInfo?.dob).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                  }))}
                </Text>
              </View>
              {userId && (
                RequestStatus?.status === 'pending' && userId === RequestStatus?.req_to_id ?
                  <Pressable onPress={callCancelRequest}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                      <Ionicons name="time-sharp" size={16} color={theme.colors.backdrop} />
                      <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline', marginBottom: 1 }}>
                        pending
                      </Text>
                    </View>
                  </Pressable>
                  :
                  RequestStatus?.status === 'pending' && userId === RequestStatus?.req_by_id ?
                    <Pressable onPress={() => setModalRequest(true)}>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                        <Ionicons name="time-sharp" size={16} color={theme.colors.backdrop} />
                        <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline', marginBottom: 1 }}>
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
                          <MaterialCommunityIcons name="account-multiple-check" size={20} color={theme.colors.backdrop}
                            style={{ marginBottom: -3, marginRight: 3 }} />
                          <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline', marginBottom: -1 }}>
                            Friends
                          </Text>
                        </View>
                      </Pressable> :
                      <Pressable onPress={callSendRequest}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                          <Ionicons name="md-person-add" size={16} color={theme.colors.backdrop} />
                          <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline', marginBottom: -.5 }}>
                            Join bubble
                          </Text>
                        </View>
                      </Pressable>)
              }
            </View>
          </View>

          <View>
            {!userId ? editProfile?.image ? (<Image source={editProfile?.image}
              style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />) :
              (<Image source={require('../assets/images/placeholder_profile.png')}
                style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />)
              : ProfileInfo?.profile_pic ? (<Image source={BASE_URL + ProfileInfo?.profile_pic}
                style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />) :
                (<Image source={require('../assets/images/placeholder_profile.png')}
                  style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />)}
          </View>

        </View>
        <View style={{
          flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: 0.17,
          borderBottomColor: theme.colors.backdrop
        }}>
          <Pressable onPress={() => setCurrentTab(0)} style={{
            borderBottomColor: theme.colors.dark, width: '50%',
            borderBottomWidth: CurrentTab === 0 ? 2 : 0, alignItems: 'center'
          }}><Text style={styles.tabTitle}>Moments</Text>
          </Pressable>
          <Pressable onPress={() => setCurrentTab(1)} style={{
            borderBottomColor: theme.colors.dark, width: '50%',
            borderBottomWidth: CurrentTab === 1 ? 2 : 0, alignItems: 'center'
          }}><Text style={styles.tabTitle}>Memos</Text>
          </Pressable>
        </View>
      </View>

      {
        // if  userId is null then show the current user's profile
        !userId ?
          <View>
            {CurrentTab === 0 ?
              AllMoments?.length > 0 ?
                // flatlists to show images in grid
                <FlatList
                  key={'_'}
                  data={AllMoments}
                  style={{ height: height, paddingTop: 5, paddingHorizontal: 5 }}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={<View style={{ height: 300 }}></View>}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate("PostExpanded", { date: item?.created_at, user: { ...editProfile, ...userInfo } })} style={{
                      flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: width / 2 - 15, marginHorizontal: 5,
                      marginBottom: 5, position: "relative"
                    }}>
                      <View style={{ width: '100%', height: 200, marginTop: 5 }}>
                        <Image source={{ uri: BASE_URL + item?.moment }} style={{
                          width: '100%', height: '100%',
                          borderColor: theme.colors.backdrop, borderWidth: 2, borderRadius: 10
                        }} />
                        <Text style={{
                          position: "absolute", bottom: 5, left: 5, color: theme.colors.light, fontSize: fontSizes.large,
                          fontWeight: fontWeights.light, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
                          shadowOffset: { width: 0, height: 0 }, elevation: 1
                        }}>
                          {convertTimestampMoment(item.created_at)}</Text>
                      </View>
                      <View style={{
                        position: 'absolute', top: 10, right: 5, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
                        shadowOffset: { width: 0, height: 0 }, elevation: 1
                      }}>
                        <MaterialCommunityIcons name="view-carousel" size={20} color={theme.colors.light} />
                      </View>
                    </Pressable>
                  )}
                  numColumns={2}
                />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>When you share a moment it will show here.</Text>
              :
              AllMemos?.length > 0 ?
                <FlatList
                  key={'#'}
                  data={AllMemos}
                  style={{ height: height, paddingTop: 5 }}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={<View style={{ height: 300 }}></View>}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate('PostTextExpanded', { memo: item })} style={{
                      marginHorizontal: 10,
                      backgroundColor: 'rgba(255,255,255,0.4)',
                      flexDirection: 'column', borderColor: theme.colors.backdrop, borderWidth: 0.18,
                      marginVertical: 5, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15
                    }}>
                      <Text style={{
                        fontSize: fontSizes.large, fontWeight: fontWeights.normal, lineHeight: 30
                      }}>{item.memo}</Text>
                      {/* Time */}
                      <Text style={{
                        marginTop: 15, fontStyle: "italic", fontSize: fontSizes.smallMedium, fontWeight: fontWeights.light,
                        textAlign: 'left', color: theme.colors.backdrop
                      }}>
                        posted on {convertTimestamp2(item.created_at)}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={item => item.id}
                />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>When you share a memo it will show here.</Text>
            }
          </View>
          // else if userId is not null then show the other user's profile
          :
          // if the request is accepted then show the other user's profile
          RequestStatus?.status === "accepted" ?
            CurrentTab === 0 ?
              AllMoments?.length > 0 ?
                // flatlists to show images in grid
                <FlatList
                  key={'_'}
                  data={AllMoments}
                  style={{ height: height, paddingTop: 5, paddingHorizontal: 5 }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate("PostExpanded", { date: item?.created_at, user: { ...editProfile, ...ProfileInfo } })} style={{
                      flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: width / 2 - 15, marginHorizontal: 5,
                      marginBottom: 5, position: "relative"
                    }}>
                      <View style={{ width: '100%', height: 200, marginTop: 5 }}>
                        <Image source={{ uri: BASE_URL + item?.moment }} style={{
                          width: '100%', height: '100%',
                          borderColor: theme.colors.backdrop, borderWidth: 2, borderRadius: 10
                        }} />
                        <Text style={{
                          position: "absolute", bottom: 5, left: 5, color: theme.colors.light, fontSize: fontSizes.large,
                          fontWeight: fontWeights.light, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
                          shadowOffset: { width: 0, height: 0 }, elevation: 1
                        }}>
                          {convertTimestampMoment(item.created_at)}
                        </Text>
                        <View style={{
                          position: 'absolute', top: 5, right: 5, shadowColor: theme.colors.dark, shadowOpacity: 1, shadowRadius: 1,
                          shadowOffset: { width: 0, height: 0 }, elevation: 1
                        }}>
                          <MaterialCommunityIcons name="view-carousel" size={20} color={theme.colors.light} />
                        </View>
                      </View>
                    </Pressable>
                  )}
                  numColumns={2}
                />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>{ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' '))}'s moment will show here once they post.</Text> :
              AllMemos?.length > 0 ?
                <FlatList
                  key={'#'}
                  data={AllMemos}
                  style={{ height: height, paddingTop: 5 }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate('PostTextExpanded', { memo: item })} style={{
                      marginHorizontal: 10,
                      backgroundColor: 'rgba(255,255,255,0.4)',
                      flexDirection: 'column', borderColor: theme.colors.backdrop, borderWidth: 0.18,
                      marginVertical: 5, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15
                    }}>
                      <Text style={{
                        fontSize: fontSizes.large, fontWeight: fontWeights.normal, lineHeight: 30
                      }}>{item.memo}</Text>
                      {/* Time */}
                      <Text style={{
                        marginTop: 15, fontStyle: "italic", fontSize: fontSizes.smallMedium, fontWeight: fontWeights.light,
                        textAlign: 'left', color: theme.colors.backdrop
                      }}>
                        posted on {convertTimestamp2(item.created_at)}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={item => item.id}
                />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>{ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' '))}'s memos will show here once they post.</Text>
            :
            // else if not friends show hidden profile
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
              textAlign: 'center', marginTop: 50
            }}>
              Join {ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' '))}'s bubble to see their posts.</Text>
      }
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalDelete}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.danger }]}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, paddingVertical: 20, paddingHorizontal: 20 }}>
              Are you sure you delete your account?{'\n'}{'\n'}Once the account is deleted all your data will be lost and cannot be recovered.
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', gap:50, justifyContent: 'space-evenly', alignItems: 'center' }}>
              <Pressable
                onPress={() => {
                  setModalDelete(!ModalDelete);
                  setTimeout(() => {
                    callDeleteUser();
                  }, 400)
                }}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.light }}>Delete Account</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalDelete(!ModalDelete)}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {
        userId && <Modal
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
        </Modal>
      }
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
          <Pressable onPress={() => {
            setSheetVisible(!SheetVisible);
            setTimeout(() => {
              setModalDelete(!ModalDelete);
            }, 400)
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <AntDesign name="deleteuser" size={25} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>Delete Account</Text>
          </Pressable>
        </View>
      </BottomSheet>
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalReport}>
        <KeyboardAvoidingView behavior='padding' style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingVertical: 10, paddingHorizontal: 10, lineHeight: 20 }}>
              Please tell us why you are reporting {ProfileInfo?.name+' '?.substring(0, ProfileInfo?.name+' '?.indexOf(' '))}.
              {RequestStatus?.status === 'accepted' && '\nAs a precautionary measure we will also remove them from your bubble.'}
            </Text>
            <TextInput
              selectionColor={theme.colors.dark}
              style={[{ backgroundColor: theme.colors.light, color: theme.colors.dark, padding: 10, margin: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.dark, width: '100%', height: 150 }]}
              placeholder="Add reason"
              placeholderTextColor={theme.colors.backdrop}
              onChangeText={text => setReportReason(text)}
              value={ReportReason}
              multiline={true}
              numberOfLines={4}
            />
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: "flex-end", width: '100%' }}>
              <Pressable
                onPress={() => setModalReport(!ModalReport)}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={ReportReason.length > 0 ? callReportUser : null}
                style={{
                  borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                  backgroundColor: ReportReason.length > 0 ? theme.colors.warning : theme.colors.grey, height: 45
                }}
              >
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Report</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={ReportMessage}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>

            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.light, paddingVertical: 20, paddingHorizontal: 20 }}>
              Thank your for reporting this user. We appreciate your assistance in maintaining a safe community. Our team will review the report and take appropriate action if needed. If you have any additional information, please include it in the report description. Thank you for helping us keep Yeet a positive platform.
              {'\n'}{'\n'}
              Best regards,{'\n'}
              The Yeet Team
            </Text>
            <Pressable
              onPress={() => {
                setReportMessage(false);
              }}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20, textDecorationLine: 'underline' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <BottomSheet
        visible={OtherOptions}
        onBackdropPress={() => setOtherOptions(!OtherOptions)}
      >
        <View style={[styles.card2, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={() => {
            setOtherOptions(!OtherOptions);
            setTimeout(() => {
              setModalReport(!ModalReport);
            }, 400)
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Octicons name="report" size={20} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>Report {userId ? ProfileInfo?.name : userInfo?.name}</Text>
          </Pressable>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={ShowFriendList}
        onBackdropPress={() => setShowFriendList(!ShowFriendList)}
      >
        <View style={[styles.card2, { backgroundColor: theme.colors.light }]}>
          <Text style={{
            fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark,
            paddingTop: 20, textDecorationLine: 'underline'
          }}>Friends</Text>
          <FlatList
            data={FriendsList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => {
                  setShowFriendList(false);
                  navigation.navigate('Profile', { userId: item?.id !== userInfo?.id ? item?.id : null })
                }} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
                  borderBottomWidth: 1, borderBottomColor: theme.colors.divider
                }}>
                  <Image source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                    style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark }}>{item.name}</Text>
                </Pressable>
              )
            }} />
        </View>
      </BottomSheet>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height
  },
  card: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card2: {
    maxHeight: height - 50,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20
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
    borderRadius: 10,
    alignItems: 'center',
  },
  tabTitle: {
    width: '50%', textAlign: 'center', fontSize: fontSizes.medium, fontWeight: fontWeights.normal,
    paddingBottom: 3
  }
})


export default Profile