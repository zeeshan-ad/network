import React, { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';




export default function PostMoments({ navigation }) {



  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const [camera, setCamera] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true)
    setCapturedImage(photo?.uri)
    _rotate90andFlip(photo?.uri)
  };


  const _rotate90andFlip = async (photo) => {
    const manipResult = await manipulateAsync(
      photo,
      type === 'front' ? [{ rotate: 0 }, { flip: FlipType.Horizontal }] : [{ rotate: 0 }],
      { compress: 1, format: SaveFormat.PNG }
    );
    navigation.navigate('CameraPreview', { Image: manipResult });
  };



  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission?.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', fontSize: fontSizes.medium, fontWeight: fontWeights.normal, marginHorizontal: 20 }}>
          We need your permission to show the camera, this will enable you to take pictures and share them to your profile.
        </Text>
        <Pressable onPress={requestPermission}>
          <Text style={{
            textAlign: 'center', fontSize: fontSizes.medium, fontWeight: fontWeights.normal, marginHorizontal: 20,
            textDecorationLine: 'underline', marginTop: 20
          }}>
            Grant Permission
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)} ratio={'1:1'}>
      </Camera>
      <Pressable style={styles.CameraButton} onPress={takePicture}>
        <Ionicons name="ios-radio-button-off-sharp" size={100} color={theme.colors.light} />
      </Pressable>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{
          shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
          shadowRadius: 1, elevation: 10, marginLeft: -10
        }}>
          <Ionicons name="chevron-back" size={30} color={theme.colors.light} />
        </Pressable>
        <TouchableOpacity onPress={toggleCameraType} style={{
          shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
          shadowRadius: 1, elevation: 10,
        }}>
          <MaterialCommunityIcons name="camera-flip" size={30} color={theme.colors.light} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.light,
  },
  camBackground: {
    backgroundColor: theme.colors.light
  },
  camera: {
    flex: 1,
  },
  CameraButton: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
    shadowRadius: 1, elevation: 10,
  },
  header: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20
  },
  logo: {
    fontFamily: 'Pacifico',
    fontSize: fontSizes.xlarge,
    color: theme.colors.light,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
