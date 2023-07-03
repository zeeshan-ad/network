import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProfileTheme, fontSizes, fontWeights, theme } from '../util/constants';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { updateProfileData } from '../APIs/UpdateProfile';
import { setProfileData } from '../store/editProfileSlice';
import { Image } from 'expo-image';
import CloseOrSave from '../components/CloseOrSave';
import { useIsFocused } from '@react-navigation/native';


const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const editProfile = useSelector(state => state.editProfile);

  const [LoadSubmission, setLoadSubmission] = useState(false);

  const [Bio, setBio] = useState(editProfile?.bio);

  const [isEnabled, setIsEnabled] = useState(editProfile?.is_public);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [PickedTheme, setPickedTheme] = useState(editProfile?.theme === null ? ProfileTheme?.[0] : editProfile?.theme);

  useEffect(() => {
    dispatch(setProfileData({ ...editProfile, bio: Bio, is_public: isEnabled, theme: PickedTheme }));
  }, [editProfile, Bio, isEnabled, PickedTheme, LoadSubmission, isFocused])



  const callupdateProfileData = async () => {
    setLoadSubmission(true);
    const response = await updateProfileData(editProfile);
    if (response?.status === 200) {
      setLoadSubmission(false);
      navigation.goBack();
    } else {
      alert('Something went wrong. Please try again later.');
      setLoadSubmission(false);
    }
  }

console.log(editProfile?.image)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: editProfile?.theme }]}>
      <KeyboardAvoidingView behavior="padding" style={styles.container} >
        <CloseOrSave navigation={navigation} LoadSubmission={LoadSubmission} Save={callupdateProfileData} />
        <ScrollView contentContainerStyle={styles.bodyContainer} showsVerticalScrollIndicator={false} >
          <View style={styles.dpContainer}>
            {editProfile?.image ? (<Image source={editProfile?.image}
              resizeMethod='resize'
              style={styles.ImgStyle} />) :
              (<Image source={require('../assets/images/placeholder_profile.png')}
                style={styles.ImgStyle} contentFit="cover"
              />)}

            <Pressable onPress={() => navigation.navigate('AppCamera')} >
              <Text style={styles.updateDpBtn}>
                Update Picture
              </Text>
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.titleText}>Bio</Text>
            <TextInput selectionColor={theme.colors.darkgrey} style={styles.input} onChangeText={setBio} value={Bio} />
          </View>
          {/* <View style={styles.inputContainer}>
            <Text style={styles.titleText}>Make account private</Text>
            <Switch
              thumbColor={isEnabled ? theme.colors.secondary : '#f4f3f4'}
              ios_backgroundColor={theme.colors.grey}
              onValueChange={toggleSwitch}
              value={isEnabled} />
          </View> */}
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.titleText}>Pick a theme that best defines your vibe</Text>
            <View style={styles.colorContainer}>
              {ProfileTheme.map((item, index) => (
                <Pressable key={index} onPress={() => setPickedTheme(item)}>
                  <View style={[styles.colorStyle, { backgroundColor: item, }]}>
                    {PickedTheme === item && <MaterialIcons name="colorize" size={24} color={theme.colors.dark} />}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: { justifyContent: 'center', width: '100%', paddingHorizontal: 20 },
  dpContainer: { marginTop: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 },
  ImgStyle: { height: 100, width: 100, borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 10 },
  updateDpBtn: { fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline' },
  inputContainer: { flexDirection: 'row', width: '100%', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 30 },
  titleText: { fontSize: fontSizes.large, fontWeight: fontWeights.normal },
  colorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'center' },
  colorStyle: {
    borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 100, height: 50, width: 50,
    justifyContent: 'center', alignItems: 'center'
  },
  input: {
    borderBottomWidth: 1.5,
    paddingBottom: 5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
    width: 300,
    maxWidth: 300,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default EditProfile;