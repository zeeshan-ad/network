import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';

const CloseOrSave = ({ navigation, LoadSubmission, Save }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color={theme.colors.dark} />
      </Pressable>
      {LoadSubmission ?
        (<Pressable >
          <ActivityIndicator size="small" color={theme.colors.dark} style={{ paddingTop: 5 }} />
        </Pressable>) :
        (<Pressable onPress={Save}>
          <Ionicons name="checkmark-sharp" size={30} color={theme.colors.dark} />
        </Pressable>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  iconShadow: {
    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10,
  }
})

export default CloseOrSave