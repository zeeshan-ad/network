import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BASE_URL, ProfileTheme, fontSizes, fontWeights, theme } from '../util/constants';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { updateProfileData } from '../APIs/UpdateProfile';
import { setProfileData } from '../store/editProfileSlice';


const width = Dimensions.get('window').width;

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const editProfile = useSelector(state => state.editProfile);

  const [LoadSubmission, setLoadSubmission] = useState(false);

  const [Bio, setBio] = useState(editProfile?.bio);

  const [isEnabled, setIsEnabled] = useState(editProfile?.is_public);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [PickedTheme, setPickedTheme] = useState(editProfile?.theme === null ? ProfileTheme?.[0] : editProfile?.theme);

  useEffect(() => {
    dispatch(setProfileData({ ...editProfile, bio: Bio, is_public: isEnabled, theme: PickedTheme }));
  }, [editProfile, Bio, isEnabled, PickedTheme, LoadSubmission])

  const callupdateProfileData = async () => {
    setLoadSubmission(true);
    const response = await updateProfileData(editProfile);
    if (response?.status === 200) {
      setLoadSubmission(false);
      navigation.goBack();
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }


  return (
    <KeyboardAvoidingView behavior="height" style={styles.container} >
      <View style={{ position: 'absolute', top: 30, width: width, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 20, marginLeft: -20 }}>
          <Ionicons name="close" size={30} color={theme.colors.dark} />
        </Pressable>
        {LoadSubmission ?
          (<Pressable style={{ padding: 20, marginRight: -20 }}>
            <ActivityIndicator size="small" color={theme.colors.dark} />
          </Pressable>) :
          (<Pressable onPress={callupdateProfileData} style={{ padding: 20, marginRight: -20 }}>
            <Ionicons name="checkmark-sharp" size={30} color={theme.colors.dark} />
          </Pressable>)
        }
      </View>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ justifyContent: 'center' }} showsVerticalScrollIndicator={false} >
        <View style={{ marginTop: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          {editProfile?.image ? (<ImageBackground source={{ uri: editProfile?.image }} resizeMethod='resize'
            style={{ height: 100, width: 100 }}
            imageStyle={{ borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 10 }} />) :
            (<ImageBackground source={require('../assets/images/placeholder_profile.png')}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 10 }} />)}

          <Pressable onPress={() => navigation.navigate('AppCamera')} >
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline' }}>
              Update Picture
            </Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', width: width - 80, alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 30, }}>
          <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Bio</Text>
          <TextInput selectionColor={theme.colors.dark} style={styles.input} onChangeText={setBio} value={Bio} />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginTop: 30, }}>
          <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Make account private</Text>
          <Switch
            thumbColor={isEnabled ? theme.colors.secondary : '#f4f3f4'}
            ios_backgroundColor={theme.colors.grey}
            onValueChange={toggleSwitch}
            value={isEnabled} />
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Pick a theme that best defines your vibe</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'center' }}>
            {ProfileTheme.map((item, index) => (
              <Pressable key={index} onPress={() => setPickedTheme(item)}>
                <View style={{
                  borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 100, height: 50, width: 50,
                  backgroundColor: item, justifyContent: 'center', alignItems: 'center'
                }}>
                  {PickedTheme === item && <MaterialIcons name="colorize" size={24} color="black" />}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light
  },
  input: {
    borderBottomWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.light,
    width: 300,
    maxWidth: 300,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default EditProfile