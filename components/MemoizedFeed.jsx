import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from 'react-native';
import PostSnippet from './PostSnippet';
import PostTextSnippet from './PostTextSnippet';
import MemoizedFeedHeader from './MemoizedFeedHeader';
import { getFriendsMoods, getMood } from '../APIs';
import { useIsFocused } from '@react-navigation/native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Pressable } from 'react-native';

const { height, width } = Dimensions.get('window');

const MemoizedFeed = ({ navigation, Feed, callGetFeed, callGetPendingRequests, callGetProfileData, editProfile }) => {
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
        renderItem={({ item, index }) => {
          if (Array.isArray(item)) {
            return (
              <PostSnippet key={index} navigation={navigation} moment={item} />
            )
          } else if (item?.text === "No posts to show.") {
            return (
              <View style={{ position: "absolute", flex: 1, height: height/2, justifyContent: "center", alignItems: "center", width: width }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center' }}>
                  There is nothing to show, add friends{'\n'}to your bubble to fill up this space.
                </Text>
                <Pressable onPress={() => navigation.navigate('Search', { editProfile })}
                  style={{ marginTop: 20, backgroundColor: theme.colors.secondary, padding: 10, borderRadius: 10, borderWidth: 2 }}>
                  <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark }}>Find friends</Text>
                </Pressable>
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