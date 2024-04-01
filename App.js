import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './utils/api/store.js';
import Login from './components/login.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageCapture from './components/ImageCapture.js';
import NavBar from './components/NavBar.js';
import { useLogoutMutation } from './utils/api/authSlice.js';
import UserHome from './components/UserHome.js';

const Stack = createNativeStackNavigator();

function App() {
  const activeToken = window.sessionStorage.token;
  return (
    <Provider store={store}>
      <NavigationContainer>
        {!activeToken ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={NavBar}
              options={{ title: 'Welcome' }}
            />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Image Capture" component={ImageCapture} />
            <Stack.Screen name="User Home" component={UserHome} />
          </Stack.Navigator>
        ) : (
          <div>
            You're Logged In!
            <LogOut />
          </div>
        )}
      </NavigationContainer>
    </Provider>
  );
}
export default App;

function LogOut() {
  const [logout] = useLogoutMutation();
  return <button onClick={logout}>Logout</button>;
}
