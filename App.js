import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, Image } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { createWorker } from 'tesseract.js';
import axios from 'axios';
import ImageUpload from './utils/imageUpload.js';
import Login from './components/login.jsx';
import RegistrationForm from './components/register.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageCapture from './components/ImageCapture.js';
import NavBar from './components/NavBar.js';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={NavBar}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Image Capture" component={ImageCapture} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
