import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './utils/api/store.js';
import Login from './components/login.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageCapture from './components/ImageCapture.js';
import NavBar from './components/NavBar.js';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
export default App;