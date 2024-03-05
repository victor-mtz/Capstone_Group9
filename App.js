import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { createWorker } from 'tesseract.js';
import * as DocumentPicker from 'expo-document-picker';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const myRef = useRef(null);
  const worker = useRef(null);

  useEffect(() => {
    initializeWorker();
    return () => {
      terminateWorker();
    };
  }, []);

  const initializeWorker = async () => {
    worker.current = createWorker();
    await worker.current.load();
  };

  const terminateWorker = async () => {
    if (worker.current !== null) {
      await worker.current.terminate();
      worker.current = null;
    }
  };

  const captureScreenshot = async () => {
    try {
      setLoading(true);
      const uri = await captureRef(myRef, { format: 'png', quality: 0.8 });
      console.log('Screenshot captured:', uri);
      await performOCR(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to capture screenshot');
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf,image/jpeg,image/png', 
      });
      if (result.type === 'success') {
        setSelectedFile(result);
        console.log('Selected file:', result);
        await performOCR(result.uri); 
      } else if (result.type === 'cancel') {
        console.log('User cancelled the document picker');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const performOCR = async (uri) => {
    try {
      await worker.current.load();
      await worker.current.loadLanguage('eng');
      await worker.current.initialize('eng');
      const { data: { text } } = await worker.current.recognize(uri);
      console.log('Extracted text:', text);
      setExtractedText(text);
      await worker.current.terminate();
    } catch (error) {
      console.error('Error performing OCR:', error);
      Alert.alert('Error', 'Failed to perform OCR');
    }
  };
  
  

  const handleTextChange = (text) => {
    setExtractedText(text); 
  };


  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View ref={myRef}>
        <Text>This is the content you captured</Text>
      </View>
      <Button title="Capture Screenshot" onPress={captureScreenshot} disabled={loading} />
      <Button title="Pick File" onPress={pickFile} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {selectedFile && (
        <View>
          <Text>Selected File:</Text>
          <Text>Name: {selectedFile.name}</Text>
          <Text>Type: {selectedFile.type}</Text>
          <Text>Size: {selectedFile.size} bytes</Text>
        </View>
      )}
      <Text>OCR Result:</Text>
      <TextInput
        value={extractedText}
        onChangeText={handleTextChange}
        style={{ marginTop: 20, width: '80%', height: 200, borderColor: 'gray', borderWidth: 1 }}
        multiline={true}
        editable={!loading}
      />
    </View>
  );
}

export default App;
