import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { auth } from "./firebaseConfig"
import { AuthContext } from "./StateProvider"
import { IconButton, Colors } from 'react-native-paper'

export default function Home({ navigation }) {
    const {currentUser} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text>{"This is the home page"}</Text>
            <IconButton style={styles.backButton} icon="account" color={Colors.white} size={45} onPress={() => navigation.goBack()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2784b",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 10
      },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    profileButtonContainer: {
        position: "absolute",
        bottom: 40,
        width: "80%",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: -5
    }
});