import React, { useState, useRef } from 'react';
import { View, TextInput, Button } from 'react-native';
import Login from './login';
import RegistrationForm from './register';

export default function NavBar({ navigation }) {
  return (
    <div style={{ width: '100%' }}>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button
        title="Capture Image"
        onPress={() => navigation.navigate('Image Capture')}
      />
    </div>
  );
}
