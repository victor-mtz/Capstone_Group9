import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, Image } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { createWorker } from 'tesseract.js';
import axios from 'axios';
import ImageUpload from './utils/imageUpload.js';


function App() {
  const [extractedText, setExtractedText] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [editedText, setEditedText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const myRef = useRef(null);
  const captureScreenshot = async () => {
    console.log('myRef', myRef);
    try {
      const captureSource = document.getElementById('image-container');
      const uri = await captureRef(captureSource, {
        format: 'png',
        quality: 0.8,
      });
      console.log('Screenshot captured:', uri);
      performOCR(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to capture screenshot');
    }
  };
  const performOCR = async (uri) => {
    try {
      const worker = createWorker();
      const awaitedWorker = await worker;
      awaitedWorker.load;
      awaitedWorker.loadLanguage('eng');
      awaitedWorker.initialize('eng');
      const {
        data: { text },
      } = await awaitedWorker.recognize(uri);
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
  const onImageLoad = async (idk) => {
    const file = idk.target.files[0];
    const imageContainer = document.getElementById('image-container');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUri(reader.result);
      setImageLoaded(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    console.log(file);
  };
  const saveImageData = async () => {
    try {
      // Make API call to your backend server to save image data and extracted text
      const response = await axios.post('http://localhost:5432/uploadImage', {
        imageData: imageUri,
        extractedText: extractedText,
      });
      console.log('Image data saved:', response.data);
      // You can handle the response as needed
    } catch (error) {
      console.error('Error saving image data:', error);
      Alert.alert('Error', 'Failed to save image data');
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Capture Screenshot" onPress={captureScreenshot} />
      <input type="file" accept="image/*" onChange={onImageLoad} />
      {imageLoaded ? <div>Image Preview:</div> : ''}
      <img
        style={
          imageLoaded
            ? {
                height: '150px',
                width: '150px',
              }
            : null
        }
        id="image-container"
        src={imageUri}
      />
      {imageLoaded ? (
        <View>
          <Text>OCR Result:</Text>
          <Text>{extractedText}</Text>
          <Text>Edit text below:</Text>
          <TextInput
            value={editedText}
            onChangeText={handleTextChange}
            style={{
              marginTop: 20,
              width: '80%',
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            multiline={true}
          />
          <Button title="Save Image Data" onPress={saveImageData} />
        </View>
        
      ) : (
        ''
      ) } ( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ImageUpload userId={userId} />
  </View>)
    </View>
  );
}
export default App;
