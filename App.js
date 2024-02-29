import { createWorker } from 'tesseract.js';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const myRef = useRef(null);

  const captureScreenshot = async () => {
    try {
      const uri = await captureRef(myRef, {
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

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const uri = URL.createObjectURL(file);
      console.log('Image uploaded:', uri);
      performOCR(uri);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const performOCR = async (uri) => {
    try {
      const worker = createWorker();
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View ref={myRef}>
        <Text>This is the content you captured</Text>
      </View>
      <Button title="Capture Screenshot" onPress={captureScreenshot} />
      <Text>Upload image from device</Text>
      <Text>OCR Result:</Text>
      <Text>{extractedText}</Text>
      <Text>Edit text below:</Text>
      <textarea
        value={editedText}
        onChangeText={handleTextChange}
        style={{ marginTop: 20, width: '80%', height: 200, borderColor: 'gray', borderWidth: 1 }}
      />
    </View>
  );
}

export default App;