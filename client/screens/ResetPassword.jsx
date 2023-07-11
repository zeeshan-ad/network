import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import DismissKeyboard from '../components/DismissKeyboard';
import { TextInput } from 'react-native-gesture-handler';

const ResetPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const [OTP, setOTP] = useState(null);
  const [SendOTP, setSendOTP] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>
            Reset Password
          </Text>
          {SendOTP ?
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center' }}>
              We have sent a 6 digits OTP to {email}
            </Text> :
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center' }}>
                We will send a 6 digits OTP to {email}
              </Text>
            </View>
          }

          <TextInput
            selectionColor={theme.colors.dark}
            placeholder="Enter OTP"
            keyboardType='numeric'
            style={[styles.input, { marginTop: 20 }]} />
          <Pressable style={{ marginTop: 20 }}>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center', textDecorationLine: "underline" }}>
              Send OTP
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Continue</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Landing')}
            style={{ position: 'absolute', bottom: 10 }}>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline' }}>Go back</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: theme.colors.light,
  },
  title: { color: theme.colors.dark, fontSize: fontSizes.heading, fontWeight: 'bold', textAlign: "center", marginVertical: 30 },
  button: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    height: 52,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, borderRadius: 100
  },
  input: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: theme.colors.dark,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light,
    width: 300,
    maxWidth: 300,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  },
})

export default ResetPassword