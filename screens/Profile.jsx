import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { fontSizes, fontWeights, theme, BASE_URL, blurhash } from '../util/constants';
import { Pressable } from 'react-native';
import { Feather, Ionicons, FontAwesome, MaterialCommunityIcons, Octicons, AntDesign, Entypo } from '@expo/vector-icons';
import { resetUserInfo } from '../store/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../APIs/logoutUser';
import { BottomSheet } from "react-native-btr";
import { getProfileData, getMood, getUserProfile, sendRequest, getRequestStatus, cancelRequest, acceptRequest, getProfilePosts, getFriendsList, reportUser, deleteUser, blockUser, getBlockedList, getBlockedListByUser } from '../APIs';
import { resetProfileData, setProfileData } from '../store/editProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import BlockedUsers from '../components/BlockedUsers';
import { getCalendars } from 'expo-localization';
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { formatDOB, formatTime } from '../util/functions';
import ProfileMomentsTab from '../components/ProfileMomentsTab';
import { useFonts } from 'expo-font';
import moment from 'moment-timezone';




const { width, height } = Dimensions.get('window');
const Profile = ({ navigation, route }) => {
  const { userId, themeColor } = route.params;
  const [FetchedMood, setFetchedMood] = useState('');
  const isFocused = useIsFocused();
  const { timeZone } = getCalendars()[0];
  let userInfo = useSelector(state => state.userInfo);
  let editProfile = useSelector(state => state.editProfile);

  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
  });


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

  const [Loggingout, setLoggingout] = useState(false);
  const callLogout = async () => {
    setLoggingout(true);
    const response = await logoutUser();

    if (response?.status === 200) {
      setLoggingout(false);
      dispatch(resetUserInfo());
      dispatch(resetProfileData());
    }
    else {
      setLoggingout(false);
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
        user_id: response?.data?.data?.user_id,
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


  const [DeletingUser, setDeletingUser] = useState(false);
  const callDeleteUser = async () => {
    setDeletingUser(true);
    const response = await deleteUser();
    if (response?.data?.status === 200) {
      setDeletingUser(false);
      dispatch(resetUserInfo());
      dispatch(resetProfileData());
    } else {
      setDeletingUser(false);
      alert('Something went wrong. Please try again later.');
    }
  }

  const [FriendsAccess, setFriendsAccess] = useState(false)
  useEffect(() => {
    if (!userId)
      setFriendsAccess(true)
    else if (RequestStatus?.status === 'accepted')
      setFriendsAccess(true)
    else
      setFriendsAccess(false)
  }, [RequestStatus?.status, userId])

  const callCancelRequest = async () => {
    const response = await cancelRequest(userId);
    if (response?.data?.status === 200) {
      callGetRequestStatus();
    }
  }

  const [AllMemos, setAllMemos] = useState();
  const [AllMoments, setAllMoments] = useState();
  const [momentsGroup, setmomentsGroup] = useState();
  const [Score, setScore] = useState();
  const callGetPosts = async (userId) => {
    setScore(0);
    const response = await getProfilePosts(userId, timeZone);
    if (response?.status === 200) {
      setAllMemos(response?.data?.data?.memos);
      setAllMoments(response?.data?.data?.moments);
      setmomentsGroup(response?.data?.data?.momentsGroup);
      setScore(response?.data?.data?.score);
    }
  }


  const onRefresh = () => {
    callGetPosts(userId);
  }


  useEffect(() => {
    setAllMoments(null);
    setAllMemos(null);
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
      callGetBlockedList(userId)
    }
  }, [isFocused, userId, userInfo?.id])

  const [sendingReq, setsendingReq] = useState(false);
  const callSendRequest = async () => {
    setsendingReq(true);
    const response = await sendRequest(userId);
    if (response?.data?.status === 200) {
      setsendingReq(false);
      callGetRequestStatus();
    } else {
      setsendingReq(false);
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

  const callBlockUser = async () => {
    const response = await blockUser(userId);
    if (response?.data?.status === 200) {
      setModalBlock(false);
      callCancelRequest();
      navigation.navigate('Feed');
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const [BlockedListData, setBlockedListData] = useState(null);
  const [BlockedListData2, setBlockedListData2] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const callGetBlockedList = async (userId) => {
    const response = await getBlockedList();
    if (response?.data?.status === 200) {
      setBlockedListData(response?.data?.data);
    }
    const response2 = await getBlockedListByUser(userId);
    if (response2?.data?.status === 200) {
      setBlockedListData2(response2?.data?.data);
    }
  }

  // if BlockedListData has user_id || blocked_user_id == userId then show user can't be  viewed [{"blocked_user_id": 22, "created_at": "2023-07-20T20:17:06.876Z", "id": 7, "name": "Tzara Ali", "profile_pic": "/uploads/profile_pic-1689233273285.png", "user_id": 21}]

  const [UserBlocked, setUserBlocked] = useState(false);

  useEffect(() => {
    if (BlockedListData && BlockedListData2) {
      const isBlocked = [...BlockedListData, ...BlockedListData2]?.filter((item) => item?.blocked_user_id === userId || item?.user_id === userId);
      if (isBlocked?.length > 0) {
        setUserBlocked(true);
      } else {
        setUserBlocked(false);
      }
    }
  }, [BlockedListData, BlockedListData2])

  const [BlockedShow, setBlockedShow] = useState();
  const [ShowScore, setShowScore] = useState(false);
  const [ModalBlock, setModalBlock] = useState(false);
  const [ModalDelete, setModalDelete] = useState(false)
  const [ReportReason, setReportReason] = useState('');
  const [OtherOptions, setOtherOptions] = useState(false);
  const [ModalReport, setModalReport] = useState(false);
  const [CurrentTab, setCurrentTab] = useState(0);
  const [SheetVisible, setSheetVisible] = useState(false);
  const [ModalLogout, setModalLogout] = useState(false);
  const [ModalRequest, setModalRequest] = useState(false);
  const [RemoveFriend, setRemoveFriend] = useState(false);
  if (!fontsLoaded) {
    return null;
  }

  if (!ProfileInfo || !userInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColor ? themeColor : theme.colors.light }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
          </Pressable>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark, fontStyle: 'italic' }}>
            Go Back
          </Text>
        </View>
        <ActivityIndicator size="large" color={theme.colors.backdrop} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </SafeAreaView>
    )
  }

  if (UserBlocked) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.light }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal }}>You can't view this profile
          </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark,
              textDecorationLine: "underline"
            }}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

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
            backgroundColor: userId ? ProfileInfo?.theme : editProfile?.theme ? editProfile?.theme : theme.colors.light, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100,
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
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 2.5 }}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold }}>
                {userId ? ProfileInfo?.name : userInfo?.name}
              </Text>
            </View>
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
                  {formatDOB(userId ? ProfileInfo?.dob : userInfo?.dob)}
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
                      sendingReq ? <ActivityIndicator size="small" color={theme.colors.backdrop} /> :
                        <Pressable onPress={callSendRequest}>
                          <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
                            <Ionicons name="md-person-add" size={16} color={theme.colors.backdrop} />
                            <Text style={{ color: theme.colors.backdrop, fontSize: fontSizes.medium, fontWeight: fontWeights.light, textDecorationLine: 'underline', marginBottom: -.5 }}>
                              Join bubble
                            </Text>
                          </View>
                        </Pressable>
              )
              }
            </View>
          </View>
          <View style={{ alignItems: 'center', gap: 5 }}>
            {!userId ? editProfile?.image ? (<Image placeholder={blurhash} source={editProfile?.image}
              style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />) :
              (<Image placeholder={blurhash} source={require('../assets/images/placeholder_profile.png')}
                style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />)
              : ProfileInfo?.profile_pic ? (<Image placeholder={blurhash} source={BASE_URL + ProfileInfo?.profile_pic}
                style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />) :
                (<Image placeholder={blurhash} source={require('../assets/images/placeholder_profile.png')}
                  style={{ height: 90, width: 90, borderRadius: 100, borderWidth: 2 }} />)}
            {FriendsAccess &&
              <Pressable onPress={() => setShowScore(true)} style={{
                position: 'absolute', top: -8,
                shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10,
                minWidth: 40, maxWidth: 100,
              }}>
                <Text numberOfLines={3} style={{
                  paddingHorizontal: 5, fontSize: fontSizes.smallMedium, fontWeight: fontWeights.bold,
                  backgroundColor: theme.colors.textPost, borderRadius: 10, overflow: 'hidden', paddingHorizontal: 5, paddingVertical: 2,
                  color: theme.colors.grey, textAlign: 'center'
                }}>
                  💎 {Score}
                </Text>
              </Pressable>}
          </View>

        </View>
        <View style={{
          flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: 0.17,
          borderBottomColor: theme.colors.backdrop
        }}>
          <Pressable onPress={() => setCurrentTab(0)} style={{
            borderBottomColor: theme.colors.dark, width: '50%',
            borderBottomWidth: CurrentTab === 0 ? 2 : 0, alignItems: 'center'
          }}><Text style={styles.tabTitle}>Moments ({AllMoments?.length ? AllMoments.length : 0})</Text>
          </Pressable>
          <Pressable onPress={() => setCurrentTab(1)} style={{
            borderBottomColor: theme.colors.dark, width: '50%',
            borderBottomWidth: CurrentTab === 1 ? 2 : 0, alignItems: 'center'
          }}><Text style={styles.tabTitle}>Memos ({AllMemos?.length ? AllMemos?.length : 0})</Text>
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
                <ProfileMomentsTab AllMoments={AllMoments} navigation={navigation}
                  refreshing={refreshing} onRefresh={onRefresh} editProfile={editProfile} userInfo={userInfo}
                  momentsGroup={momentsGroup} userId={userId} ProfileInfo={ProfileInfo} />
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
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                        {formatTime(item?.created_at)}
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
                <ProfileMomentsTab AllMoments={AllMoments} navigation={navigation}
                  refreshing={refreshing} onRefresh={onRefresh} editProfile={editProfile} userInfo={userInfo}
                  ProfileInfo={ProfileInfo}
                  momentsGroup={momentsGroup} userId={userId} />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>{ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '.indexOf(' '))}'s moments will show{'\n'}here once they post.</Text> :
              AllMemos?.length > 0 ?
                <FlatList
                  key={'#'}
                  data={AllMemos}
                  style={{ height: height, paddingTop: 5 }}
                  showsVerticalScrollIndicator={false}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                        {formatTime(item?.created_at)}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={item => item.id}
                />
                :
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
                  textAlign: 'center', marginTop: 50
                }}>{ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '.indexOf(' '))}'s memos will show{'\n'}here once they post.</Text>
            :
            // else if not friends show hidden profile
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.light, lineHeight: 30,
              textAlign: 'center', marginTop: 50
            }}>
              Join {ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '.indexOf(' '))}'s bubble to see their posts.</Text>
      }

      <Modal
        animationType="fade"
        transparent={true}
        visible={ShowScore}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.semibold, paddingTop: 30, paddingHorizontal: 20,
              color: theme.colors.dark
            }}>
              Yeet Score Calculation
            </Text>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingVertical: 5, paddingHorizontal: 20,
              color: theme.colors.backdrop, textAlign: 'center'
            }}>
              Yeet Score is determined by counting the number of days the user has posted a moment or a memo or updated their mood.
            </Text>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.semibold, paddingTop: 20, paddingHorizontal: 20,
              color: theme.colors.dark
            }}>
              Score Reset
            </Text>
            <Text style={{
              fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingVertical: 5, paddingHorizontal: 20,
              color: theme.colors.backdrop, textAlign: 'center'
            }}>
              If the user does not post or update, their Yeet Score will be reset to 0.
            </Text>
            <View style={{
              position: 'absolute', top: -20,
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10,
            }}>
              <Text numberOfLines={3} style={{
                paddingHorizontal: 5, fontSize: fontSizes.BigHightlight, fontWeight: fontWeights.bold,
                backgroundColor: theme.colors.textPost, borderRadius: 10, overflow: 'hidden', paddingHorizontal: 5, paddingVertical: 2,
                color: theme.colors.grey, textAlign: 'center'
              }}>
                💎 {Score}
              </Text>
            </View>
            <Pressable
              onPress={() => setShowScore(false)} style={{
                borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                backgroundColor: theme.colors.secondary, marginTop: 20, marginBottom: 10
              }}>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalLogout}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, paddingVertical: 20, paddingHorizontal: 20 }}>
              Are you sure you want to log out?
            </Text>
            {Loggingout ? <ActivityIndicator size="small" color={theme.colors.backdrop} /> :

              <>
                <Pressable
                  style={{
                    borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                    backgroundColor: theme.colors.danger
                  }}
                  onPress={() => {
                    setModalLogout(!ModalLogout);
                    setTimeout(() => {
                      callLogout();
                    }, 500);
                  }}>
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Log Out</Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalLogout(!ModalLogout)}>
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
                </Pressable>
              </>
            }
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
            {DeletingUser ? <ActivityIndicator size="small" color={theme.colors.light} /> :
              <View style={{ flexDirection: 'row', width: '100%', gap: 50, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Pressable
                  onPress={() => {
                    setModalDelete(!ModalDelete);
                    setTimeout(() => {
                      callDeleteUser();
                    }, 500)
                  }}>
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.light }}>Delete Account</Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalDelete(!ModalDelete)}>
                  <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
                </Pressable>
              </View>
            }
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
                {!RemoveFriend ? ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '.indexOf(' ')) + ' has requested to\njoin your bubble.' : 'Are you sure you want to remove ' + ProfileInfo?.name?.substring(0, ProfileInfo?.name.indexOf(' ')) + ' from your bubble?'}
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
      <BlockedUsers BlockedShow={BlockedShow} setBlockedShow={setBlockedShow} />
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
              setBlockedShow(!BlockedShow);
            }, 400)
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Entypo name="block" size={22} color={theme.colors.dark} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Block list</Text>
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
              Please tell us why you are reporting {ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '?.indexOf(' '))}.
              {RequestStatus?.status === 'accepted' && '\nAs a precautionary measure we will also remove them from your bubble.'}
            </Text>
            <TextInput
              selectionColor={theme.colors.selectionColor}
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalBlock}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>

            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingVertical: 10, paddingHorizontal: 10, lineHeight: 20 }}>
              Are you sure you want to block {ProfileInfo?.name + ' '?.substring(0, ProfileInfo?.name + ' '?.indexOf(' '))}?
            </Text>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: "flex-end", width: '100%' }}>
              <Pressable
                onPress={() => setModalBlock(!ModalBlock)}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={callBlockUser}
                style={{
                  borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                  backgroundColor: theme.colors.warning, height: 45
                }}
              >
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Block</Text>
              </Pressable>
            </View>
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
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>
              Report {userId ? ProfileInfo?.name : userInfo?.name}
            </Text>
          </Pressable>
          <Pressable onPress={() => {
            setOtherOptions(!OtherOptions);
            setTimeout(() => {
              setModalBlock(!ModalBlock);
            }, 400)
          }} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Entypo name="block" size={22} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>
              Block
            </Text>
          </Pressable>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={ShowFriendList}
        onBackdropPress={() => setShowFriendList(!ShowFriendList)}
      >
        <View style={[styles.card2, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={() => setShowFriendList(!ShowFriendList)} style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingTop: 20, paddingBottom: 5,
          }}>
            <AntDesign name="circledowno" size={15} color={theme.colors.dark} />
            <Text style={{
              fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark,
              textDecorationLine: 'underline'
            }}>Friends</Text>
          </Pressable>
          <FlatList
            data={FriendsList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => {
                  setShowFriendList(false);
                  navigation.navigate('Profile',
                    {
                      userId: item?.id !== userInfo?.id ? item?.id : null,
                      themeColor: item?.id !== userInfo?.id ? item?.theme : editProfile?.theme
                    })
                }} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
                  borderBottomWidth: 1, borderBottomColor: theme.colors.divider
                }}>
                  <Image placeholder={blurhash} source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
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