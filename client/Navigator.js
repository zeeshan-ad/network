import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Signup from './screens/Signup';
import { useEffect, useState } from 'react';
import PostExpanded from './components/PostExpanded';
import PostTextExpanded from './components/PostTextExpanded';
import { useSelector } from 'react-redux';
import EditProfile from './screens/EditProfile';
import AppCamera from './screens/AppCamera';
import Profile from './screens/Profile';
import Feed from './screens/Feed';
import PostMood from './components/PostMood';
import Post from './screens/Post';

export default function Navigator() {
  const UserInfo = useSelector((state) => state.userInfo);
  const [User, setUser] = useState();

  useEffect(() => {
    setUser(UserInfo);
  }, [UserInfo]);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName={`${User?.token ? 'Home' : 'Landing'}`}>
        {User?.token ?
          <>
            <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
            <Stack.Screen name="PostExpanded" component={PostExpanded} options={{ headerShown: false }} />
            <Stack.Screen name="PostTextExpanded" component={PostTextExpanded} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="AppCamera" component={AppCamera} options={{ headerShown: false }} />  
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />   
            <Stack.Screen name="PostMood" component={PostMood} options={{ headerShown: false }} />  
            <Stack.Screen name="Post" component={Post} options={{ headerShown: false }} />     
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