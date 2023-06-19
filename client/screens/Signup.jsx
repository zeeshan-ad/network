import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Link } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createAccount } from '../APIs';
import { StatusBar } from 'expo-status-bar';
import DismissKeyboard from '../components/DismissKeyboard';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/userInfoSlice';


const Signup = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { Email } = route.params;

  const [UserDetails, setUserDetails] = useState({
    email: Email,
    name: '',
    dob: '',
    password: '',
    passwordHidden: true,
    passwordWarning: false,
  })

  const [LoginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    if (UserDetails.name && UserDetails.dob && UserDetails.password && UserDetails.email && UserDetails.password.length >= 8) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, [UserDetails])

  const handleDateChange = (prevText, text) => {
    if (text.length > 10) return;
    let formattedDate = text;
    if (text.length === 2 && prevText.length < text.length || text.length === 5 && prevText.length < text.length) {
      formattedDate += '/';
    }
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      dob: formattedDate,
    }));
  };

  const handleNameChange = (text) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      name: text,
    }));
  };

  const handlePasswordHide = () => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      passwordHidden: !prevDetails.passwordHidden,
    }));
  }

  const handlePasswordChange = (text) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      password: text,
      passwordWarning: text.length < 8,
    }));
  };


  const callCreateAccount = async () => {
    if (LoginStatus === false) return;
    const response = await createAccount(UserDetails);
    if (response?.status === 200) {
      dispatch(setUserInfo(response.data.data));
    } else if (response?.status === 409) {
      alert('Email already exists. Please login.');
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  return (
    <KeyboardAvoidingView behavior="height">
      <StatusBar style="dark" />
      <DismissKeyboard>
        <View style={styles.container}>
          <Text style={{ color: theme.colors.dark, fontSize: fontSizes.heading, fontWeight: 'bold', marginBottom: 10 }}>
            Let's get you ready!
          </Text>
          <View style={{ flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <TextInput style={styles.input} placeholder='Name' onChangeText={handleNameChange} />
            <TextInput keyboardType="numeric" style={styles.input}
              value={UserDetails.dob} placeholder='Birthday (dd/mm/yyy)' onChangeText={(text) => handleDateChange(UserDetails.dob, text)} />
            <View style={{ justifyContent: 'center' }}>
              <TextInput secureTextEntry={UserDetails.passwordHidden} onChangeText={handlePasswordChange}
                style={styles.input} placeholder='Password' onFocus={() => {
                  if (UserDetails.password.length < 8) {
                    setUserDetails((prevDetails) => ({
                      ...prevDetails,
                      passwordWarning: true,
                    }));
                  }
                }} />
              <Ionicons name={`${UserDetails.passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                size={24} color={theme.colors.grey} style={{ position: 'absolute', right: 15 }} onPress={handlePasswordHide} />
            </View>
            {UserDetails.passwordWarning &&
              <Text style={{ color: theme.colors.info, fontSize: fontSizes.smallMedium, fontWeight: fontWeights.normal, marginTop: -15, textAlign: 'center' }}>
                Password must be at least 8 characters long.
              </Text>}
          </View>
          <Pressable
            onPress={callCreateAccount}
            style={[styles.button, { backgroundColor: LoginStatus ? theme.colors.secondary : theme.colors.disabled, borderWidth: 2, borderRadius: 100 }]}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Let's Go!</Text>
          </Pressable>
          <Text style={{ textAlign: 'center', fontWeight: fontWeights.normal, fontSize: fontSizes.medium }}>
            You are using {`${Email}\n`}to sign-up. &nbsp;
            <Link to={{ screen: 'Landing' }} style={{ textDecorationLine: 'underline' }}>
              Use a different email
            </Link>
          </Text>
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 70,
    height: '100%',
    backgroundColor: theme.colors.light,
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
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 2, borderRadius: 100, borderColor: theme.colors.dark,
    paddingHorizontal: 20, backgroundColor: theme.colors.light, width: 300, height: 50,
    color: theme.colors.dark, fontSize: fontSizes.large, fontWeight: 'medium'
  }
});

export default Signup;