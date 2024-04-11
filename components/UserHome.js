import { useState, useEffect } from 'react';
import { useMeQuery } from '../utils/api/authSlice';
import {
  Image,
  Button,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function UserHome() {
  const meData = useMeQuery();
  const [userData, setUserData] = useState([{}]);
  const [imageSrcs, setImageSrcs] = useState([]);

  async function getUserData() {
    try {
      const userId = meData.data.id;
      const userData = await fetch(
        `http://localhost:5433/api/images/user/${userId}`
      );
      if (userData) {
        const userImages = await userData.json();
        const imagesArray = userImages.images.map((image) => image.image_data);
        setUserData(imagesArray);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    let localImgSrcs = [];
    if (userData.length) {
      userData.forEach((hexData) => {
        const byteArray = hexToByteArray(hexData);
        const imageSrc = byteArrayToImage(byteArray);
        localImgSrcs.push(imageSrc);
      });
      setImageSrcs(localImgSrcs);
    }
  }, [userData]);

  function hexToByteArray(hexValue) {
    const bytes = [];
    for (let i = 0; i < hexValue.length; i += 2) {
      bytes.push(parseInt(hexValue.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
  }

  function byteArrayToImage(byteArray) {
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  return (
    <ScrollView>
      <Text>Welcome {meData.data?.first_name}!</Text>
      <Button
        title="Get User Images"
        onPress={() => getUserData()}
        style={styles.button}
      />
      {imageSrcs.map((image, i) => {
        return (
          <View key={`view-${i}`}>
            <Text key={`heading-text-${i}`}>Image: {i}</Text>
            <Image
              key={`image-${i}`}
              source={{ uri: image }}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    padding: 20,
    margin: 20,
  },
  image: {
    marginTop: 10,
    width: 200,
    height: 200,
  },
});
