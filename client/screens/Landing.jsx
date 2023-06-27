import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Pressable, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, emailRegex, fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';
import DismissKeyboard from '../components/DismissKeyboard';
import { Link } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser, verifyEmail } from '../APIs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/userInfoSlice';

SplashScreen.preventAutoHideAsync();

const Landing = ({ navigation }) => {
  const dispatch = useDispatch();
  const [UserCred, setUserCred] = useState({
    email: '',
    password: '',
    passwordHidden: true,
  });


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
    const response = await verifyEmail(UserCred?.email);
    if (response?.status === 200) {
      navigation.navigate('Signup', { Email: UserCred?.email });
    } else if (response?.status === 409) {
      setDisplayPasswordInput(true);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }

  const callLogin = async () => {
    const response = await loginUser(UserCred);
    if (response?.status === 200) {
      dispatch(setUserInfo(response?.data?.data));
    } else {
      alert('Invalid Credentials');
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior="height" onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={{ height: '80%', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.logo}>{APP_NAME}</Text>
            </View>
            <View>
              <Text style={{ textAlign: 'center', marginTop: -20, fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>
                Be authentic. Make friends. Have Fun.{'\n'}Join the network.
              </Text>
            </View>
            {DisplayPasswordInput &&
              <View style={{ position: 'absolute', paddingTop: 300 }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textDecorationLine: 'underline', marginTop: -20 }}>
                  Recover Password
                </Text>
              </View>
            }
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', }}>
              {DisplayPasswordInput ?
                <View style={{ justifyContent: 'center' }}>
                  <TextInput secureTextEntry={UserCred.passwordHidden} onChangeText={handlePasswordChange}
                    style={styles.input} placeholder='Password' />
                  <Ionicons name={`${UserCred.passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                    size={24} color={theme.colors.grey} style={{ position: 'absolute', right: 15 }} onPress={handlePasswordHide} />
                </View> :
                <TextInput
                  onChangeText={handleEmailInput}
                  value={UserCred?.email}
                  style={styles.input} placeholder="Enter your email to continue" />
              }
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
            </View>
          </View>
        </View>
      </DismissKeyboard>
      {DisplayPasswordInput ?
        <View>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center', position: 'absolute', right: 0, left: 0, bottom: 20 }}>
            Not {UserCred.email}? &nbsp;
            <Text style={{ textDecorationLine: 'underline' }} onPress={() => setDisplayPasswordInput(!DisplayPasswordInput)}>
              Go Back
            </Text>
          </Text>
        </View> :
        <View>
          <Text style={{ position: 'absolute', bottom: 20, right: 0, left: 0, fontWeight: fontWeights.normal, fontSize: fontSizes.medium, textAlign: 'center', color: theme.colors.dark }}>
            By continuing, you accept our{'\n'}<Link style={{ textDecorationLine: 'underline' }} to={{ screen: '' }}>Privacy Policy</Link>&nbsp;and
            &nbsp;<Link style={{ textDecorationLine: 'underline' }} to={{ screen: '' }}>Terms of Service</Link>
          </Text>
        </View>
      }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.light,
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: fontSizes.Logo,
    color: theme.colors.dark,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    position: 'relative',
    width: 52,
    height: 52,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    borderRadius: 100,
    borderWidth: 2,
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
  }
});

export default Landing;
