import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native';
import { fontSizes, fontWeights, normalize, theme } from '../util/constants';
import { Link } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createAccount, verifyUsername } from '../APIs';
import DismissKeyboard from '../components/DismissKeyboard';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/userInfoSlice';
import _ from 'lodash';
import Checkbox from 'expo-checkbox';
import { ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';


const Signup = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { Email } = route.params;

  const [UserDetails, setUserDetails] = useState({
    email: Email,
    name: '',
    dob: '',
    password: '',
    username: '',
    passwordHidden: true,
    passwordWarning: false,
    usernameVerified: false,
    usernameWarning: false,
  })

  const [isChecked, setChecked] = useState(false);

  const [LoginStatus, setLoginStatus] = useState(false);
  const [Step, setStep] = useState(1);

  useEffect(() => {
    if (UserDetails.name && UserDetails.dob && UserDetails.password
      && UserDetails?.email && UserDetails?.password?.length >= 8) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, [UserDetails?.name, UserDetails?.dob, UserDetails?.password, UserDetails?.email])

  const callVerifyUsername = async (username) => {
    const response = await verifyUsername(username);
    if (response?.status === 200) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        usernameVerified: true,
        usernameWarning: true,
      }));
    } else {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        usernameVerified: false,
        usernameWarning: true,
      }));
    }
  }

  const debouncedCallVerifyUsername = _.debounce(callVerifyUsername, 500);

  useEffect(() => {
    if (UserDetails?.username)
      debouncedCallVerifyUsername(UserDetails?.username);
    return () => {
      debouncedCallVerifyUsername.cancel();
    }
  }, [UserDetails?.username])

  const handleDateChange = (prevText, text) => {
    if (text?.length > 10) return;
    let formattedDate = text;
    if (text?.length === 2 && prevText?.length < text?.length || text?.length === 5 && prevText?.length < text?.length) {
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

  const handleUserNamechange = (text) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      username: text.toLowerCase().replaceAll(' ', ''),
    }));
  }

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
      passwordWarning: text?.length < 8,
    }));
  };

  const [Loading, setLoading] = useState(false);
  const callCreateAccount = async () => {
    if (Step === 2) {
      if (LoginStatus === false) return;
      setLoading(true);
      const response = await createAccount(UserDetails);
      if (response?.status === 200) {
        setLoading(false);
        dispatch(setUserInfo(response.data.data));
      } else {
        setLoading(false);
        alert('Something went wrong. Please try again later.');
      }
    } else {
      setStep(2);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : 30 }]}>
      <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
        behavior={Platform.OS === 'ios' ? "padding" : "height"}>
        <DismissKeyboard>
          {/* <ScrollView contentContainerStyle={styles.container}> */}
          <View style={styles.container}>
            <Text style={styles.title}>
              {Step === 1 ? "Let's get you ready!" : "Choose a username"}
            </Text>
            <View style={styles.form}>
              {Step === 1 ?
                <>
                  <TextInput selectionColor={theme.colors.selectionColor} style={styles.input} placeholder='Name' value={UserDetails.name} onChangeText={handleNameChange} />
                  <TextInput selectionColor={theme.colors.selectionColor} keyboardType="numeric" style={styles.input}
                    value={UserDetails.dob} placeholder='Birthday (dd/mm/yyyy)' onChangeText={(text) => handleDateChange(UserDetails.dob, text)} /><View style={{ justifyContent: 'center' }}>
                    <TextInput selectionColor={theme.colors.selectionColor} secureTextEntry={UserDetails.passwordHidden} onChangeText={handlePasswordChange}
                      style={styles.input} placeholder='Password' value={UserDetails.password} onFocus={() => {
                        if (UserDetails?.password?.length < 8) {
                          setUserDetails((prevDetails) => ({
                            ...prevDetails,
                            passwordWarning: true,
                          }));
                        }
                      }} />
                    <Ionicons name={`${UserDetails.passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                      size={24} color={theme.colors.grey} style={{ position: 'absolute', right: normalize(15) }} onPress={handlePasswordHide} />
                  </View>
                  {UserDetails.passwordWarning &&
                    <Text style={styles.infoText}>
                      Password must be at least 8 characters long.
                    </Text>}
                </>
                :
                <View style={{ justifyContent: 'center' }}>
                  <TextInput selectionColor={theme.colors.selectionColor} onChangeText={handleUserNamechange} style={styles.input} placeholder='Username' onFocus={() => {
                    setUserDetails((prevDetails) => ({
                      ...prevDetails,
                      usernameWarning: true,
                    }));
                  }} value={UserDetails?.username} />
                  {UserDetails.usernameWarning ?
                    <MaterialCommunityIcons name={`${UserDetails.usernameVerified ? 'check-decagram-outline' : 'close-circle-outline'}`}
                      size={24} color={UserDetails.usernameVerified ? theme.colors.secondary : theme.colors.danger} style={{ position: 'absolute', right: normalize(15) }} />
                    : null
                  }
                </View>
              }
            </View>
            {Step === 1 &&
              <Pressable
                onPress={LoginStatus && isChecked ? callCreateAccount : null}
                style={[styles.button, { bottom: normalize(20), backgroundColor: LoginStatus && isChecked ? theme.colors.secondary : theme.colors.disabled }]}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Continue</Text>
              </Pressable>
            }

            {Step === 2 && (
              Loading ? <ActivityIndicator size="small" color={theme.colors.backdrop} style={{ position: 'absolute', bottom: normalize(50) }} /> :
                <>
                  <Pressable
                    onPress={UserDetails?.usernameVerified ? callCreateAccount : null}
                    style={[styles.button, { bottom: normalize(50), backgroundColor: UserDetails?.usernameVerified ? theme.colors.secondary : theme.colors.disabled }]}>
                    <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Let's Go!</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setStep(1);
                    }}
                    style={{ position: 'absolute', bottom: normalize(10) }}>
                    <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline' }}>Go back</Text>
                  </Pressable>
                </>)}

            <Text style={styles.text}>
              {`${Email}\n`}
              <Link to={{ screen: 'Landing' }} style={styles.link}>
                Use a different email
              </Link>
            </Text>
            {Step === 1 &&
              <View style={styles.section}>
                <Checkbox
                  color={isChecked ? theme.colors.secondary : undefined}
                  style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
                <Text style={styles.text}>You agree to&nbsp;
                  <Text onPress={() => navigation.navigate('Document', { DocType: 'EULA' })} style={styles.link}>EULA</Text>
                  &nbsp;on signing up</Text>
              </View>
            }
          </View>
          {/* </ScrollView> */}

        </DismissKeyboard>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: normalize(10),
    paddingHorizontal: normalize(20),
    paddingTop: normalize(5),
    height: '100%',
    backgroundColor: theme.colors.light,
  },
  section: {
    marginTop: normalize(-10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: normalize(8),
    borderColor: theme.colors.dark,
    borderWidth: normalize(2)
  },
  infoText: {
    color: theme.colors.info, fontSize: fontSizes.smallMedium,
    fontWeight: fontWeights.normal, marginTop: normalize(-10), textAlign: 'center'
  },
  underlineStyleBase: {
    borderRadius: normalize(100),
    borderWidth: normalize(2),
    borderColor: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  link: { textDecorationLine: 'underline' },
  button: {
    position: 'absolute',
    width: '100%',
    height: normalize(45),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(2),
    borderRadius: normalize(100)
  },
  form: { flexDirection: 'column', justifyContent: 'center', gap: normalize(15) },
  input: {
    borderWidth: normalize(2), borderRadius: normalize(100), borderColor: theme.colors.dark,
    paddingHorizontal: normalize(20), backgroundColor: theme.colors.light, width: normalize(300), height: normalize(45),
    color: theme.colors.dark, fontSize: fontSizes.large, fontWeight: 'medium'
  },
  title: { color: theme.colors.dark, fontSize: fontSizes.heading, fontWeight: 'bold', marginBottom: normalize(10) },
  text: { textAlign: 'center', fontWeight: fontWeights.normal, fontSize: fontSizes.medium }
});

export default Signup;