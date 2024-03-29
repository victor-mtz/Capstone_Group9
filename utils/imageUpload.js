import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const ImageUpload = ({ userId }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('userId', userId);

      const response = await axios.post(
        'http://localhost:5433/api/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const selectImage = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.uri) {
        setSelectedImage({
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        });
      }
    });
  };

  return (
    <View>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
        <Button title="Upload Image" onPress={handleImageUpload} />
      )}
    </View>
  );
};

export default ImageUpload;
