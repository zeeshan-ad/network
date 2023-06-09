import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, KeyboardAvoidingView, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import GoBack from '../components/GoBack';
import { emailRegex, passwordRegex, theme } from '../util/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createAccount } from '../APIs';


const Signup = ({ navigation }) => {
  const [PasswordView, setPasswordView] = useState(false)

  const [Step, setStep] = useState({
    currentStep: 1,
    totalSteps: 3,
    status: {
      1: false,
      2: false,
      3: false
    }
  });

  const [SignupCred, setSignupCred] = useState({
    firstname: '',
    lastname: '',
    email: '',
    emailError: true,
    password: '',
    passwordError: true
  })

  useEffect(() => {
    if (SignupCred.firstname && SignupCred.lastname) {
      setStep(prevState => ({ ...prevState, status: { ...prevState.status, 1: true } }))
    }
    if (SignupCred.email) {
      setStep(prevState => ({ ...prevState, status: { ...prevState.status, 2: true } }))
    }
    if (SignupCred.password) {
      setStep(prevState => ({ ...prevState, status: { ...prevState.status, 3: true } }))
    }
  }, [SignupCred])



  const handleInput = (type, e) => {
    if (type === 'email') {
      setSignupCred(prevState => ({ ...prevState, email: e.toLowerCase(), emailError: emailRegex.test(e.toLowerCase()) }))
    } else if (type === 'password') {
      setSignupCred(prevState => ({ ...prevState, password: e, passwordError: passwordRegex.test(e) }))
    } else if (type === 'firstname') {
      setSignupCred(prevState => ({ ...prevState, firstname: e }))
    } else if (type === 'lastname') {
      setSignupCred(prevState => ({ ...prevState, lastname: e }))
    }
  }


  const callCreateAccount = async () => {
    const res = await createAccount(SignupCred);
    console.log(res)
    if (res?.status === 200) {
      navigation.navigate('Home');
    } else {
      alert('Something went wrong')
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <GoBack navigation={navigation} title={'Create Account'} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.grey, paddingLeft: 10, textTransform: 'uppercase' }}>
          Step {Step.currentStep} of {Step.totalSteps}
        </Text>
        {Step.currentStep === 1 &&
          <>
            <View>
              <Text style={styles.label}>FIRST NAME</Text>
              <TextInput name="firstname" textContentType='name' style={styles.input} value={SignupCred.firstname}
                onChangeText={(e) => handleInput('firstname', e)}></TextInput>
            </View>
            <View>
              <Text style={styles.label}>LAST NAME</Text>
              <TextInput name="lastname" textContentType='name' style={styles.input} value={SignupCred.lastname}
                onChangeText={(e) => handleInput('lastname', e)}></TextInput>
            </View>
            <Button mode='contained' onPress={() => setStep(prevState => ({ ...prevState, currentStep: 2 }))}
              disabled={SignupCred.firstname && SignupCred.lastname ? false : true}
              style={{ borderRadius: 100 }}
              labelStyle={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.light }}
              contentStyle={{ backgroundColor: `${SignupCred.firstname && SignupCred.lastname ? theme.colors.tertiary : theme.colors.grey}`, height: 50 }}>Continue</Button>
          </>
        }
        {Step.currentStep === 2 &&
          <>
            <View>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput name="email" textContentType='emailAddress' style={styles.input} value={SignupCred.email}
                onChangeText={(e) => handleInput('email', e)}></TextInput>
            </View>
            <Button mode='contained' onPress={() => setStep(prevState => ({ ...prevState, currentStep: 3 }))}
              disabled={SignupCred.email && SignupCred.emailError ? false : true}
              style={{ borderRadius: 100 }}
              labelStyle={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.light }}
              contentStyle={{ backgroundColor: `${SignupCred.email && SignupCred.emailError ? theme.colors.tertiary : theme.colors.grey}`, height: 50 }}>Continue</Button>
          </>
        }
        {Step.currentStep === 3 &&
          <>
            <View>
              {!SignupCred.passwordError &&
                <Text style={{ fontSize: 14, color: theme.colors.darkgrey, paddingHorizontal: 10, paddingBottom: 20 }}>
                  Password must have atleast 
                  eight characters, one uppercase letter, one lowercase letter, one number, and
                  one special character
                </Text>
              }
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordField}>
                <TextInput secureTextEntry={!PasswordView} name="password" textContentType='password' style={styles.input} value={SignupCred?.password}
                  onChangeText={(e) => handleInput('password', e)}></TextInput>
                <Pressable style={{ position: 'absolute', right: 10, zIndex: 999 }} onPress={() => setPasswordView(!PasswordView)}>
                  <MaterialCommunityIcons name={`${PasswordView ? 'eye-outline' : 'eye-off-outline'}`} size={24} color={theme.colors.grey} />
                </Pressable>
              </View>

            </View>
            <Button mode='contained' onPress={callCreateAccount}
              disabled={SignupCred.password && SignupCred.passwordError ? false : true}
              style={{ borderRadius: 100 }}
              labelStyle={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.light }}
              contentStyle={{ backgroundColor: `${SignupCred.password && SignupCred.passwordError ? theme.colors.tertiary : theme.colors.grey}`, height: 50 }}>Sign up</Button>
            <Text style={{ textAlign: 'center', color: theme.colors.darkgrey, paddingTop: 10 }}>
              By tapping 'Sign up', you agree to our Privacy Policy and Terms of Service.
            </Text>
          </>
        }

      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    paddingLeft: 10,
    fontSize: 14,
    color: theme.colors.dark,
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

export default Signup