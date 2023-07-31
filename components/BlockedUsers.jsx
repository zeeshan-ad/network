import React from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
import { BottomSheet } from "react-native-btr";
import { BASE_URL, blurhash, fontSizes, fontWeights, theme } from '../util/constants';
import { getBlockedList, unblockUser } from '../APIs';
import { useEffect } from 'react';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from 'react-native';



const { height } = Dimensions.get('window');
const BlockedUsers = (props) => {
  const { BlockedShow, setBlockedShow } = props;

  const [BlockedListData, setBlockedListData] = useState(null);

  const callGetBlockedList = async () => {
    const response = await getBlockedList();
    if (response?.data?.status === 200) {
      setBlockedListData(response?.data?.data);
    }
  }

  const [ModalUnblock, setModalUnblock] = useState(false);
  const [itemUnblock, setItemUnblock] = useState(null);

  const callUnblockUser = async () => {
    const response = await unblockUser(itemUnblock?.blocked_user_id);
    if (response?.data?.status === 200) {
      setModalUnblock(!ModalUnblock);
      callGetBlockedList();
    }
  }



  useEffect(() => {
    callGetBlockedList();
  }, [])


  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={ModalUnblock}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.light }]}>

            <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, paddingVertical: 10, paddingHorizontal: 10, lineHeight: 20 }}>
              Are you sure you want to unblock {itemUnblock?.name + ' '?.substring(0, itemUnblock?.name + ' '?.indexOf(' '))}?
            </Text>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: "flex-end", width: '100%' }}>
              <Pressable
                onPress={() => setModalUnblock(!ModalUnblock)}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, marginVertical: 20 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={callUnblockUser}
                style={{
                  borderWidth: 2, borderColor: theme.colors.dark, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 100,
                  backgroundColor: theme.colors.secondary, height: 45
                }}
              >
                <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal }}>Unblock</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <BottomSheet
        visible={BlockedShow}
        onBackdropPress={() => setBlockedShow(!BlockedShow)}
      >
        <View style={[styles.card2, { backgroundColor: theme.colors.light }]}>
          <Pressable onPress={() => setBlockedShow(!BlockedShow)} style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingTop: 20, paddingBottom: 5,
          }}>
            <AntDesign name="circledowno" size={15} color={theme.colors.dark} />
            <Text style={{
              fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark,
              textDecorationLine: 'underline'
            }}>
              Blocked users</Text>
          </Pressable>
          <View>
            {BlockedListData?.length > 0 ?
              <FlatList
                data={BlockedListData}
                ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                renderItem={({ item }) => (
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 20,
                    borderBottomWidth: 1, borderBottomColor: theme.colors.divider
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>
                      <Image placeholder={blurhash} source={item?.profile_pic ? BASE_URL + item?.profile_pic : require('../assets/images/placeholder_profile.png')}
                        style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.dark, overflow: 'hidden' }} />
                      <Text style={{ fontSize: fontSizes.large, fontWeight: fontWeights.normal, color: theme.colors.dark }}>{item.name}</Text>
                    </View>
                    <Pressable style={{
                      backgroundColor: theme.colors.secondary, paddingVertical: 5, paddingHorizontal: 10, borderColor: theme.colors.dark,
                      borderWidth: 1, borderRadius: 100, overflow: 'hidden'
                    }} onPress={() => {
                      setItemUnblock(item);
                      setBlockedShow(!BlockedShow);
                      setTimeout(() => {
                        setModalUnblock(true);
                      }, 500);
                    }}>
                      <Text style={{
                        fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark,
                      }}>Unblock</Text>
                    </Pressable>
                  </View>
                )}
                keyExtractor={item => item.id} />
              :
              <Text style={{
                fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark, textAlign: 'center', paddingVertical: 50
              }}>No users on this list</Text>}
          </View>
        </View>
      </BottomSheet></>
  )
}

const styles = StyleSheet.create({
  card2: {
    maxHeight: height - 50,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  centeredView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: theme.colors.backdrop
  },
  modalView: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
})

export default BlockedUsers;