import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { resetPassword, sendOTP, verifyOTP } from '../APIs';

const ResetPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const [OTP, setOTP] = useState(null);
  const [SendOTP, setSendOTP] = useState(false);
  const [VerifiedOTP, setVerifiedOTP] = useState(false);
  const [count, setcount] = useState(0);
  const [NewPassword, setNewPassword] = useState('');
  const [ShowPass, setShowPass] = useState(false);

  const callSendOTP = async () => {
    const response = await sendOTP(email);
    if (response.status === 200) {
      setSendOTP(true);
      setcount(30);
    } else {
      alert('Something went wrong, please try again.');
    }
  }

  const handlePasswordChange = (text) => {
    setNewPassword(text);
  }

  useEffect(() => {
    if (!SendOTP) return;
    const timer = setTimeout(() => {
      setSendOTP(false);
      setcount(30);
    }, 30000);

    return () => clearTimeout(timer);
  }, [SendOTP])


  useEffect(() => {
    if (count === 0) return;
    const interval = setInterval(() => {
      setcount(count - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count])

  const CallVerifyOTP = async () => {
    const response = await verifyOTP(email, OTP);
    if (response.status === 200 && response.data.status === 401) {
      alert(response.data.message);
    } else if (response.status === 200) {
      setVerifiedOTP(true);
    } else {
      alert('Something went wrong, please try again.');
    }
  }

  const CallResetPassword = async () => {
    if (NewPassword.length < 8) return;
    const response = await resetPassword(email, NewPassword);
    if (response.status === 200) {
      alert('Password reset successfully!');
      navigation.navigate('Landing');
    } else {
      alert('Something went wrong, please try again.');
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>
            Reset Password
          </Text>
          {!VerifiedOTP ?
            <>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center' }}>
                  We will send a 6 digits OTP to {email}
                </Text>
              </View>
              <TextInput
                selectionColor={theme.colors.dark}
                placeholder="Enter OTP"
                keyboardType='numeric'
                value={OTP}
                onChangeText={setOTP}
                style={[styles.input, { marginTop: 20 }]} />
              {SendOTP ?
                <Text style={{
                  fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center', marginTop: 20,
                  color: theme.colors.grey, fontStyle: 'italic'
                }}>
                  OTP sent! Wait for {count} secs.
                </Text>
                :
                <Pressable onPress={callSendOTP} style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center', textDecorationLine: "underline" }}>
                    Send OTP
                  </Text>
                </Pressable>
              }
              <Pressable
                onPress={CallVerifyOTP}
                style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Verify OTP</Text>
              </Pressable>
            </>
            :
            <>
              <View style={{ justifyContent: 'center' }}>
                <TextInput secureTextEntry={ShowPass} onChangeText={handlePasswordChange}
                  style={styles.input} placeholder='Enter new password' />
                <Ionicons name={`${true ? 'md-eye-outline' : 'md-eye-off-outline'}`}
                  size={24} color={theme.colors.grey} style={{ position: 'absolute', right: 15 }} onPress={() => setShowPass(!ShowPass)} />
              </View>
              <Text style={styles.infoText}>
                Password must be at least 8 characters long.
              </Text>
              <Pressable onPress={CallResetPassword}
                style={[styles.button, { backgroundColor: NewPassword?.length < 8 ? theme.colors.disabled : theme.colors.secondary }]}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Reset password</Text>
              </Pressable>
            </>
          }
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
  infoText: {
    color: theme.colors.grey, fontSize: fontSizes.smallMedium,
    fontWeight: fontWeights.normal, marginTop: 15, textAlign: 'center'
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