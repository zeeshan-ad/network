import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { fontSizes, emojis } from '../util/constants';


const EmojiKeyboard = ({ onEmojiSelected }) => {
  const handleEmojiPress = (emoji) => {
    onEmojiSelected(emoji);
  };


  return (
    <FlatList
      numColumns={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.emojiContainer}
      data={emojis.filter((emoji) => emoji?.length === 2)}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.emojiButton}
            onPress={() => handleEmojiPress(item)}
          >
            <Text style={styles.emojiText}>{item}</Text>
          </TouchableOpacity>)
      }}
      keyExtractor={(_item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  emojiContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 200,
  },
  emojiButton: {
    padding: 10,
  },
  emojiText: {
    fontSize: fontSizes.xlarge,
  },
});

export default EmojiKeyboard;
