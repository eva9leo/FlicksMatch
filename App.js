import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider } from "./StateProvider"
import Index from "./Index"

export default function App() {

  return (
    <AuthProvider>
      <Index/>
    </AuthProvider>
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