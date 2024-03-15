import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { createWorker } from 'tesseract.js';
import * as DocumentPicker from 'expo-document-picker';

function ImageCapture() {
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const loggerFunction = (m) => console.log(m);

  const performOCR = async (uri) => {
    console.log('uri', uri);
    try {
      const worker = createWorker('eng', 1, {
        logger: loggerFunction,
      });
      const awaitedWorker = await worker;
      console.log('Worker object:', worker);
      const {
        data: { text },
      } = await awaitedWorker.recognize(uri);
      console.log('Extracted text:', text);
      setExtractedText(text);
      setEditedText(text);
      awaitedWorker.terminate();
    } catch (error) {
      console.error('Error performing OCR:', error);
      Alert.alert('Error', 'Failed to perform OCR');
    }
  };

  const handleTextChange = (text) => {
    setEditedText(text);
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf,image/png,image/jpeg',
      });

      if (result.assets && result.assets.length) {
        const pickerResults = result.assets[0];
        setSelectedFile(pickerResults);
      } else {
        console.error('pickFile failed');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const runOCR = () => {
    if (selectedFile) {
      performOCR(selectedFile.uri);
    } else {
      Alert.alert('Error', 'No file selected');
    }
  };

  const clearData = () => {
    setSelectedFile(null);
    setExtractedText('');
    setEditedText('');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Load Image" onPress={pickFile} />
      {selectedFile ? (
        <View style={{ marginTop: 20 }}>
          <Text>Selected Image: {selectedFile.name}</Text>
          {/*preview*/}
          <Image
            source={{ uri: selectedFile.uri }}
            style={{ marginTop: 10, width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
      ) : null}
      <Button title="Run OCR" onPress={runOCR} />
      <Button title="Clear" onPress={clearData} />
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
    </View>
  );
}

export default ImageCapture;