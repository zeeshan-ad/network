import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Signup from './screens/Signup';
import Home from './screens/Home';
import { useEffect, useState } from 'react';
import PostExpanded from './screens/PostExpanded';
import PostTextExpanded from './components/PostTextExpanded';
import { useSelector } from 'react-redux';
import EditProfile from './screens/EditProfile';
import AppCamera from './AppCamera';

export default function Navigator() {
  const UserInfo = useSelector((state) => state.userInfo);
  const [User, setUser] = useState();

  useEffect(() => {
    setUser(UserInfo);
  }, [UserInfo]);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={`${User?.token ? 'Home' : 'Landing'}`} screenOptions={{ gestureEnabled: false }}>
        {User?.token ?
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="PostExpanded" component={PostExpanded} options={{ headerShown: false }} />
            <Stack.Screen name="PostTextExpanded" component={PostTextExpanded} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="AppCamera" component={AppCamera} options={{ headerShown: false }} />            
          </>
          :
          <>
            <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}