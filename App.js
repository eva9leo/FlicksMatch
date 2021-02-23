import React from 'react';
import { StyleSheet } from 'react-native';
// import { AuthProvider } from "./src/StateProvider"
import { StateProvider } from './src/StateProvider'
import reducer, { initialState } from './src/reducer'
import Index from "./src/Index"

export default function App() {

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Index/>
    </StateProvider>
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