import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import Login from "./src/Login";
import Start from "./src/Start";
import Register from "./src/Register";
import Profile from "./src/Profile";
import Home from "./src/Home";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from "./StateProvider";
import SearchContents from "./src/SearchContents"

export default function Index() {
  let isSignedIn = false;
  const Stack = createStackNavigator();

  const {currentUser} = useContext(AuthContext);

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
          {currentUser ? (
            <>
              <Stack.Screen name="Profile" component={Profile} ></Stack.Screen>
              <Stack.Screen name="Home" component={Home} ></Stack.Screen>
              <Stack.Screen name="SearchContents" component={SearchContents}></Stack.Screen>
            </>
          ) : (
            <>
            <Stack.Screen name="Start" component={Start} ></Stack.Screen>
            <Stack.Screen name="Login" component={Login} ></Stack.Screen>
            <Stack.Screen name="Register" component={Register} ></Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  image: {
    width: "10%",
    height: "10%",
    resizeMode: "contain",
    
  }
});