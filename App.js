import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, Image, Platform } from 'react-native';
import { createWorker } from 'tesseract.js';
import * as DocumentPicker from 'expo-document-picker';
function App() {
  const [token, setToken] = useState(null);
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
        style={{ marginTop: 20, width: '80%', height: 200, borderColor: 'gray', borderWidth: 1 }}
        multiline={true}
      />
    </View>
  );
}
export default App;