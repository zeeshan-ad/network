import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { APP_NAME, fontSizes, theme } from '../util/constants';
import PhoneInput from "react-native-phone-number-input";
import { StatusBar } from 'expo-status-bar';
import DismissKeyboard from '../components/DismissKeyboard';
import { Link } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LandingBackground from '../components/LandingBackground';


SplashScreen.preventAutoHideAsync();

const Landing = ({ navigation }) => {
  const [PhoneNumber, setPhoneNumber] = useState(null);
  const [formattedValue, setFormattedValue] = useState(null);
  const phoneInput = useRef(null);

  const [fontsLoaded] = useFonts({
    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
    'Nanum': require('../assets/fonts/NanumBrushScript-Regular.ttf'),
    'VT323': require('../assets/fonts/VT323-Regular.ttf'),
    'Origami': require('../assets/fonts/origami.ttf'),
    'Tiny': require('../assets/fonts/tiny.ttf'),
    'Righteous': require('../assets/fonts/Righteous-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded])


  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior="height" onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={{ height: '80%', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.logo}>{APP_NAME}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', }}>
              <View style={{ borderWidth: 1, borderColor: theme.colors.light }}>
                <PhoneInput
                  ref={phoneInput}
                  defaultCode="IN"
                  defaultValue={PhoneNumber}
                  disableArrowIcon={true}
                  placeholder=" "
                  flagButtonStyle={{
                    paddingLeft: 10, backgroundColor: theme.colors.primary, width: 50, height: 50, borderColor: theme.colors.primary
                  }}
                  textContainerStyle={{
                    backgroundColor: theme.colors.primary, color: theme.colors.light, fontSize: fontSizes.large, height: 50, borderColor: theme.colors.primary,
                    justifyContent: 'center', alignItems: 'center'
                  }}
                  textInputStyle={{ color: theme.colors.light, fontSize: fontSizes.large }}
                  codeTextStyle={{ color: theme.colors.light, fontSize: fontSizes.large, height: 50, paddingTop: 15 }}
                  layout="first"
                  containerStyle={{ color: theme.colors.light, backgroundColor: theme.colors.primary, alignItems: 'center' }}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                  }}
                  withDarkTheme
                  withShadow
                />
              </View>
              <Pressable
                onPress={() => {
                  if (PhoneNumber?.length > 9) {
                    navigation.navigate('OTP', { phone: PhoneNumber, code: phoneInput.current.state.code, formattedValue: formattedValue })
                  }
                }}
                style={[styles.button, { backgroundColor: PhoneNumber?.length > 9 ? theme.colors.secondary : theme.colors.grey }]}>
                <MaterialCommunityIcons name="arrow-top-right" size={30} color="black" />
              </Pressable>
            </View>
            <View>
            </View>
          </View>
        </View>
      </DismissKeyboard>
      <Text style={{ position: 'absolute', bottom: 30, right: 0, left: 0, textAlign: 'center', color: theme.colors.light }}>
        Standard charges apply By continuing, you agree{'\n'}to our  <Link style={{ color: theme.colors.secondary }} to={{ screen: '' }}>Privacy Policy</Link> and
        <Link style={{ color: theme.colors.secondary }} to={{ screen: '' }}> Terms of Service</Link>.
      </Text>
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
    fontFamily: 'Righteous',
    fontSize: fontSizes.Logo,
    color: theme.colors.light,
    textAlign: 'center',
    padding: 5,
    marginBottom: 20,
  },
  button: {
    position: 'relative',
    width: 52,
    height: 52,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Landing;
