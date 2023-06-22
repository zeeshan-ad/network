import React from 'react';
import { Dimensions, ImageBackground, Keyboard, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';


const width = Dimensions.get('window').width;

const EditProfile = ({ navigation }) => {
  const editProfile = useSelector(state => state.editProfile);
  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color={theme.colors.dark} />
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="checkmark-sharp" size={30} color={theme.colors.dark} />
        </Pressable>
      </View>
      <View style={{ marginTop: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <ImageBackground source={{ uri: editProfile?.image?.uri }} resizeMethod='resize'
          style={{ height: 100, width: 100 }}
          imageStyle={{ borderWidth: 2, borderColor: theme.colors.dark, borderRadius: 10 }} />
        <Pressable onPress={() => navigation.navigate('AppCamera')} >
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline' }}>
            Update Picture
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', width: width - 80, alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 30, }}>
        <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Bio</Text>
        <TextInput selectionColor={theme.colors.dark} style={styles.input} />
      </View>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginTop: 30, }}>
        <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Make account private</Text>
        <Switch />
      </View>
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
    paddingHorizontal: 10,
    backgroundColor: theme.colors.light,
    width: 300,
    maxWidth: 300,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default EditProfile