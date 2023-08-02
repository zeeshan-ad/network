import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Pressable, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, emailRegex, fontSizes, fontWeights, normalize, theme } from '../util/constants';
import DismissKeyboard from '../components/DismissKeyboard';
import { Link } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser, verifyEmail } from '../APIs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/userInfoSlice';
import { ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

const Landing = ({ navigation }) => {
  const dispatch = useDispatch();
  const [UserCred, setUserCred] = useState({
    email: '',
    password: '',
    passwordHidden: true,
  });

  const [Loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  const handleEmailInput = (text) => {
    setUserCred((prevCred) => ({
      ...prevCred,
      email: text.toLowerCase(),
    }));
  }

  const handlePasswordChange = (text) => {
    setUserCred((prevCred) => ({
      ...prevCred,
      password: text,
    }));
  }

  const [DisplayPasswordInput, setDisplayPasswordInput] = useState(false);

  const handlePasswordHide = () => {
    setUserCred((prevCred) => ({
      ...prevCred,
      passwordHidden: !prevCred.passwordHidden,
    }));
  }

  const callVerifyEmail = async () => {
    setLoading(true);
    const response = await verifyEmail(UserCred?.email);
    if (response?.status === 200) {
      setLoading(false);
      navigation.navigate('Signup', { Email: UserCred?.email });
    } else if (response?.status === 409) {
      setLoading(false);
      setDisplayPasswordInput(true);
    } else {
      setLoading(false);
      alert('Something went wrong. Please try again later.');
    }
  }

  const callLogin = async () => {
    setLoading(true);
    const response = await loginUser(UserCred);
    if (response?.status === 200 && response?.data?.message === 'Login Successful') {
      setLoading(false);
      dispatch(setUserInfo(response?.data?.data));
    } else if (response?.status === 200 && response?.data?.status === 401) {
      setLoading(false);
      alert('Incorrect Password. Please try again with the correct password.');
    } else {
      setLoading(false);
      alert('Something went wrong. Please try again later.');
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} onLayout={onLayoutRootView}>
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.centerContainer}>
            <View>
              <Text style={styles.logo}>{APP_NAME}</Text>
            </View>
            {/* <View>
              <Text style={styles.title}>
                Be authentic. Find friends.
              </Text>
            </View> */}
            <View style={styles.form}>
              {DisplayPasswordInput ?
                <View style={{ justifyContent: 'center' }}>
                  <TextInput selectionColor={theme.colors.selectionColor} secureTextEntry={UserCred.passwordHidden} onChangeText={handlePasswordChange}
                    style={styles.input} placeholder='Password' />
                  <Ionicons name={`${UserCred.passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                    size={24} color={theme.colors.grey} style={{ position: 'absolute', right: normalize(15) }} onPress={handlePasswordHide} />
                </View> :
                <TextInput
                  selectionColor={theme.colors.selectionColor}
                  onChangeText={handleEmailInput}
                  value={UserCred?.email}
                  style={styles.input} placeholder="Enter your email to continue" />
              }
              {Loading ? <ActivityIndicator size="small" color={theme.colors.backdrop} /> :
                <Pressable
                  onPress={() => {
                    if (UserCred.email.match(emailRegex)) {
                      if (DisplayPasswordInput) {
                        callLogin();
                      } else {
                        callVerifyEmail();
                      }
                    }
                  }}
                  style={[styles.button, { backgroundColor: UserCred.email.match(emailRegex) ? theme.colors.secondary : theme.colors.disabled }]}>
                  <MaterialCommunityIcons name="arrow-top-right" size={30} color="black" />
                </Pressable>
              }
            </View>
            <View>
              {DisplayPasswordInput &&
                <Pressable onPress={() => navigation.navigate('ResetPassword', { email: UserCred.email })}>
                  <Text style={[styles.link, { fontSize: fontSizes.medium, fontWeight: fontWeights.normal }]}>
                    Reset Password
                  </Text>
                </Pressable>
              }
            </View>
          </View>
        </View>
      </DismissKeyboard>
      {DisplayPasswordInput ?
        <View>
          <Text style={styles.text}>
            Not {UserCred.email}? &nbsp;
            <Text style={styles.link} onPress={() => setDisplayPasswordInput(!DisplayPasswordInput)}>
              Go Back
            </Text>
          </Text>
        </View> :
        <View>
          <Text style={styles.text}>
            By continuing, you accept our{'\n'}
            <Link style={styles.link} to={{ screen: 'Document', params: { DocType: 'Policy' } }}>Privacy Policy</Link>&nbsp;and
            &nbsp;<Link style={styles.link} to={{ screen: 'Document', params: { DocType: 'Terms' } }}>Terms of Service</Link>
          </Text>
        </View>
      }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: normalize(70),
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.light,
  },
  form: { flexDirection: 'row', justifyContent: 'center', gap: normalize(10), alignItems: 'center' },
  link: { textDecorationLine: 'underline' },
  centerContainer: { height: '80%', justifyContent: 'center', alignItems: 'center', gap: normalize(20) },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: fontSizes.Logo,
    color: theme.colors.dark,
    textAlign: 'center',
    paddingHorizontal: normalize(10),
  },
  button: {
    position: 'relative',
    width: normalize(45),
    height: normalize(45),
    backgroundColor: theme.colors.secondary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    borderRadius: normalize(100),
    borderWidth: normalize(2),
  },
  input: {
    borderWidth: normalize(2),
    borderRadius: normalize(100),
    borderColor: theme.colors.dark,
    paddingHorizontal: normalize(20),
    backgroundColor: theme.colors.light,
    width: normalize(250),
    height: normalize(45),
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  },
  text: {
    position: 'absolute', bottom: normalize(20), right: normalize(0), left: normalize(0), fontWeight: fontWeights.normal,
    fontSize: fontSizes.medium,
    textAlign: 'center', color: theme.colors.dark
  }
});

export default Landing;
