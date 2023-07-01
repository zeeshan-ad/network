import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, TextInput, StyleSheet, KeyboardAvoidingView, Pressable, Dimensions, FlatList, Text, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme, fontSizes, BASE_URL, fontWeights } from '../util/constants';
import { search } from '../APIs';
import _ from 'lodash';
import { Image } from 'expo-image';

const width = Dimensions.get('window').width;

const Search = ({ navigation, route }) => {

  const { editProfile } = route.params;

  const [searchTerm, setsearchTerm] = useState("");
  const [searchResult, setsearchResult] = useState(null);
  const [Offset, setOffset] = useState(0);
  const [isLoadMore, setisLoadMore] = useState(false);

  const callSearch = async (searchTerm) => {
    setisLoadMore(true);
    const response = await search(searchTerm, Offset);
    if (response?.status === 200) {
      if (Offset === 0)
        setsearchResult(response?.data?.data);
      else
        setsearchResult([...searchResult, ...response?.data?.data]);
      setisLoadMore(false);
    } else {
      alert('Something went wrong. Please try again later.');
      setisLoadMore(false);
    }
  }

  const debouncedSearch = _.debounce(callSearch, 500);

  const LoadMore = () => {
    if (searchTerm.length > 2)
      setOffset(prev => prev + 20);
    else
      setOffset(0)
    debouncedSearch(searchTerm);
  }
  console.log(Offset)
  useEffect(() => {
    if (searchTerm.length > 2)
      debouncedSearch(searchTerm);
    else
      setsearchResult(null);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light }]}>
      <KeyboardAvoidingView behavior='padding' style={styles.container} >
        <View style={styles.wrapHeader}>
          <Pressable onPress={() => navigation.goBack()} style={[styles.iconShadow, { marginLeft: -10 }]}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
          </Pressable>
          <View style={{ alignItems: 'center', width: width - 60 }}>
            <TextInput
              selectionColor={theme.colors.dark}
              value={searchTerm}
              style={[styles.input, { backgroundColor: editProfile?.theme ? editProfile?.theme : theme.colors.light }]} placeholder='find a friend' onChangeText={(text) => setsearchTerm(text.toLowerCase())} />
            <Feather name='search' size={20} color={theme.colors.grey} style={{ position: 'absolute', left: 12, paddingTop: 7 }} />
          </View>
        </View>
        {searchResult?.length > 0 ?
          <View style={styles.resultContainer}>
            <FlatList
              data={[...searchResult, { loadmore: true }]}
              renderItem={({ item }) => {
                if (!item?.loadmore) {
                  return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }}>
                      <Pressable onPress={() => navigation.navigate('Profile', { userId: item._id })}>
                        {item.profile_pic ? <Image source={item.profile_pic}
                          style={{ height: 50, width: 50, borderRadius: 100, borderWidth: 2 }} />
                          : <Image source={require('../assets/images/placeholder_profile.png')}
                            style={{ height: 50, width: 50, borderRadius: 100, borderWidth: 2 }} />}
                      </Pressable>
                      <View style={{ marginLeft: 10 }}>
                        <Pressable onPress={() => navigation.navigate('Profile', { userId: item._id })}>
                          <Text style={{ fontSize: fontSizes.medium, fontWeight: 'bold', color: theme.colors.dark }}>{item.name}</Text>
                        </Pressable>
                        <Text style={{ fontSize: fontSizes.small, color: theme.colors.dark }}>@{item.username}</Text>
                      </View>
                    </View>)
                }
                else {
                  return (
                    isLoadMore ?
                      <ActivityIndicator size="small" color={theme.colors.light} /> :
                      <Pressable onPress={LoadMore} style={{ marginTop: 20 }}>
                        <Text style={{
                          fontSize: fontSizes.medium, fontWeight: fontWeights.normal, textAlign: 'center',
                          textDecorationLine: 'underline'
                        }}>Load more results</Text>
                      </Pressable>
                  )
                }
              }}
              keyExtractor={item => item.id} /><Pressable>

            </Pressable>
          </View>
          : searchResult === null ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.dark }}>
                Start typing a name or username...</Text>
            </View> :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: fontWeights.normal, color: theme.colors.darkgrey }}>
                Ops! We couldn't find <Text style={{ fontStyle: 'italic' }}>{searchTerm}</Text></Text>
            </View>
        }
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    borderBottomColor: theme.colors.dark, borderBottomWidth: 0.2,
    borderRadius: 100, borderColor: theme.colors.dark, paddingRight: 20,
    paddingLeft: 45, height: 35, width: '100%',
    color: theme.colors.dark, fontSize: fontSizes.large, fontWeight: 'medium'
  },
  resultContainer: {
    paddingBottom: 50,
    flex: 1
  },
  wrapHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10
  },
  iconShadow: {
    shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10
  }
});

export default Search;