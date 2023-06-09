import React from 'react';
import {Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../util/constants';


const GoBack = ({ navigation, title }) => {
  return (
    <View style={{ paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons name="ios-chevron-back-outline" size={30} color={theme.colors.tertiary} />
      </Pressable>
      <Text style={{ fontSize: 20, color: theme.colors.dark, fontWeight:'500', textTransform:'uppercase', paddingTop: 5 }}>{title}</Text>
      <View style={{ width: 28 }}></View>
    </View>
  )
}

export default GoBack;