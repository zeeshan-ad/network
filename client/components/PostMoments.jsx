import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, fontWeights, theme } from '../util/constants';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../store/editProfileSlice';
import { compliments } from '../util/constants';

const width = Dimensions.get("window").width;

export default function PostMoments({ navigation }) {
  const editProfile = useSelector(state => state.editProfile);

  const dispatch = useDispatch();

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


  const retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }

  const [Image, setImage] = useState();
  const _rotate90andFlip = async (photo) => {
    const manipResult = await manipulateAsync(
      photo,
      [{ rotate: -180 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImage(manipResult);
  };


  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', fontSize: fontSizes.medium, fontWeight: fontWeights.normal, marginHorizontal: 20 }}>
          We need your permission to show the camera
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

  const CameraPreview = ({ photo, retakePicture }) => {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20
        }}
      >
        <View style={{
          position: 'absolute',
          top: 60,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          zIndex: 9999,
        }}>
          <Pressable onPress={retakePicture} style={{
            shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
            shadowRadius: 1, elevation: 10,
          }}>
            <Ionicons name="close" size={30} color={theme.colors.light} />
          </Pressable>
          <Pressable onPress={() => {
            dispatch(setProfileData({
              bio: editProfile?.bio,
              image: Image?.uri,
            }));
            navigation.navigate('EditProfile');
          }}
            style={{
              shadowColor: theme.colors.dark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1,
              shadowRadius: 1, elevation: 10,
            }}>
            <Ionicons name="checkmark-sharp" size={30} color={theme.colors.light} />
          </Pressable>
        </View>
        <ImageBackground
          source={{ uri: Image?.uri }}
          style={{
            width: width, flex: 1,
          }}
        />
      </View >
    )
  }


  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview photo={capturedImage} retakePicture={retakePicture} />
      ) : (
        <>
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
        </>
      )}
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
