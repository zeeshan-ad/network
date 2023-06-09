import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper'
import GoBack from '../components/GoBack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { emailRegex, theme } from '../util/constants';


const Login = ({ navigation }) => {
  const [LoginCred, setLoginCred] = useState({
    email: '',
    emailError: true,
    password: '',
  })

  const [PasswordView, setPasswordView] = useState(false)

  const handleInput = (type, e) => {
    if (type === 'email') {
      setLoginCred(prevState => ({ ...prevState, email: e.toLowerCase(), emailError: emailRegex.test(e.toLowerCase()) }))
    } else if (type === 'password') {
      setLoginCred(prevState => ({ ...prevState, password: e }))
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <GoBack navigation={navigation} title={'Log In'} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.tertiary, paddingLeft: 10 }}>Hello Again 👋</Text>
        <View>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput name="email" textContentType='emailAddress' style={styles.input} value={LoginCred.email}
            onChangeText={(e) => handleInput('email', e)}></TextInput>
        </View>
        <View>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordField}>
            <TextInput secureTextEntry={!PasswordView} name="password" textContentType='password' style={styles.input} value={LoginCred?.password}
              onChangeText={(e) => handleInput('password', e)}></TextInput>
            <Pressable style={{ position: 'absolute', right: 10, zIndex: 999 }} onPress={() => setPasswordView(!PasswordView)}>
              <MaterialCommunityIcons name={`${PasswordView ? 'eye-outline' : 'eye-off-outline'}`} size={24} color={theme.colors.grey} />
            </Pressable>
          </View>
        </View>
        <Button mode='contained' onPress={''}
          disabled={LoginCred.email && LoginCred.emailError && LoginCred.password ? false : true}
          style={{ borderRadius: 100 }}
          labelStyle={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.light }}
          contentStyle={{ backgroundColor: `${LoginCred.email && LoginCred.emailError && LoginCred.password ? theme.colors.tertiary : theme.colors.grey}`, height: 50 }}>Let's Yeet!</Button>
        <Button mode='text'
          onPress={() => navigation.navigate('ForgotPassword')}
          labelStyle={{ fontWeight: 'bold', color: theme.colors.tertiary }}
          style={{ textAlign: 'center', color: theme.colors.tertiary, paddingTop: 10 }}>Forgot Password?</Button>
      </ScrollView>
    </KeyboardAvoidingView >
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.light
  },
  formContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '60%',
    gap: 20,
    width: '80%',
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 50,
  },
  passwordField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    paddingLeft: 10,
    fontSize: 14,
    color: theme.colors.grey,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: theme.colors.light,
    borderBottomWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 10,
    height: 50,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
  }
})

export default Login