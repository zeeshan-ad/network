import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from 'react-native';
import PostSnippet from './PostSnippet';
import PostTextSnippet from './PostTextSnippet';
import MemoizedFeedHeader from './MemoizedFeedHeader';
import { getFriendsMoods, getMood } from '../APIs';


const MemoizedFeed = ({ navigation, Feed, callGetFeed, callGetPendingRequests, callGetProfileData }) => {


  const [FriendsMood, setFriendsMood] = useState(null);
  const [FetchedMood, setFetchedMood] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  async function callGetFriendsMood() {
    const response = await getFriendsMoods();
    if (response?.status === 200) {
      setFriendsMood(response?.data?.data);
    }
  }

  async function callGetMood() {
    const response = await getMood();
    if (response?.status === 200) {
      setFetchedMood(response?.data?.data);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const onRefresh = () => {
    callGetFriendsMood();
    callGetMood();
    callGetFeed();
    callGetPendingRequests();
    callGetProfileData();
  }

  useEffect(() => {
    callGetFriendsMood();
    callGetMood();
  }, [])


  return (
    <>
      {refreshing ? <ActivityIndicator /> : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Feed}
        ListHeaderComponent={<MemoizedFeedHeader navigation={navigation} FetchedMood={FetchedMood} FriendsMood={FriendsMood} />}
        ListFooterComponent={<View style={{ height: 150 }}></View>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          if (Array.isArray(item)) {
            return (
              <PostSnippet navigation={navigation} moment={item} />
            )
          } else {
            return (
              <PostTextSnippet navigation={navigation} memo={item} />
            )
          }
        }}
        keyExtractor={(item, index) => index}
      />
    </>
  )
}

export default memo(MemoizedFeed);