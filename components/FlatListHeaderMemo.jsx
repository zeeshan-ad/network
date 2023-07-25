import React, { useState, memo, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { deleteMemo } from '../APIs';
import { BottomSheet } from 'react-native-btr';
import { formatTime } from '../util/functions';
import { useSelector } from 'react-redux';

const FlatListHeaderMemo = ({ isPostingLike, liked, navigation, callPostLike, callRemoveLIke, memo, AllComments, userInfo, setShowLikedUsers,
  ShowLikedUsers }) => {
  const [ShowOption, setShowOption] = useState(false);
  const editProfile = useSelector(state => state.editProfile);

  const callDeleteMemo = async () => {
    const response = await deleteMemo(memo.id);
    if (response.status === 200) {
      setShowOption(false);
      navigation.goBack();
    }
  }

  return (
    <><View style={{
      minHeight: 150, paddingVertical: 20, marginBottom: 10, marginTop: 50, justifyContent: 'space-between',
    }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: -10 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Profile', {
            userId: memo?.user_id !== userInfo?.id ? memo?.user_id : null,
            themeColor: memo?.user_id !== userInfo?.id ? memo?.theme : editProfile?.theme
          })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image placeholder={blurhash} source={memo?.profile_pic ? BASE_URL + memo?.profile_pic : require('../assets/images/placeholder_profile.png')}
              style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
            <View>
              <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, color: theme.colors.dark }}>
                {memo?.name}
              </Text>
              <Text numberOfLines={2} style={{
                color: theme.colors.dark, fontWeight: fontWeights.light,
                fontSize: fontSizes.smallMedium, width: 100
              }}>
                {formatTime(memo?.created_at)}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={{ marginVertical: 10, fontSize: fontSizes.yeetPosts, lineHeight: 30 }}>
          {memo?.memo}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 2, paddingTop: 10 }}>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center'
        }}>
          {liked?.isLiked ?
            <Pressable onPress={callRemoveLIke}>
              <FontAwesome name="heart" size={23} color={theme.colors.danger} />
            </Pressable> :
            !isPostingLike ?
              <Pressable onPress={callPostLike}>
                <FontAwesome name="heart-o" size={23} color={theme.colors.dark} />
              </Pressable> :
              <FontAwesome name="heart-o" size={23} color={theme.colors.dark} />
          }
          <Pressable onPress={() => setShowLikedUsers(!ShowLikedUsers)}>
            <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>{liked?.totalLikes}
              <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;{liked?.totalLikes < 2 ? 'like' : 'likes'}</Text></Text>
          </Pressable>
        </View>
        <View style={{
          flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
        }}>
          <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>{AllComments?.length}
            <Text style={{ fontWeight: fontWeights.normal }}>&nbsp;comments</Text></Text>
        </View>
        {userInfo?.id === memo?.user_id &&
          <View style={{
            flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
          }}>
            <Pressable onPress={() => setShowOption(true)}>
              <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.dark} />
            </Pressable>
          </View>}
      </View>
    </View>
      <BottomSheet
        visible={ShowOption}
        onBackdropPress={() => setShowOption(!ShowOption)}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={callDeleteMemo} style={{
            flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20,
            borderBottomWidth: 1, borderBottomColor: theme.colors.divider
          }}>
            <Feather name="trash" size={22} color={theme.colors.danger} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.danger }}>Delete this memo</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </>
  )
}


const styles = StyleSheet.create({
  card: {
    height: 90,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
  }
});

export default memo(FlatListHeaderMemo);