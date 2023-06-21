import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './Feed';
import Notification from './Notification';
import Post from './Post';
import Txt from './Txt';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { theme } from '../util/constants';
import { View } from 'react-native';
import Profile from './Profile';

const Home = () => {

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName={'Feed'} screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: theme.colors.light, borderTopWidth: 0, elevation: 0, paddingTop:10}
    }}
      sceneContainerStyle={{ backgroundColor: theme.colors.light }} >
      <Tab.Screen name="Post" component={Post} options={{
        headerShown: false, tabBarIcon: ({ tintColor }) => {
          return (
            <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 100, padding: 5 }}>
              <Feather name="plus" size={30} />
            </View>
          )
        }
      }} />
      <Tab.Screen name="Txt" component={Txt} options={{
        headerShown: false, tabBarIcon: ({ }) => {
          return <FontAwesome name="send-o" size={25} />
        }
      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        headerShown: false, tabBarVisible: false, tabBarButton: () => null,
      }} />
      <Tab.Screen name="Notification" component={Notification} options={{
        headerShown: false, tabBarIcon: ({ }) => {
          return <Entypo name="notification" size={25} />
        }
      }} />
      <Tab.Screen name="Feed" component={Feed} options={{
        headerShown: false, tabBarIcon: ({ }) => {
          return <Feather name="home" size={25} />
        }
      }} />
    </Tab.Navigator>
  )
}

export default Home;