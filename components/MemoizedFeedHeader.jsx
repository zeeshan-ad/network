import React, { memo } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
import { theme, fontSizes, fontWeights } from '../util/constants';
import { Feather } from '@expo/vector-icons';
import Mood from '../components/Mood';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';

const MemoizedFeedHeader = ({ navigation, FetchedMood, FriendsMood }) => {
  const editProfile = useSelector(state => state.editProfile);
  return (
    <><Text style={styles.titleText}>Moods</Text><ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.moodsContainer}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('PostMood', { editProfile, FetchedMood })}>
          <View style={styles.profileMood}>
            {editProfile?.image ? (<Image source={editProfile?.image}
              style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2, overflow: 'hidden' }} />) :
              (<Image source={require('../assets/images/placeholder_profile.png')}
                style={{ height: 80, width: 80, borderRadius: 100, borderWidth: 2 }} />)}

            <View style={[styles.moodTextContainer, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.secondary, }]}>
              {FetchedMood?.mood ?
                <Text numberOfLines={1} ellipsizeMode='clip' style={styles.moodText}>{FetchedMood?.mood}</Text> :
                <Feather name="plus" size={20} color={theme.colors.dark} />}
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
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.normal,
    paddingTop: 5
  },
  titleText: {
    fontSize: fontSizes.large,
    color: theme.colors.dark,
    paddingLeft: 10,
    fontWeight: fontWeights.normal
  },
  moodsContainer: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: -999
  },
  profileMood: {
    position: 'relative',
    alignItems: 'center'
  },
  moodTextContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: -15,
    padding: 3,
    borderRadius: 100
  },
  moodText: {
    width: 70,
    textAlign: 'center',
    fontSize: fontSizes.medium,
    height: 22,
    paddingVertical: 2,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 10,
  },
  postBtn: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    zIndex: 999,
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderWidth: 2,
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .25,
    shadowRadius: 5,
    elevation: 10,
  }
})

export default memo(MemoizedFeedHeader);
