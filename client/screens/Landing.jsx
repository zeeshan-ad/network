import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Pressable, TextInput, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, emailRegex, fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';
import DismissKeyboard from '../components/DismissKeyboard';
import { Link } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser, verifyEmail } from '../APIs';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';


SplashScreen.preventAutoHideAsync();

const Landing = ({ navigation }) => {
  const [UserCred, setUserCred] = useState({
    email: '',
    password: '',
    passwordHidden: true,
  });

  const [fontsLoaded] = useFonts({
    'Cherry': require('../assets/fonts/CherryBombOne-Regular.ttf'),
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
      navigation.navigate('Home', { userData: response?.data });
    } else if (response?.status === 401) {
      alert(response.message);
    } else {
      alert('Something went wrong. Please try again later.');
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
            <View style={{ flexDirection: "row", gap: 10, marginTop: -20, marginBottom: 10 }}>
              <FontAwesome name="close" size={50} color={theme.colors.warning} style={styles.icons} />
              <FontAwesome name="circle" size={50} color={theme.colors.accent} style={styles.icons} />
              <FontAwesome name="close" size={50} color={theme.colors.danger} style={styles.icons} />
              <FontAwesome name="circle" size={50} color={theme.colors.info} style={styles.icons} />
            </View>
            <View>
              <Text style={{ textAlign: 'center', fontSize: fontSizes.BigHightlight, fontWeight: 'bold', marginTop: -20 }}>
                Bold Expressions{'\n'}Unique Impressions
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', }}>
              {DisplayPasswordInput ?
                <View style={{ justifyContent: 'center' }}>
                  <TextInput secureTextEntry={UserCred.passwordHidden} onChangeText={handlePasswordChange}
                    style={styles.input} placeholder='Password' />
                  <Ionicons name={`${UserCred.passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                    size={24} color={theme.colors.grey} style={{ position: 'absolute', right: 15 }} onPress={handlePasswordHide} />
                </View> :
                <TextInput
                  selectionColor={theme.colors.secondary}
                  onChangeText={handleEmailInput}
                  value={UserCred?.email}
                  style={styles.input} placeholder="Email Id" />
              }
              <Pressable
                onPress={() => {
                  if (DisplayPasswordInput) {
                    callLogin();
                  } else {
                    callVerifyEmail();
                  }
                }}
                style={[styles.button, { backgroundColor: UserCred.email.match(emailRegex) ? theme.colors.secondary : theme.colors.disabled }]}>
                <MaterialCommunityIcons name="arrow-top-right" size={30} color="black" />
              </Pressable>
            </View>
            {DisplayPasswordInput &&
              <View style={{ position: 'relative' }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.secondary, marginTop: -20 }}>
                  Forgot Password?
                </Text>
              </View>
            }
          </View>
        </View>
      </DismissKeyboard>
      {DisplayPasswordInput ?
        <View>
          <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center', position: 'absolute', right: 0, left: 0, bottom: 20 }}>
            Not {UserCred.email}? &nbsp;
            <Text style={{ color: theme.colors.secondary }} onPress={() => setDisplayPasswordInput(!DisplayPasswordInput)}>
              Go Back
            </Text>
          </Text>
        </View> :
        <View>
          <Text style={{ position: 'absolute', bottom: 20, right: 0, left: 0, fontWeight: fontWeights.normal, fontSize: fontSizes.medium, textAlign: 'center', color: theme.colors.dark }}>
            By continuing, you accept our{'\n'}<Link style={{ color: theme.colors.secondary }} to={{ screen: '' }}>Privacy Policy</Link> and
            <Link style={{ color: theme.colors.secondary }} to={{ screen: '' }}> Terms of Service</Link>
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
    backgroundColor: theme.colors.primary,
  },
  logo: {
    fontFamily: 'Cherry',
    fontSize: fontSizes.Logo,
    color: theme.colors.logo,
    textAlign: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 50,
  },
  icons: {
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
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
    borderWidth: 2, borderRadius: 100, borderColor: theme.colors.dark,
    paddingHorizontal: 20, backgroundColor: theme.colors.light, width: 300, height: 50,
    color: theme.colors.dark, fontSize: fontSizes.large, fontWeight: 'medium'
  }
});

export default Landing;
