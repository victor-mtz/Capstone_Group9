import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, Image, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { createWorker } from 'tesseract.js';
import * as ImagePicker from 'expo-image-picker';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [capturedImageUri, setCapturedImageUri] = useState('');
  const myRef = useRef(null);

  const loggerFunction = (m) => console.log(m);

  const captureScreenshot = async () => {
    try {
      const uri = await captureRef(myRef.current, {
        format: 'png',
        quality: 0.8,
      });
      console.log('Screenshot captured:', uri);
      setCapturedImageUri(uri); 
      performOCR(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to capture screenshot');
    }
  };

  const performOCR = async (uri) => {
    try {
      const worker = createWorker({
        logger: loggerFunction,
      });
      console.log("Worker object:", worker); 
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(uri);
      console.log('Extracted text:', text);
      setExtractedText(text);
      setEditedText(text);
      await worker.terminate();
    } catch (error) {
      console.error('Error performing OCR:', error);
      Alert.alert('Error', 'Failed to perform OCR');
    }
  };

  const handleTextChange = (text) => {
    setEditedText(text);
  };

  const pickImage = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageDataUrl = e.target.result;
          setCapturedImageUri(imageDataUrl);
          performOCR(imageDataUrl);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    } else {
      try {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }).then((result) => {
          console.log('Image Picker Result:', result);
  
          if (!result.cancelled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            setCapturedImageUri(selectedImageUri);
            performOCR(selectedImageUri);
          }
        });
      } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const clearData = () => {
    setCapturedImageUri('');
    setExtractedText('');
    setEditedText('');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Capture Screenshot" onPress={captureScreenshot} />
      <Button title="Load Image" onPress={pickImage} />
      {capturedImageUri ? (
        <View style={{ marginTop: 20 }}>
          <Image source={{ uri: capturedImageUri }} style={{ width: 200, height: 200 }} />
        </View>
      ) : null}
      <View ref={myRef}>
        <Text>This is the content you captured</Text>
      </View>
      <Button title="Clear" onPress={clearData} />
      <Text>OCR Result:</Text>
      <Text>{extractedText}</Text>
      <Text>Edit text below:</Text>
      <TextInput
        value={editedText}
        onChangeText={handleTextChange}
        style={{ marginTop: 20, width: '80%', height: 200, borderColor: 'gray', borderWidth: 1 }}
        multiline={true}
      />
    </View>
  );
}

export default App;
