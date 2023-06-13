import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';
import { fontSizes, theme } from '../util/constants';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Link } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const OTP = ({ route, navigation }) => {
  const { phone, code, formattedValue } = route.params;


  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Text style={{ color: theme.colors.dark, fontSize: fontSizes.heading, fontWeight: 'bold', marginBottom: 10 }}>
        Enter confirmation code
      </Text>
      <Text style={{ color: theme.colors.dark, fontSize: fontSizes.medium, maxWidth: 350, fontWeight: 'bold', }}>
        You are using {`${formattedValue?.[0]}${code} ${phone}`}.
        We will use your number to verify you on each sign-in.</Text>
      <OTPInputView
        style={{ width: '100%', height: 100 }}
        pinCount={6}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code => {
          console.log(`Code is ${code}, you are good to go!`)
        })}
      />
      <Pressable
        onPress={() => { }}
        style={[styles.button, { backgroundColor: theme.colors.secondary, borderWidth: 2, borderRadius: 100 }]}>
        <Text style={{ fontSize: fontSizes.large, fontWeight: 'bold' }}>Let's Go!</Text>
      </Pressable>
      <Link to={{ screen: 'Landing' }} style={{ fontWeight: 'bold', color: theme.colors.secondary, fontSize: fontSizes.medium, textAlign: 'center' }}>
        Use a different number
      </Link>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100,
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  underlineStyleBase: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    height: 52,
    backgroundColor: theme.colors.secondary,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OTP;