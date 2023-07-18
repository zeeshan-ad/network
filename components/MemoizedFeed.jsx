import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from 'react-native';
import PostSnippet from './PostSnippet';
import PostTextSnippet from './PostTextSnippet';
import MemoizedFeedHeader from './MemoizedFeedHeader';
import { getFriendsMoods, getMood } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { fontSizes, fontWeights } from '../util/constants';


const MemoizedFeed = ({ navigation, Feed, callGetFeed, callGetPendingRequests, callGetProfileData }) => {
  const isFocused = useIsFocused();

  const [FriendsMood, setFriendsMood] = useState(null);
  const [FetchedMood, setFetchedMood] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const noFeed = [{ id: 1, text: "No posts to show." }];

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
  }, [isFocused])

  return (
    <>
      {refreshing ? <ActivityIndicator /> : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Feed?.length === 0 ? noFeed : Feed}
        ListHeaderComponent={<MemoizedFeedHeader navigation={navigation} FetchedMood={FetchedMood} FriendsMood={FriendsMood} />}
        ListFooterComponent={<View style={{ height: 150 }}></View>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          if (Array.isArray(item)) {
            return (
              <PostSnippet navigation={navigation} moment={item} />
            )
          } else if (item?.text === "No posts to show.") {
            return (
              <View style={{ height: Dimensions.get('window').height / 2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal }}>No posts to show.</Text>
              </View>
            )
          }
          else {
            return (
              <PostTextSnippet navigation={navigation} memo={item} />
            )
          }
        }
        }
        keyExtractor={(item, index) => index}
      />
    </>
  )
}

export default memo(MemoizedFeed);