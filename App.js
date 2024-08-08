import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Button } from 'react-native-paper';

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
        <Text style={styles.text}>アプリがカメラへのアクセスを求めています。</Text>
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
        console.log(asset);
        Alert.alert('保存完了', '写真を保存しました', [
          {text: '閉じる', onPress: () => console.log('Cancel Pressed'),},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}> 
          {/* 上部のオーバーレイ */}
          <TouchableOpacity style={styles.overlayTop}>
            <Text style={styles.text}>分類したい物体を撮影してください</Text>
          </TouchableOpacity>
          {/* 下部のオーバーレイ */}
          <TouchableOpacity style={styles.overlayBottom}>
            <Button icon="camera" mode="contained" style={styles.takeButton} onPress={takePicture}>撮影</Button>
            {/* 撮影した画像を表示 */}
            <View style={styles.saveContainer}>
              {/* imgageがある場合だけ表示 */}
              {image && <Image source={{ uri: image }} style={styles.takedImg} /> }
              {image && <Button icon="file" mode="contained" style={styles.saveButton} onPress={savePicture}>保存</Button> }
            </View>
          </TouchableOpacity>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  saveContainer: {
    marginTop: 16,
    marginBottom :16,
  },
  camera: {
    flex: 1,
  },
  overlayTop:{
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  overlayBottom:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  takeButton: {
    color: '#fff',
    backgroundColor: '#ff0000',
    width: 100,
    marginTop: 16,
  },
  saveButton: {
    color: '#fff',
    width: 100,
    marginTop: 16,
  },
  takedImg:{
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  }
});
