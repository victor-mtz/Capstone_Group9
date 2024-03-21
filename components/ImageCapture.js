import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { createWorker } from 'tesseract.js';
import * as DocumentPicker from 'expo-document-picker';
function ImageCapture() {
  const [editedText, setEditedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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
  const runOCR = async (uri) => {
    try {
      const worker = await createWorker('eng');
      const {
        data: { text },
      } = await worker.recognize(uri);
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
  const clearData = () => {
    setSelectedFile(null);
    setEditedText('');
  };
  const saveTextToBackend = async () => {
    try {
      const response = await fetch('OUR API', {
        //ADD OUR API HERE!!!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ editedText }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Text saved successfully');
      } else {
        throw new Error('Failed to save text');
      }
    } catch (error) {
      console.error('Error saving text to backend:', error);
      Alert.alert('Error', 'Failed to save text to backend');
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Load Image" onPress={pickFile} />
        {selectedFile ? (
          <View style={{ marginTop: 20 }}>
            <Text>Selected Image: {selectedFile.name}</Text>
            <Image
              source={{ uri: selectedFile.uri }}
              style={{ marginTop: 10, width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        ) : null}
        <Button title="Run OCR" onPress={() => runOCR(selectedFile.uri)} />
        <Button title="Clear" onPress={clearData} />
        <Text>Edit Your Text:</Text>
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
        <Button title="Save" onPress={saveTextToBackend} />
      </View>
    </ScrollView>
  );
}
export default ImageCapture;