import React, { useState, useRef } from 'react';
import { View, Text, ImageBackground, Pressable, Dimensions, ScrollView, TextInput, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { StatusBar } from 'expo-status-bar';


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const PostTextExpanded = ({ navigation }) => {

  const comments = [
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
    { "comment": "Funny" },
    { "comment": "I don't even at this point 😂I don't even at this point 😂" },
    { "comment": "My shadow says hi back!" },
    { "comment": "lol  😂" },
  ]
  return (
    <View style={{ height: height }}>
      <View style={{
        minHeight: 150, paddingVertical: 10, marginBottom: 10, marginTop: 50,
        marginHorizontal: 10, justifyContent: 'space-between',
      }}>
        <StatusBar style="dark" />
        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
            </Pressable>
            <ImageBackground source={require('../assets/images/tzara.jpg')}
              style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
            <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark }}>
              Tzara Ali
            </Text>
          </View>
          <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.light, fontSize: fontSizes.smallMedium }}>20 mins ago</Text>
        </View>
        <View>
          <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: fontSizes.yeetPosts }}>
            I think I sunk the titanic. 🚢 🌊
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{
            flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
          }}>
            <FontAwesome name="diamond" size={23} color={theme.colors.dark} />
            <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium, paddingTop: 2 }}>257</Text>
          </View>
          <View style={{
            flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 10
          }}>
            <Ionicons name="chatbubble-outline" size={25} color={theme.colors.dark} />
            <Text style={{ color: theme.colors.dark, fontWeight: fontWeights.bold, fontSize: fontSizes.medium }}>12</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 10, marginHorizontal: 20, marginBottom: 80 }}>
        {comments.map((item, index) => {
          return (
            <View key={index} style={{ flexDirection: 'row' }}>
              <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
                style={{
                  height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
                  borderColor: theme.colors.dark, overflow: 'hidden'
                }} />
              <View key={index} style={{
                backgroundColor: theme.colors.light, borderColor: theme.colors.dark, borderWidth: 2, borderRadius: 10, marginBottom: 10, maxWidth: width - 80
              }}>
                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}>
                  <View>
                    <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.semibold, paddingTop: 5, color: theme.colors.dark }}>
                      Zeeshan Ahmed
                    </Text>
                    <Text style={{ fontSize: fontSizes.small, fontWeight: fontWeights.light, paddingTop: 5, color: theme.colors.dark }}>
                      {item.comment}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
      <View style={{
        flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingTop: 10, paddingLeft: 20, paddingBottom: 20, backgroundColor: theme.colors.textPost
      }}>
        <ImageBackground source={require('../assets/images/profilepic-dummy.jpg')}
          style={{
            height: 40, width: 40, marginRight: 10, borderRadius: 100, borderWidth: 2,
            borderColor: theme.colors.dark, overflow: 'hidden'
          }} />
        <TextInput
          selectionColor={theme.colors.dark}
          style={styles.input} placeholder="Add a comment" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: theme.colors.dark,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light,
    width: width - 90,
    height: 50,
    color: theme.colors.dark,
    fontSize: fontSizes.large,
    fontWeight: 'medium'
  }
})

export default PostTextExpanded;