import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';


export default function App() {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>アプリがカメラへのアクセスを求めています。</Text>
        <Button onPress={requestPermission} title="許可" />
      </View>
    );
  }

  //写真を撮影する
  const takePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({options});
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //写真を保存する
  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert('写真を保存しました。');
        setImage(null);
        console.log('保存完了');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
            <Button style={styles.button} title='撮影' onPress={takePicture}></Button>
        </View>
      </CameraView>
      <Image source={{ uri: image }} style={styles.camera} />
      <Button style={styles.button} title="保存" onPress={savePicture}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
   	display:'block',
	backgroundColor: 'blue',
	color: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
