import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import Login from "./Login";
import Start from "./Start";
import Register from "./Register";
import Profile from "./Profile";
import Home from "./Home";
import MediaScreen from "./MediaScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useStateValue } from './StateProvider';
import { auth, db } from './firebaseConfig';
import SearchContents from "./SearchContents"

export default function Index() {
  const Stack = createStackNavigator();

  const [{ user }, dispatch] = useStateValue();
  
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser
        });
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      // console.log('${user.uid}');
      db.collection('users').doc(user.uid).onSnapshot((doc) => {
        const userData = doc.data();

        // set user first name and last name
        dispatch({
          type: "SET_NAME",
          item: [userData.firstName, userData.lastName]
        });
        console.log(userData)
      });
    } else {
      dispatch({
        type: "SET_NAME",
        item: [null, null]
      });
    }
  }, [user]);

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
          {user ? (
            <>
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="SearchContents" component={SearchContents} />
              <Stack.Screen name="MediaScreen" component={MediaScreen} />
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