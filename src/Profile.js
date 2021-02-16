import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { auth } from "../firebaseConfig"
import { AuthContext } from "../StateProvider"

export default function Profile() {
    const {currentUser} = useContext(AuthContext);

    const logout = () => {
        if (currentUser) {
            auth.signOut()
        }
    }

    return (
        <View style={styles.container}>
            <Text>{"Hello, " + currentUser?.displayName}</Text>
            <View style={styles.startButtonContainer}>
                <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
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
    startButtonContainer: {
        position: "absolute",
        bottom: 40,
        width: "80%",
    }
});