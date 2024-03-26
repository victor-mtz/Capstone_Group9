import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
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
      worker.terminate();
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
const saveImageToBackend = async () => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    const response = await fetch('http://localhost:5432/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      Alert.alert('Success', 'Image saved successfully');
    } else {
      throw new Error('Failed to save image');
    }
  } catch (error) {
    console.error('Error saving image to backend:', error);
    Alert.alert('Error', 'Failed to save image to backend');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Image Capture</Text>
      </View>
      <Button title="Load Image" onPress={pickFile} />
      {selectedFile ? (
        <View style={styles.imageContainer}>
          <Text>Selected Image: {selectedFile.name}</Text>
          <Image
            source={{ uri: selectedFile.uri }}
            style={styles.image}
            resizeMode="contain"
          />
          <Button title="Save Image" onPress={saveImageToBackend} />
        </View>
      ) : null}
      <Button title="Run OCR" onPress={() => runOCR(selectedFile.uri)} />
      <Button title="Clear" onPress={clearData} />
      <Text style={styles.textLabel}>Edit Your Text:</Text>
      <TextInput
        value={editedText}
        onChangeText={handleTextChange}
        style={styles.textInput}
        multiline={true}
      />
      <Button title="Save" onPress={saveImageToBackend}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    marginTop: 10,
    width: 200,
    height: 200,
  },
  textLabel: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 10,
    width: '80%',
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});
export default ImageCapture;