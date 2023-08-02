import React, { memo } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
import { theme, fontSizes, fontWeights, blurhash, normalize } from '../util/constants';
import { Feather } from '@expo/vector-icons';
import Mood from '../components/Mood';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';

const MemoizedFeedHeader = ({ navigation, FetchedMood, FriendsMood }) => {
  const editProfile = useSelector(state => state.editProfile);
  return (
    <>
      <Text style={styles.titleText}>Moods</Text><ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={[styles.moodsContainer]}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('PostMood', { editProfile, FetchedMood })}>
            <View style={[styles.profileMood, { marginRight: FetchedMood?.mood ? normalize(25) : normalize(0) }]}>
              <View style={{
                flexDirection: 'row',
                gap: normalize(3), alignItems: 'center', justifyContent: 'center',
                backgroundColor: theme.colors.moodContainer,
                paddingHorizontal: normalize(3), paddingVertical: normalize(4), borderRadius: normalize(100), width: FetchedMood?.mood ? normalize(116) : normalize(55)
              }}>
                {editProfile?.image ? (<Image placeholder={blurhash} source={editProfile?.image}
                  style={{ height: normalize(22), width: normalize(22), borderRadius: normalize(12), borderWidth: (1), overflow: 'hidden' }} />) :
                  (<Image source={require('../assets/images/placeholder_profile.png')}
                    style={{ height: normalize(25), width: normalize(25), borderRadius: normalize(13), borderWidth: 1 }} />)}

                <View style={[styles.moodTextContainer,
                { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
                  {FetchedMood?.mood ?
                    <Text numberOfLines={1} ellipsizeMode='clip' style={styles.moodText}>{FetchedMood?.mood}</Text> :
                    <Feather name="plus" size={normalize(18)} color={theme.colors.dark} />}
                </View>
              </View>
              <Text style={styles.text}>You</Text>
            </View>
          </TouchableWithoutFeedback>
          <Mood navigation={navigation} FriendsMood={FriendsMood} />
        </View>
      </ScrollView></>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light
  },
  text: {
    fontSize: fontSizes.smallMedium,
    fontWeight: fontWeights.normal,
    paddingTop: normalize(5),
    textAlign: "center"
  },
  titleText: {
    fontSize: fontSizes.large,
    color: theme.colors.dark,
    paddingLeft: normalize(10),
    fontWeight: fontWeights.normal
  },
  moodsContainer: {
    flexDirection: 'row',
    gap: normalize(10),
    paddingHorizontal: normalize(10),
    paddingTop: normalize(10),
    paddingBottom: normalize(10),
    zIndex: -999
  },
  profileMood: {
    position: 'relative',
    maxWidth: normalize(90),
  },
  moodTextContainer: {
    borderWidth: 1,
    borderColor: theme.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(2.5),
    borderRadius: normalize(100)
  },
  moodText: {
    width: normalize(70),
    textAlign: 'center',
    fontSize: fontSizes.medium,
    height: normalize(22),
    paddingVertical: normalize(2),
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: normalize(1),
    shadowRadius: normalize(1),
    elevation: normalize(10),
  },
  postBtn: {
    position: 'absolute',
    bottom: normalize(50),
    right: normalize(15),
    zIndex: 999,
    backgroundColor: theme.colors.secondary,
    padding: normalize(10),
    borderWidth: normalize(2),
    borderRadius: normalize(100),
    height: normalize(60),
    width: normalize(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: normalize(0),
      height: normalize(2),
    },
    shadowOpacity: normalize(.25),
    shadowRadius: normalize(5),
    elevation: normalize(10),
  }
})

export default memo(MemoizedFeedHeader);
