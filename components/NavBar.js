import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
export default function NavBar({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Login/Register"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Capture Image"
        onPress={() => navigation.navigate('Image Capture')}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
